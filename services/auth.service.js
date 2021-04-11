"use strict";
const  jwt  = require('jsonwebtoken');
const _ 					= require("lodash");
const { promisify }			= require("util");
const { MoleculerClientError  } 	= require("moleculer").Errors;
const bcrypt = require('bcrypt');
const JWT_SECRET = "TOP SECRET!!!";
const REFRESH_JWTSECRET = "REFRESH TOP SECRET!!!";
const dbUser = require('../lib/helpers');

module.exports = {
	name: "auth",

	/**
	 * Settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
        // login
        login: {
			rest: "POST /",
			params: {
				username: { type: "string", min: 4 },
				password: 'string'
			},
			handler(ctx) {
				const {username, password} = ctx.params;
				return ctx.call('users.getUser', {username})
				.then(user => {
					console.log('user:', user)
					if (!user) {
						if (!user.data)
							return this.Promise.reject(new MoleculerClientError ("Username is invalid", 400));
					}
					
					return bcrypt.compare(password, user.password).then((res2) => {
						if (!res2) {
							return this.Promise.reject(
								new MoleculerClientError(
								  'Username or password is invalid!',
								  422,
								  '',
								  [{ field: 'password', message: 'is not valid' }],
								),
							  );
						}

						if (user.isverified === 0) {
							return ctx.call('mailer.send', {
								to: ctx.params.email,
								subject: "Hello Mailer",
								html: `<a href="http://localhost:3000/api/verified/${username}/${user.tokenconfirm}">Click vào đây để xác nhận email</a>`
							})
							.then(() => {
								return this.Promise.reject(
									new MoleculerClientError(
									  'Your account is not verify',
									  422,
									  '0',
									  [{ field: 'Verified', message: 'is not verified yet' }],
									),
								);
							})
						}
						
						//token
						const tokenRefresh = jwt.sign(user, REFRESH_JWTSECRET);
						ctx.meta.$responseHeaders = {
						'Set-Refresh': ` Refesh${12};Path=/;Max-Age=${Number(60*60)}`,
						};

						const token = this.addToken(user, ctx.meta.user);
						ctx.meta.$responseHeaders = {
						'Set-Cookie': `Token="Token ${token.token};Path=/;Max-Age=${Number(60) *
							60}`,
						};

						return token;
						});
				})
				
			}
		},

		//register
		register: {
			rest: " POST /",
			params: {
				username: 'string',
				email: 'string',
				password: 'string',
				confirmpassword: 'string'
			},
			handler(ctx) {
				const hashToken = this.makeid(12);

				return ctx.call('users.create', {
					username: ctx.params.username, 
					email: ctx.params.email, 
					password: ctx.params.password, 
					tokenconfirm: hashToken
				})
				.then(res => {
					if (res.data.type != 0) {
						return ctx.call('auth.login', {
							username: ctx.params.username, 
							password: ctx.params.password,
							email: ctx.params.email,
							tokenconfirm: hashToken
						});
					}
					 
					return res.data.message;
				})
			}
		},
        /**
		 * Verify a JWT token
		 *
		 * @param {any} ctx
		 * @returns
		 */
		

		/**
		 * Get User entity by ID
		 *
		 * @param {any} ctx
		 * @returns
		 */
		getUserByID(ctx) {
			return users.find(u => u.id == ctx.params.id);
		},

		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: {
				token: "string"
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, JWT_SECRET, (err, decoded) => {
						if (err) {
							return reject(err);
						}
						console.log('de:', decoded)
						// check time login - now < 5 ms => check user have refresh token? => refresh new token
						if (
							Math.floor((decoded.exp - new Date().getTime() / 1000) / 60) <
							Number(5)
						)
						{
							// Generate new JWT Token if the token is expiring soon
							const token = this.generateToken(decoded);
							ctx.meta.$responseHeaders = {
								'Set-Cookie': `Token ${token};Path=/;Max-Age=${Number(60) *
									60}`,
							};
						}
						resolve(decoded);
					});
				}).then(async decoded => {
					if (decoded.role) {
						return decoded.role;
					}
				});
			}
		},

		logout: {
			rest: "/logout",
			handler(ctx) {
				ctx.meta.$responseHeaders = {
					'Set-Cookie': `Token ;Path=/;Max-Age=${Number(0)};HttpOnly=true` 
				};
				return '123';
			}
		},

		//admin login
		adminLogin: {
			rest: "POST /",
			params: {
				username: 'string',
				password: 'string'
			},
			handler(ctx) {
				const {username, password} = ctx.params;
				return ctx.call('admin.getAdmin', {username})
				.then(user => {
					if (!user) {
						return this.Promise.reject(new MoleculerClientError ("Invalid credentials", 400));
					}
					
					return bcrypt.compare(password, user.password).then((res2) => {
						if (!res2) {
							return this.Promise.reject(
								new MoleculerClientError(
								  'Username or password is invalid!',
								  422,
								  '',
								  [{ field: 'password', message: 'is not valid' }],
								),
							  );
						}
						
						//token
						// const tokenRefresh = jwt.sign(user, REFRESH_JWTSECRET);
						// ctx.meta.$responseHeaders = {
						// 'Set-Refresh': ` Refesh${12};Path=/;Max-Age=${Number(60*60)}`,
						// };

						const token = this.addToken(user, ctx.meta.user);
						ctx.meta.$responseHeaders = {
						'Set-Cookie': `Token ${token.token};Path=/;Max-Age=${Number(60) *
							60}`,
						};

						return token;
						});
				})
				
			}
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Generate JWT token
		 *
		 * @param {any} user
		 * @returns
		 */
        
		generateToken(user) {
			return jwt.sign(
				// eslint-disable-next-line no-underscore-dangle
				{ 
					username: user.username,
					role: user.role
				},
				JWT_SECRET,
				{ expiresIn: '5m' },
			  );
		},
		/**
   * Function to return an identity and the JWT token.
   *
   * @param {User} user the authenticated user
   * @param {String} token the JWT token
   */
  addToken(user, token) {
    const identity = {
    };

	identity.token = token || this.generateToken(user);
	
    return identity;
  },

  /*
  create token confirm email
  */
  makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  }
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
        // Create Promisify encode & verify methods
      	// this.encode = promisify(jwt.sign);
        this.verify = promisify(jwt.verify);
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
