"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "supplier",

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

        //create supplier
        create: {
            rest: "POST /",
            params: {
                name: 'string',
                phone: 'string',
                address: 'string',
                email: 'string',
                note: 'string'
            },
            async handler(ctx) {
                try {
                    let data = await dbUser.insertSupplier(
                        [
                            ctx.params.name, 
                            ctx.params.phone, 
                            ctx.params.address, 
                            ctx.params.email, 
                            ctx.params.note
                        ]
                    );
                    return reponseErrorAPI(true,"Success", data)	
                    } catch (error) {
                    return reponseErrorAPI(false,error.message, [])
                }
            }
        },

        //add size
        sizeAdd: {
            rest: "POST /",
            // params: {
            //     size: 'string'
            // },
            async handler(ctx) {
                try {
                    let data = await dbUser.insertSize([ctx.params.size]);
                    return reponseErrorAPI(true,"Success", data)	
                    } catch (error) {
                    return reponseErrorAPI(false,error.message, [])
                }
            }
        },

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
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
