"use strict";
//const db = require('../lib/db');
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const DbService = require("moleculer-db");

const users = [
	{ id: 1, username: "admin", password: "admin", role: "admin" },
	{ id: 2, username: "test", password: "test", role: "user" }
];

// users.service.js
module.exports = {
  name: "users",
  mixins: [DbService],

  adapter: new DbService.MemoryAdapter(),

  settings: {
    // Available fields
    fields: ["id","hoten", "email"],
    // entityValidator: {
		// 	hoten: { type: "string", min: 6, pattern: /^[a-zA-Z0-9]+$/ },
		// 	email: { type: "string", min: 6 },
		// }
  },
  actions: {
    list: {
      // Expose as "/users/"
      rest: "GET /",
      // async handler(ctx) {
      //   const testDifSer = await ctx.call('greeter.hello'); // call from greeter service to users service
      //   return '123 ' + testDifSer;
      //   // tìm hiểu docker + dbs

      // }
      async handler(ctx) {
       return '123';
      }
    },

    getUser: {
      rest: 'GET /:username',
      
      params: {
        username: 'string',
      },
      async handler (ctx) {
        let user = users.find(u => u.username == ctx.params.username );
        this.logger.info('user', ctx.params.username);
        return user;
      },
    },

    getName: {
      // Expose as "/users/:id"
      rest: "GET /:name",
      params: {
        username: 'string',
      },
     async handler(ctx) {
      try {
       const data = await dbUser.checkUserName([ctx.params.username]);
      
       return reponseErrorAPI(true,"Success", data)	
			} catch (error) {
				return reponseErrorAPI(false,error.message, [])
			}
      }
    },

    create: {
      // Expose as "/users/"
      rest: "POST /",
    //  auth: 'required',
      params: {
        username: { type: "string" },
        email: { type: "string" },
      },
      async handler(ctx) {
        try {
					let data = await dbUser.userInsert([ctx.params.username, ctx.params.email]);
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
      }
    },

    update: {
      // Expose as "/users/:id"
      rest: "PUT /:id",
      params: {
        email: 'string',
      },
      async handler(ctx) {
        //return `UPDATE name of user with id = ${ctx.params.id}. New name: ${ctx.params.name}`;
        try {
					let data = await dbUser.userUpdate([ctx.params.id, ctx.params.email]);
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
      }
    },

    remove: {
      // Expose as "/users/:id"
      rest: "DELETE /:id",
    async  handler(ctx) {
        try {
					let data = await dbUser.userDelete([ctx.params.id]);
					  return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					  return reponseErrorAPI(false,error.message, [])
				}
      }
    }
  },

  methods: {
    /**
     * Seeding Users DB
     */
    // async seedDB() {
    //   this.logger.info("Seed Users database...");
    //   const users = await db.query("SELECT * FROM sinhvien", []);
    //   const savedUsers = await this.adapter.insertMany(users);
    //   this.logger.info(`Created ${savedUsers.length} users.`);
    // }
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
    // if ((await this.adapter.count()) === 0) {
    //   await this.seedDB();
    // } else {
    //   this.logger.info(`DB contains ${await this.adapter.count()} users.`);
    // }
  },

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
