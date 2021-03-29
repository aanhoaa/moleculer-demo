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
			{
				path: "/product",

				// Whitelist of actions (array of string mask or regex)
				whitelist: [
					"product.*",
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
					"POST create": "product.create",
					//"POST variant/create": "product.addProductVariant",
					
					"POST variant/create"(req, res) {
						this.createProduct(req, res)
					},
					"POST variant/update"(req, res) {
						this.updateProduct(req, res)
					},


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
					//ctx.meta.cookie= req.headers.cookie
					req.headers.authorization = req.headers.cookie;
				},

				// onAfterCall(ctx, route, req, res, data) {
				// 	this.logger.info("onAfterCall in protected route");
				// 	res.setHeader("X-Response-Type", typeof(data));

				// 	return data;
				// },

				// Route error handler
				onError(req, res, err) {
					res.setHeader("Content-Type", "text/plain");
					res.writeHead(err.code || 500);
					res.end("Route error: " + err.message);
				},
				
			},
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
			let token;
			if (req.headers.authorization) {
				this.logger.info(req.headers.authorization);
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token") {
					token = req.headers.authorization.split(" ")[1];
				}
			}
			if (!token) {
				return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
			}
			// Verify JWT token
			return ctx.call("auth.resolveToken", { token })
				.then(user => {
					if (!user)
						return Promise.reject(new UnAuthorizedError(ERR_INVALID_TOKEN));

					ctx.meta.user = user;
				});
		},

		async createProduct(req, res){
			try {
				let data = await this.uploadFile(req, res);
				let { name, product_id, description, SKU } = data.body;
				let arrImg = [];
				let arrImgData = [];
			
				// xử lý phần upload file (3 file )
				//console.log('trace:', data.files['img1'])
				if(data.files && data.files['img1']) {
					arrImg.push(data.files['img1'][0].path);
					if (data.files['img2']) arrImg.push(data.files['img2'][0].path);
					if (data.files['img3']) arrImg.push(data.files['img3'][0].path);
					
					for (let i = 0; i < arrImg.length; i++) {
						const result =  await cloudinary.v2.uploader.upload(arrImg[i]);
						arrImgData.push(result.secure_url);
					}
					
					let data2 = await dbUser.productVariantAdd([product_id, name, description, SKU, arrImgData]);
					let send = {status: true,message: "succes", data: data2};
					res.end(JSON.stringify(send))
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
