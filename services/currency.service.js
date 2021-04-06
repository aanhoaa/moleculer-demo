"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const cloudinary = require('cloudinary'); 
const db = require('../lib/db');


cloudinary.config({
    cloud_name: 'do3we3jk1',
    api_key: 554259798325127,
    api_secret: 'EidUs6TZ54dIS1HRxdurHuQS4hw'
});

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "currency",

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

		// pay slip(phiếu chi)
		paySlipCreate: {
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
