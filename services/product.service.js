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

	   //handle import 
	   getImportGoods: {
		rest: "POST /",
		async handler(ctx) {
			var count = ctx.params.id.length;
			try {
				//save to importgood db
				let data = await dbUser.insertImportGood(
					[
						ctx.params.supplier_id,ctx.params.paymentForm, 
						ctx.params.deleveryDate, ctx.params.totalPrice,
						ctx.params.status
					]
					);
					
				if (data) {
					//save to importgooddetail db
					for (let i = 0; i< ctx.params.id.length; i++) {
						var productvariant_id = ctx.params.id[i];
						var import_id = data;
						var amount = ctx.params.amount[i];
						var priceimport = ctx.params.priceimport[i];
						var status = ctx.params.status;
						//console.log('test', productvariant_id, import_id, amount, priceimport, status)
						let data2 = await dbUser.insertImportGoodDetail(
							[
								productvariant_id,
								import_id,
								amount,
								priceimport,
								status
							])
							.then(dat => {
								if (dat) {
									count--;
								}
								else return false;
							})	
					}
					if (count == 0) {
						return reponseErrorAPI(true,"Success", 'Add success');
					}
					else return 'add fail';
				}
					
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
			}
		}
	   },

	   //post importgood
	   confirmImportGoods: {
		   rest: "PUT /",
		//    params: {
		// 	   import_id: 'string'
		//    },
		   async handler(ctx) {
			try {
				var totalPrice = 0;
				
				const importData = await dbUser.getDataImportGoodDetail([30]); //params [import_id]
				const data = await dbUser.confirmInsertImportGood([30,1]);// đang dùng hardcode param, cần lấy id 
				
				data.forEach(async item => {
					const data2 = await dbUser.updateProductVariant([item.productvariant_id, item.amount, item.priceimport]);
					totalPrice += item.amount*item.priceimport;
					
				}) 
			//	console.log('id:', importData.deleverydate)
				const date3 = await dbUser.insertBillSlip([importData.id, importData.deleverydate, importData.totalprice, importData.paymentform, 'Chi mua hàng', '']);
				return reponseErrorAPI(true,"Success", data3)	
			} catch (error) {
				return reponseErrorAPI(false,error.message, [])
			}
		},
	   },

	   //list importgoods
		listImportGood: {
			rest: "GET /",
			roles: 'admin',
			async handler(ctx) {
				try {
					const data = await dbUser.getListImportGood();
				
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
			},
		},

		//list importgood detail
		listImportGoodDetail: {
			rest: "GET /",
			params: {
				importgood_id: 'string',
			},
			async handler(ctx) {
				try {
					const data = await dbUser.getListImportGoodDetail([ctx.params.importgood_id]);
					return reponseErrorAPI(true,"Success", data)	
				} catch (error) {
					return reponseErrorAPI(false,error.message, [])
				}
			},
		},

		/*
			CATEGORY HANDLE
		*/
		createCateLevelOne: {
			rest: "POST /",
			role: 'admin',
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
		createCateLevelTwo: {
			rest: "POST /:id",
			params: {
				name: 'string',
				description: 'string'
			},
			async handler(ctx) {
				try {
                    let data = await dbUser.insertCateLevel(2, [ctx.params.id, ctx.params.name, ctx.params.description]);
                   	return reponseErrorAPI(true,"Success", data)	
                    } catch (error) {
                        return reponseErrorAPI(false,error.message, [])
                }
			}
		},
		createCateLevelThree: {
			rest: "POST /:id",
			params: {
				name: 'string',
				description: 'string'
			},
			async handler(ctx) {
				try {
                    let data = await dbUser.insertCateLevel(3, [ctx.params.id, ctx.params.name, ctx.params.description]);
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
