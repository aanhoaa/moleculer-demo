"use strict";
const { upload } = require('../lib/multer');
const cloudinary = require('cloudinary');
const ApiGateway = require("moleculer-web");
const dbUser = require('../lib/helpers');
const { ForbiddenError, UnAuthorizedError, ERR_NO_TOKEN, ERR_INVALID_TOKEN } = require("../src/errors");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

cloudinary.config({
    cloud_name: 'do3we3jk1',
    api_key: 554259798325127,
    api_secret: 'EidUs6TZ54dIS1HRxdurHuQS4hw'
});

module.exports = {
	name: "api",
	version: 1,
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],
		path: "/api",
		routes: [
			//user
			{
				
				path: "/users",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"users.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				
				authorization: true,

				roles: ["admin"],

				// Action aliases
				aliases: {
					"GET list": "users.list",
					"GET get": "users.getName",
					"POST create": "users.create",
					"PUT update": "users.update",
					"DELETE delete": "users.remove",
					"health": "$node.health",
					"custom"(req, res) {
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,

				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				},
				
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}

				
			},
			//category
			{
				path: "/category",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"category.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				
				authorization: true,

				roles: ["admin"],

				// Action aliases
				aliases: {
					"POST create": "category.create",
					"PUT update": "category.update",
					"DELETE delete": "category.delete",
					"GET list" : "category.list",

					"POST child/create": "category.addCateChild",
					"PUT child/update": "category.childUpdate",
					"GET child/list" : "category.childList",
					
					"custom"(req, res) {
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,

				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				},
				
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					//ctx.meta.cookie= req.headers.cookie
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}	
			},
			//product
			{
				path: "/product",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"product.*",
					"greeter.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				
				//authorization: true,

				roles: ["admin"],
				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false 
					}
				},

				// Action aliases
				aliases: {
					// for test
					"POST hello": "greeter.hello",
					//
					//"POST create": "product.create",
					"POST /create"(req, res) {
						this.createProduct(req, res)
					},
					"POST variant/update"(req, res) {
						this.updateProduct(req, res)
					},

					"POST import/create": "product.importGoods",
					"PUT import/confirm": "product.confirmImportGoods",
					"GET import/list": "product.listImportGood",
					"GET import/list/detail": "product.listImportGoodDetail",


					"custom"(req, res) { 
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,
 
				busboyConfig: {
					limits: {
						files: 1
					}
				},

				callOptions: {
					meta: {
						a: 5
					}
				},
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				},
				
			},
			//util
			{
				path: "/util",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"util.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				// tạm thời đang tắt để dev
				//authorization: true,

				roles: ["admin"],

				// Action aliases
				aliases: {
					"POST color/add": "util.colorAdd",
					"POST size/add": "util.sizeAdd",
					
					
					"custom"(req, res) {
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,

				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				},
				
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					//ctx.meta.cookie= req.headers.cookie
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}	
			},
			//upload
			{
				
				path: "/upload",

				authorization: false,

				bodyParsers: {
					json: false,
					urlencoded: false
				},

				aliases: {
					"POST /": "file.save",
					"POST /multi": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: {
								files: 3
							}
						},
						action: "file.save"
					}
				},

				// https://github.com/mscdex/busboy#busboy-methods
				busboyConfig: {
					limits: {
						files: 2
					}
				},

				callOptions: {
					meta: {
						a: 5
					}
				},

				mappingPolicy: "restrict" 
			},
			//auth
			{
				// Path prefix to this route
				path: "/",

				// Middlewares
				use: [
				],

				etag: true,
				cors: true,

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"auth.*",
					"users.*",
					"file.*",
					"test.*",
					/^math\.\w+$/
				],

				authorization: false,

				// Convert "say-hi" action -> "sayHi"
				camelCaseNames: true,

				// Action aliases
				aliases: {
					"POST login": "auth.login",
					"POST register": "auth.register",
					"GET verified/:username/:cftk": "users.verified",
					"add": "math.add",
					"add/:a/:b": "math.add",
					"GET sub": "math.sub",
					"POST divide": "math.div",
					"GET wrong": "test.wrong"
				},

				// Use bodyparser module
				bodyParsers: {
					json: true,
					urlencoded: { extended: true }
				},

				callOptions: {
					timeout: 3000,
					//fallbackResponse: "Fallback response via callOptions"
				},

				onBeforeCall(ctx, route, req, res) {
					return new this.Promise(resolve => {
						this.logger.info("async onBeforeCall in public. Action:", ctx.action.name);
						ctx.meta.userAgent = req.headers["user-agent"];
						resolve();
					});
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("async onAfterCall in public: ");
					return new this.Promise(resolve => {
						//ctx.meta.authorization = data.token;
						
						resolve(data);
					});
				},
			},
			//supplier
			{
				path: "/supplier",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"supplier.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				// tạm thời đang tắt để dev
				//authorization: true,

				roles: ["admin"],

				// Action aliases
				aliases: {
					"POST create": "supplier.create",
					
					
					
					"custom"(req, res) {
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,

				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				},
				
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					//ctx.meta.cookie= req.headers.cookie
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}	
			},
			//admin
			{
				path: "/admin",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"admin.*",
					"$node.*"
				],

				// Route CORS settings
				cors: {
					origin: ["https://localhost:3000", "https://localhost:4000"],
					methods: ["GET", "OPTIONS", "POST"],
					
				},
				cors: true,
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				// tạm thời đang tắt để dev
				authorization: true,

				roles: ["admin"],

				// Action aliases
				aliases: {
					"POST create": "admin.create",
					//"POST login": "admin.login",
					
					
					
					"custom"(req, res) {
						res.writeHead(201);
						res.end();
					}
				},
				autoAliases: true,

				// Use bodyparser module
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				},
				
				onBeforeCall(ctx, route, req, res) {
					this.logger.info("onBeforeCall in protected route");
					//ctx.meta.cookie= req.headers.cookie
					req.headers.authorization = req.headers.cookie;
				},

				onAfterCall(ctx, route, req, res, data) {
					this.logger.info("onAfterCall in protected route");
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

					return data;
				},

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				}	
			},

			
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token == "123456") {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: "John Doe" };

				} else {
					// Invalid token
					throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);
				}

			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		authorize(ctx, route, req) {
			let authToken;
			const authHeader = req.headers.authorization;
			if (authHeader) {
			const [type, value] = authHeader.split(' ');
			if (type === 'Token' || type === 'Bearer') {
				authToken = value;
			}
			}
			
			return this.Promise.resolve(authToken)
			.then((token) => {
				if (token) {
				// Verify JWT token
				return ctx
					.call('auth.resolveToken', { token })
					.then((user) => {
					if (user) {
						this.logger.debug('Authenticated via JWT: ', user.username);
						const { id, username } = user;
						ctx.meta.user = {
						id,
						username,
						};
						ctx.meta.token = token;
					}
					return user;
					})
					.catch((err) => {
					this.logger.warn(err);
					return null;
					});
				}
				return null;
			})
			.then((user) => {
				if (req.$endpoint.action.roles === 'user' && user != 'user') {
					return this.Promise.reject(new UnAuthorizedError());
				}
				if (req.$endpoint.action.roles === 'admin' && user != "admin") {
					return this.Promise.reject(new UnAuthorizedError());
				}
				
				return this.Promise.resolve(user);
			});
		},

		async createProduct(req, res){
			try {
				let data = await this.uploadFile(req, res);
				let { name, description, cate2, cate3, brand, SKU, loop, 
					  color, price, stock, sku
				} = data.body;
				let arrImg = [];
				let arrImgData = [];
				
				
				// xử lý phần upload file (3 file )
				//console.log('trace:', data.files['img1'])
				if(data.files && data.files['img1']) {
					arrImg.push(data.files['img1'][0].path);
					if (data.files['img2']) arrImg.push(data.files['img2'][0].path);
					if (data.files['img3']) arrImg.push(data.files['img3'][0].path);
					
					// for (let i = 0; i < arrImg.length; i++) {
					// 	const result =  await cloudinary.v2.uploader.upload(arrImg[i]);
					// 	arrImgData.push(result.secure_url);
					// }
					
					
					let send = {status: true,message: "succes", data: data2};
					res.end(JSON.stringify(send))

					//handle 
					for (let i = 0; i < loop; i++) {
						let data2 = await dbUser.productVariantAdd([
							name, description, 
							cate2, cate3, brand,
							color[i], price[i], stock[i], sku[i]
						]);
					}
					
				} else{
					let send = {status: false,message: "Photos must not be empty" , data: []};
					res.end(JSON.stringify(send))
				}

			} catch (error) {
				console.log('error', error)
				let send = {status: false,message: error.message , data: []};
				res.end(JSON.stringify(send))
			}
		},
		async updateProduct(req, res){
			try {
				let data = await this.uploadFile(req, res);
				let { id, name, category_id, description, price } = data.body;
				if(data.file && data.file.path) {
					let path = data.file.path;
					console.log('path', path)
					let result = await this.updateDbProduct(id, name, category_id, description, price, path);
					let send = {status: true,message: "succes", data: result};
					res.end(JSON.stringify(send))
				}
				else{
					let send = {status: false,message: "Photos must not be empty" , data: []};
					res.end(JSON.stringify(send))
				}
			} catch (error) {
				let send = {status: false,message: error.message , data: []};
				res.end(JSON.stringify(send))
			}
		},
		uploadFile(req, res) {
			return new Promise((resolve , reject) => {
				let uploadImg = upload.fields([
					{ name: 'img1', maxCount: 1 }, { name: 'img2', maxCount: 1 }, { name: 'img3', maxCount: 1 }
				]);
				uploadImg(req, res, function (err) {
					if(err) {
						reject(err)
					} else{
						resolve(req) //dg dan
					}
				})
			})
		},

		insertDbProduct(name, category_id, description, price, path){
			return new Promise( async (resolve, reject) => {
				try {
					let checkCategoryExist = await checkCategoryExits(category_id);
					if(!checkCategoryExist) {
						reject({
							type: TYPE,
							message: 'Category not exist'
						})
					}
					let result = await insertProduct(name, category_id, path, description, price );
					return resolve(result)
				} catch (error) {
					reject(error)
				}
			})
		},

		updateDbProduct(id,name, category_id, description, price, path){
			return new Promise( async (resolve, reject) => {
				try {
					let checkCategoryExist = await checkCategoryExits(category_id);
					if(!checkCategoryExist) {
						reject({
							type: TYPE,
							message: 'Category not exist'
						})
					}
					let checkProductExist = await checkExist(id);
					if(!checkProductExist) {
						return reject({
							type: TYPE,
							message: 'Product not exist'
						})
					}
					let result = await updateProduct(id, name, category_id, path, description, price );
					resolve(result)
				} catch (error) {
					reject(error)
				}
			})
		}

	}
};
