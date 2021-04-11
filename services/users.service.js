"use strict";
//const db = require('../lib/db');
const dbUser = require('../lib/helpers');
const {reponseErrorAPI} = require('../lib/reponse.js')
const DbService = require("moleculer-db");
const bcrypt = require('bcrypt');

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
      roles: 'user',
      async handler(ctx) {
       return '123';
      }
    },

    getUser: {
      rest: 'GET /:username',
 
      async handler (ctx) {
        try {
          const data = await dbUser.checkUserExist(2, [ctx.params.username]);
          if (data) {
            const data2 = await dbUser.getUserInfo(2, [ctx.params.username]);
            return data2;
          }
           return reponseErrorAPI(true,"Success", data)	
         } catch (error) {
           return reponseErrorAPI(false,error.message, [])
         }
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
      async handler(ctx) {
        const {username, email, password, tokenconfirm } = ctx.params;

        try {
            let data = await dbUser.userInsert([username, password, email, tokenconfirm]);
            return reponseErrorAPI(true,"Success", data)
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
      }
    },

    //verified user
    verified: {
      rest: "GET /username/:cftk",
      async handler(ctx) {
        const cftk = ctx.params.cftk;
        const data = await dbUser.getUserInfo(2, [ctx.params.username])
        
        if (data.tokenconfirm == cftk) {
          //change isverified
          try {
            const data2 = await dbUser.updateIsverified(data.id)
            return reponseErrorAPI(true,"Success", data2)	
          } catch (error) {
            return reponseErrorAPI(false,error.message, [])
          }
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
