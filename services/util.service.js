"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "util",

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

        //add color
        colorAdd: {
            rest: "POST /",
            // params: {
            //     color: 'string'
            // },
            async handler(ctx) {
                try {
                    let data = await dbUser.insertColor([ctx.params.color]);
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
