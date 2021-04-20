"use strict";
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const DbService = require("moleculer-db");
const bcrypt = require('bcrypt');


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "order",

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

        //payment
        payment: {
            rest: "POST /",
            role: 'user',
            async handler(ctx) {
                const {payment_id, shop_id, shippingfee, deliverytime} = ctx.params;
                const date = new Date();
                const status = 0;
                //save ordertotal
                const data = await dbUser.insertOrderTotal(ctx.meta.id, payment_id, date);
                if (data) {
                    //save order
                   for (let i = 0; i < shop_id.length; i++) {
                       const saveOrder = dbUser.insertOrder(data, shop_id[i], shippingfee[i], deliverytime[i], status)
                       //check cart
                   }
                }
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
