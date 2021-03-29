"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "category",

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

		// add new category parents
		create: {
            rest: "POST /",
          //  auth: 'required',
            params: {
              name: { type: "string" },
              description: { type: "string" },
            },
            async handler(ctx) {
              try {
                    let data = await dbUser.cateInsert([ctx.params.name, ctx.params.description]);
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

		//add category child from parents
		addCateChild: {
			rest: "POST /:id",
			params: {
				name: 'string',
				description: 'string'
			},
			async handler(ctx) {
				try {
                    let data = await dbUser.childCateInsert([ctx.params.id, ctx.params.name, ctx.params.description]);
                   	return reponseErrorAPI(true,"Success", data)	
                    } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                }
			}
		},

		childUpdate: {
            rest: "PUT /:id",
            params: {
              name: 'string',
              description: 'string',
            },
            async handler(ctx) {
              	try {
                    	let data = await dbUser.childCateUpdate([ctx.params.id, ctx.params.name, ctx.params.description,]);
                    	return reponseErrorAPI(true,"Success", data)	
                } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                }
            }
		},
		
		//get list category children -- đang gọi 2 phương thức, dài dòng cần gộp lại
		childList: {
			rest: "GET /:id",
			async handler(ctx) {
				console.log(ctx.meta.path)
				try {
                    let data = await dbUser.getListCateChildren([ctx.params.id]);
                    return reponseErrorAPI(true,"Success", data)	
                } catch (error) {
                    return reponseErrorAPI(false,error.message, [])
                }
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
