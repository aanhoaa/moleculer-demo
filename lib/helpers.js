const db = require('./db');
/*
GLOBAL
*/
function checkById(table, value) {
    const sql = `SELECT * FROM ${table} WHERE id= $1`;
    return db.simpleQuery(sql, value)
    .then(res => {
        if (res.rows[0])
            return true;
        else return false;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function checkName(table, values) {
    const sql = `SELECT * FROM ${table} WHERE name= $1`;
    return db.simpleQuery(sql, values)
    .then(res => {
        if (res.rows[0])
            return true;
        else return false;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function getVariantId(values) {
    const sql = 'SELECT id FROM variantdetail WHERE color_id=$1 AND size_id=$2';
    
    return db.simpleQuery(sql, values)
    .then(res => {
        return res.rows[0].id;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function getList(table, value) {
    var sql = '';
    var column = '';

    if (value)
        {
            switch(table) {
                case 'categorychildren':
                    column = 'categoryparents_id';
                    break;
                case 'importgooddetail':
                    column = 'importgood_id';
                    break;
            } 

            sql =  `SELECT * FROM ${table} WHERE ${column}=${value[0]}`;
        }
    else  sql =  `SELECT * FROM ${table}`;

    return db.simpleQuery(sql)
    .then(res => {
        return res.rows;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function nameUpdate(table, values) {
    const sql = `UPDATE ${table} SET name= $2, description = $3 WHERE id = $1`;

    return db.excuteQuery(sql, values)
    .then(res => {
        if (res.rowCount > 0)
            return 'update success!!!';
        return 'false';
    })
    .catch(error => {return error;});
}

function updateOne(table, column, value) {
    const sql = `UPDATE ${table} SET ${column}=$2 WHERE id = $1 RETURNING status`;

    return db.excuteQuery(sql, value)
    .then(res => {
        if (res.rowCount > 0)
            return res;
        return 'false';
    })
    .catch(error => {return error;});
}

/*util colr + size*/
function insertColor(value) {
    const sql = 'INSERT INTO color(name) VALUES($1)';

    return checkName('color', value[0])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, value)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add color success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else return ({
            // type: TYPE,
             message: "color exist"
         })
    })
}

function insertSize(values) {
    const sql = 'INSERT INTO size(name) VALUES($1)';

    return checkName('size', values[0])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add size success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else return ({
            // type: TYPE,
             message: "size exist"
         })
    })
}

/*=====================================*/ 
function checkUserName(value) {
    const sql = 'SELECT * FROM sinhvien WHERE hoten= $1';
    return db.simpleQuery(sql, value)
    .then(res => {
        if (res.rows[0])
            return true;
        else return false;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function checkUserById(value) {
    const sql = 'SELECT * FROM sinhvien WHERE id= $1';
    return db.simpleQuery(sql, value)
    .then(res => {
        if (res.rows[0])
            return true;
        else return false;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

function userInsert(values) {
    const sql = 'INSERT INTO sinhvien(hoten, email) VALUES($1, $2)';
    
    return checkUserName([values[0]])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add user success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "user exist"
            })
        }
    })
}

function userUpdate(values) {
    const sql = 'UPDATE sinhvien SET email= $2 WHERE id = $1';

    return db.excuteQuery(sql, values)
    .then(res => {
        if (res.rowCount > 0)
            return 'update success!!!';
        return 'false';
    })
    .catch(error => {return error;});
}

function userDelete(value) {
    const sql = 'DELETE FROM sinhvien WHERE id = $1';

    return checkUserById(value).
    then(data => {
        if (data) {
            return db.excuteQuery(sql, value)
            .then(res => {
                if (res.rowCount > 0)
                    return 'user deleted';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "user not exist"
            })
        }
    })
}

/*
    helper category
*/

function checkCateName(value) {
    const sql = 'SELECT * FROM categoryparents WHERE name= $1';
    return db.simpleQuery(sql, value)
    .then(res => {
        if (res.rows[0])
            return true;
        else return false;
    })
    .catch(e => {
        console.log('err:', e);
        return false;
    });
}

function cateInsert(values) {
    const sql = 'INSERT INTO categoryparents(name, description) VALUES($1, $2)';
    
    return checkCateName([values[0]])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add category success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "category exist"
            })
        }
    })
}

function parentCateUpdate(values) {
    return nameUpdate('categoryparents', values);
}

function childCateUpdate(values) {
    return nameUpdate('categorychildren', values);
}

function cateDelete(value) {
    const sql = 'DELETE FROM categoryparents WHERE id = $1';

    return checkById('categoryparents', value).
    then(data => {
        if (data) {
            return db.excuteQuery(sql, value)
            .then(res => {
                if (res.rowCount > 0)
                    return 'rows deleted';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "rows not exist"
            })
        }
    })
}

function getListCateParents() {
    return getList('categoryparents')
    .then(data => {
        return data;
    })
    .catch(error => {return error;});
}

function getListCateChildren(value) {
    return getList('categorychildren', value)
    .then(data => {
        return data;
    })
    .catch(error => {return error;});
}

function childCateInsert(values) {
    const sql = 'INSERT INTO categorychildren(categoryparents_id, name, description) VALUES($1, $2, $3)';

    return checkById('categoryparents', [values[0]])
    .then(data => {
        if (data) {
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add category child success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "category not exist"
            })
        }
    })
}

/*
 <==========================================================================>
*/

/*
    product helper
*/

function productInsert(values) {
    const sql = 'INSERT INTO product(categorychild_id, name, description, status, rating) VALUES($1, $2, $3, $4, $5)';

    return checkName('product', [values[1].trim()])
    .then(data => {
        if (!data) {
            values.push(0, 0);
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return 'Add product success!!!';
                return 'false';
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "product exist"
            })
        }
    })
}

function getIdVarianProduct(value) {
    const sql = 'SELECT id FROM productvariant WHERE name=$1';

    return checkName('productvariant', [value[0].trim()])
    .then(data => {
        if (data) {
            return db.simpleQuery(sql, value)
            .then(res => {
                return res.rows[0].id;
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "product variant not exist"
            })
        }
    })
}

//table imgs
function addImageToVariantProduct(values) {
    const sql = 'INSERT INTO images(product_variant_id, url) VALUES($1, $2)';

    return db.excuteQuery(sql, values)
    .then(res => {
        if (res.rowCount > 0)
            return true;
        return false;
    })
    .catch(e => {
        console.log('err', e);
        return false;
    });
}

//variant detail
function addVariantDetail(values) {
    const sql = 'INSERT INTO variantdetail(color_id, size_id) VALUES($1, $2)';

    return getVariantId(values)
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, values)
            .then(res => {
                if (res.rowCount > 0)
                    return getVariantId(values)
                return false;
            })
            .catch(e => {
                console.log('err', e);
                return false;
            });
        }
        else {
           return data;
        } 
    })
}

// product variant detail
function productVariantDetailAdd(values) {
    const sql = 'INSERT INTO productvariantdetail(productvariant_id, variantdetail_id) VALUES($1, $2)';
    let val = [values[0]];

    return addVariantDetail([values[1], values[2]])
    .then(data => {
        val.push(data);
        return db.excuteQuery(sql, val)
        .then( res =>  {
            if (res.rowCount > 0)
            {
                return true;
            }
            return false;
        })
        .catch(error => {return error;}); 
    })
}

function productVariantAdd(values) {
    const val = [values[0], values[1], values[2], values[3]];
    const sql = 'INSERT INTO productvariant(product_id, name, description, SKU) VALUES($1, $2, $3, $4)';

    return checkName('productvariant', [values[1].trim()])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, val)
            .then(async res =>  {
                if (res.rowCount > 0)
                {
                    const pv_id = await getIdVarianProduct([values[1]]);
                    
                    if (pv_id !='') {
                        var arr_dat = [];
                        for (let i = 0; i < values[4].length; i++) {
                            const dat = await addImageToVariantProduct([pv_id, values[4][i]]);
                            arr_dat.push(dat);
                        }

                        //save pd variant detail
                        return productVariantDetailAdd([pv_id, '6', '3'])
                        .then(data4 => {
                            if (data4)
                                return 'Add product variant success!!!';
                            else return 'add fail';
                        })
                        .catch(error => {return error;});
                    }
                }
                return false;
            })
            .catch(error => {return error;});
        }
        else {
            return ({
               // type: TYPE,
                message: "product variant exist"
            })
        }
    })
}

function insertImportGood(values) {
    const sql = 'INSERT INTO importgood(supplier_id, paymentForm, deleveryDate, totalPrice, status) VALUES($1, $2, $3, $4, $5) RETURNING id';

    return db.excuteQuery(sql, values)
        .then( res =>  {
           if (res.rows[0].id)
            return res.rows[0].id;
            else return false;
        })
        .catch(error => {return error;});  
}

function insertImportGoodDetail(values) {
    const sql = 'INSERT INTO importgooddetail(productvariant_id, importgood_id, amount, priceimport, status) VALUES($1, $2, $3, $4, $5)';

    return db.excuteQuery(sql, values)
    .then( res =>  {
        if (res.rowCount > 0)
        {
            return true;
        }
        return false;
    })
    .catch(error => { return false;});  
}

function getDataImportGoodDetail(value) {
    const sql = "SELECT * FROM importgood WHERE id=$1";

    return db.simpleQuery(sql, value)
    .then(data => {
        if (data.rowCount > 0)
        {
            return data.rows[0];
        }
    })
    .catch(error => {return error;});
}

function getListImportGood() {
    return getList('importgood')
    .then(data => {
        return data;
    })
    .catch(error => {return error;});
}

function getListImportGoodDetail(value) {
    return getList('importgooddetail', value)
    .then(data => {
        return data;
    })
    .catch(error => {return error;});
}

function confirmInsertImportGood(value) {
    const sql = 'UPDATE importgooddetail set status = 1 FROM importgood WHERE  importgooddetail.importgood_id = $1 RETURNING productvariant_id, amount, priceimport ';
  
    return updateOne('importgood', 'status', value)
    .then(data => {
        if (data.rows[0].status == 1)
        {
            return db.excuteQuery(sql, [value[0]])
            .then( res =>  {
                if (res.rowCount > 0)
                {
                    return res.rows;
                }
                return false;
            })
            .catch(error => { return false;});  
        }
    })
  .catch(error => {return error;});
} 

function updateProductVariant(values) {
    const sql = 'UPDATE productvariant set stockamount=stockamount+$2, price=$3 WHERE id=$1';

    return db.excuteQuery(sql, values)
            .then( res =>  {
                if (res.rowCount > 0)
                {
                    return res.rows;
                }
                return false;
            })
            .catch(error => { return false;});  

}

/*
 <==========================================================================>
*/
/*
currency
*/
function insertBillSlip(values) {
    const sql = 'INSERT INTO billslip(import_id, billslipdate, totalprice, paymentform, typebill, note) VALUES($1, $2, $3, $4, $5, $6)';

    return db.excuteQuery(sql, values)
    .then(data => {
        if (res.rowCount > 0)
        {
            return true;
        }
        return false;
    })
    .catch(error => { return false;}); 
}

/*
 <==========================================================================>
*/

/*
supplier
*/
function insertSupplier(values) {
    const sql = 'INSERT INTO supplier(name, phone, address, email, note) VALUES($1, $2, $3, $4, $5)';
 
    return checkName('supplier', [values[0].trim()])
    .then(data => {
        if (!data) {
            return db.excuteQuery(sql, values)
            .then( res =>  {
                if (res.rowCount > 0)
                {
                    return 'Add supplier success';
                }
                return false;
            })
            .catch(error => {return error;}); 
        }
        else {
            return ({
               // type: TYPE,
                message: "supplier exist"
            })
        } 
    })
    .catch(error => {return error;});
}

/*
 <==========================================================================>
*/
module.exports = {
    checkUserName,
    userInsert,
    userUpdate,
    userDelete,

    cateInsert,
    parentCateUpdate,
    cateDelete,
    getListCateParents,
    getListCateChildren,
    childCateInsert,
    childCateUpdate,

    productInsert,
    productVariantAdd,
    updateProductVariant,
    insertImportGood,
    getDataImportGoodDetail,
    insertImportGoodDetail,
    getListImportGood,
    getListImportGoodDetail,
    confirmInsertImportGood,
    insertBillSlip,

    insertSize,
    insertColor,

    insertSupplier,
}