"use strict";
const fs = require("fs");
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const cloudinary = require('cloudinary') 
const mkdir = require("mkdirp").sync;
//const { upload } = require('../lib/multer');

cloudinary.config({
    cloud_name: 'do3we3jk1',
    api_key: 554259798325127,
    api_secret: 'EidUs6TZ54dIS1HRxdurHuQS4hw'
});

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "product",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		// add new product parents
		create: {
            rest: "POST /",
          //  auth: 'required',
            params: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
            },
            async handler(ctx) {
              try {
                    let data = await dbUser.productInsert([ctx.params.id, ctx.params.name, ctx.params.description]);
                    return reponseErrorAPI(true,"Success", data)	
                    } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                }
            }
        },

		//update category by id
        update: {
            rest: "PUT /:id",
            params: {
              name: 'string',
              description: 'string',
            },
            async handler(ctx) {
					console.log(ctx)
              	try {
                    	let data = await dbUser.parentCateUpdate([ctx.params.id, ctx.params.name, ctx.params.description,]);
                    	return reponseErrorAPI(true,"Success", data)	
                } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                }
            }
        },

		// remove category by id
        delete: {
            rest: "DELETE /:id",
            async  handler(ctx) {
              	try {
                    	let data = await dbUser.cateDelete([ctx.params.id]);
                    	return reponseErrorAPI(true,"Success", data)	
              	} catch (error) {
                    	return reponseErrorAPI(false,error.message, [])
                }
            }
        },
		
		//get list category parents
		list: {
			rest: "GET /",
			async handler(ctx) {
				
				try {
                    let data = await dbUser.getListCateParents();
                    return reponseErrorAPI(true,"Success", data)	
                } catch (error) {
                    return reponseErrorAPI(false,error.message, [])
                }
			}
		},

        addProductVariant: {
            rest: "POST /",
            // params: {
            //     product_id: 'string',
            //     name: 'string',
            //     description: 'string',
            //     sku: 'string',
            // },
            async handler(ctx) {
                return new this.Promise((resolve, reject) => {
                    const filePath = ctx.meta.filename;
					const {product_id, name, description, SKU} = ctx.meta.$multipart;
					
                    const f = fs.createWriteStream(filePath);
					f.on("close", async () => {
						// File written successfully
						const result =  await cloudinary.v2.uploader.upload(filePath);
						//console.log('call:', result.secure_url)
                        //xử lý save db, check data multipart map qua
                        try {
                             let data = await dbUser.productVariantAdd([product_id, name, description, SKU, result.secure_url]);
                             resolve( reponseErrorAPI(true,"Success", data))	
                            } catch (error) {
                                 return reponseErrorAPI(false,error.message, [])
                         }
						//resolve(true);
					});

					ctx.params.on("error", err => {
						this.logger.info("File error received", err.message);
						reject(err);

						// Destroy the local file
						f.destroy(err);
					});

					f.on("error", () => {
						// Remove the errored file.
						fs.unlinkSync(filePath);
					});

					ctx.params.pipe(f);
				});
				
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
        // uploadFile(req, res) {
        //     return new Promise((resolve , reject) => {
        //         let uploadSingle = upload.single('image');
        //         uploadSingle(req, res, function (err) {
        //             if(err) {
        //                 reject(err)
        //             } else{
        //                 resolve(req) //dg dan
        //             }
        //         })
        //     })
        // },
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

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
