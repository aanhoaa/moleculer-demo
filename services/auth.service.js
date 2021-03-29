"use strict";
const  jwt  = require('jsonwebtoken');
const _ 					= require("lodash");
const { promisify }			= require("util");
const { MoleculerError } 	= require("moleculer").Errors;

const JWT_SECRET = "TOP SECRET!!!";
const REFRESH_JWTSECRET = "REFRESH TOP SECRET!!!";

// Fake user DB
const users = [
	{ id: 1, username: "admin", password: "admin", role: "admin" },
	{ id: 2, username: "test", password: "test", role: "user" }
];

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
			rest: "/login",
			params: {
				username: 'string',
				password: 'string'
			},
			handler(ctx) {
				let user = users.find(u => u.username == ctx.params.username && u.password == ctx.params.password);
				const { username, password } = ctx.params;
				return this.Promise.resolve()
				.then(() => ctx.call('users.getUser', { username }))
				.then((user) => {
					if (!user) {
						return this.Promise.reject(new MoleculerError("Invalid credentials", 400));
					}
					
					const tokenRefresh = jwt.sign(user, REFRESH_JWTSECRET);
					ctx.meta.$responseHeaders = {
						'Set-Refresh': ` Refesh${12};Path=/;Max-Age=${Number(60*60)}`,
					};

					const token = this.addToken(user, ctx.meta.user);
					ctx.meta.$responseHeaders = {
						'Set-Cookie': `Token ${token.token};Path=/;Max-Age=${Number(60) *
							60}`,
					};

					return token;
				});	
			}
		},

		//register
		register: {
			rest: "/register",
			params: {
				username: 'string',
				email: 'string',
			},
			handler(ctx) {
				return ctx.call('users.create', {username: ctx.params.username, email: ctx.params.email});
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
				}).then(decoded => {
					if (decoded.id) {
						return users.find(u => u.id == decoded.id);
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
		}
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
				{ id: user.id, username: user.username },
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
