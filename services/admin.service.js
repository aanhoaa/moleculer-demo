"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const DbService = require("moleculer-db");
const bcrypt = require('bcrypt');


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "admin",

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

		create: {
            rest: "POST /",
            params: {
                username: 'string',
                password: 'string',
                email: 'string'
            },
            async handler(ctx) {
                const {username, password, email} = ctx.params;

                try {
                    let data = await dbUser.insertAdmin([username, password, email]);
                        return reponseErrorAPI(true,"Success", data)      
                    } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                    }
            }
        },

        getAdmin: {
            rest: 'GET /:username',
            async handler (ctx) {
                try {
                const data = await dbUser.checkUserExist(1, [ctx.params.username]);
                if (data) {
                    const data2 = await dbUser.getUserInfo(1, [ctx.params.username]);
                    return data2;
                }
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
