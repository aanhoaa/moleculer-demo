"use strict";
const { ServiceBroker } = require("moleculer");
const Mailer = require("moleculer-mail");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

// Create broker
let broker = new ServiceBroker({
	logger: console,
	logLevel: "debug"
});

broker.createService(require("moleculer-mail"), {
    settings: {
        from: "sender@moleculer.services",
        transport: {
            service: 'gmail',
            auth: {
                user: 'johndoestv4@gmail.com',
                pass: '19903005'
            }
        }
    }
});

module.exports = {
    name: "mailer",
    mixins: [Mailer],

	/**
	 * Settings
	 */
	settings: {
        from: "sender@moleculer.services",
        transport: {
			service: 'Gmail',
			host: 'smtp.gmail.com',
            auth: {
                user: 'johndoestv4@gmail.com',
                pass: '19903005'
            }
        }
    },
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		send: {
			handler(ctx) {
				const { to, subject, html} = ctx.params;
				
				this.send({
                    to,
                    subject,
					html,
                  })
                    .then(console.log)
                    .catch(console.error);
                  return "Hellooooooo Moleculer";
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
