import { query } from 'express';
import { connDB } from '../../index.js';
class productClass {
    async getProductGroup_list() {
      try {
        const query = {
          text: 'SELECT * FROM product LEFT JOIN productgroup_list  ON productgroup_list.productgroup_id = product.productgroupid  WHERE product.status_public = true AND productgroup_list.status_public = 1  ORDER BY productgroup_list.productgroup_id ASC; ',
          values: '',
          rowMode: 'object' //'array',
        }

        const temp = await connDB.query(query);
        const toReturn = [];

        for (const row of temp.rows) {
          const {
            productid,
            productgroupid,
            product_name,
            product_price,
            product_foto,
            product_composition,
            status_public,
            date_create,
            date_lastupdate,
            product_color,
            productgroup_id,
            productgroup_name,
            productgroup_foto,
            productgroup_maxtime,
            productgroup_description,
            productgroup_storage,
            productgroup_storagetime
          } = row;

          // проверяем, есть ли уже массив с таким productgroup_id в toReturn 
          let productGroupArray = toReturn.find((el) => el.productgroupId === productgroupid);

          if (!productGroupArray) {
            // если массива с таким productgroup_id нет, создаем его и добавляем в toReturn
            productGroupArray = {
              productgroupId: productgroup_id,
              productgroupName: productgroup_name,
              productgroupFoto: productgroup_foto,
              productgroupMaxTime: productgroup_maxtime,
              productgorupMinPrice: 0,
              products: []
            };

            toReturn.push(productGroupArray); 
          }

         
          // добавляем в массив информацию о продукте
          if (productGroupArray.productgorupMinPrice == 0 || productGroupArray.productgorupMinPrice > product_price) {
            
            productGroupArray.productgorupMinPrice = product_price;

          }
          else {
            
          }

          productGroupArray.products.push({
              productId: productid,
              productName: product_name,
              productPrice: product_price,
              productColor: product_color
          });
        }
        //console.log('Product list | result = ' + toReturn[0]);

        const result = {
          msg : "ok",
          toReturn: toReturn,
          error: "",
        }

        return result;
        
      } catch (err) {

          const result = {
            msg: "error",
            toReturn: "",
            error: 'Error getting ProductGroups List - ' + error,
          };
      }
    }
  // ***** Данные о конкретной группе продукта *********
    async getProductGroupInfo(idGroup){
      try {

        let temp;
        let result_group = {};

        const query_group = {
          text: 'SELECT * FROM productgroup_list WHERE productgroup_id = $1;',
          values: [idGroup],
          rowMode: 'object'
        };

        temp  = await connDB.query(query_group);

        if (temp.rowCount == 1)
        {
          result_group.msg = "ok";
          result_group = temp.rows[0];

          const result = {
            msg:"ok",
            error: "",
            toReturn: result_group,
          }
          //console.dir(result, { depth: null });

          return result; 
        }
        else
        {
          const result = {
            msg:"error",
            error: "Not exist data",
            toReturn: result_group,
          };
          return result; 
        }
       
      } catch (err) {

        const result = {
          msg:"error",
          toReturn: "",
          error: err,
        }
        
        return result;
      }
    }

    // ***** данные о конкретнои продукте
    async getProductInfoById(idProduct)
    {
      try {

        let temp;

        const query_product = {
          text: 'SELECT  PR.productgroupid AS groupid, ' +
                ' PG.productgroup_maxtime AS maxtime, ' +
                ' PR.productid AS productid, ' +
                ' PR.product_name AS product_name, ' +
                ' PR.product_price AS product_price, ' +
                ' PR.product_foto AS product_foto, ' +
                ' PR.product_composition AS product_composition, ' +
                ' PR.product_color AS product_color ' + 
                'FROM product as PR '+ 
                'LEFT JOIN productgroup_list as PG ON PR.productgroupid = PG.productgroup_id'+
                ' WHERE PR.productid = $1;',
          values: [idProduct],
          rowMode: 'object'
        };

        temp  = await connDB.query(query_product);

        //console.log('SQL = ' + query_product.text);
        //console.log('TYT PRODUCT INFO  --- ' + temp.rows[0].product_name);

        if (temp.rowCount == 1)
        {
          const result = {
              msg:"ok",
              error: "",
              toReturn: temp.rows[0],
          }
          

          return result;
        }
        else
        {
          const result = {
            msg:"error",
            error: "Not exist data",
            toReturn: {},
          };
          return result; 
        }

      } catch (err) {

        const result = {
          msg:"error",
          toReturn: "",
          error: err,
        }
        return result;
      }
    }

    // **** данные о вариациях продукта для конкретной группы *******
    async getProductsListInGroup(idGroup)
    {
      try
      {
        let result_list = [];

        const query_list = {
          text: 'SELECT productid as productid, '+
                'product_color as product_color' +
                ' FROM product WHERE productgroupid = $1 AND status_public = true ORDER by productid;',
          values: [idGroup],
          rowMode: 'object'
        }

        let temp = await connDB.query(query_list);
       
          if (temp.rowCount > 0 )
          {
            for (const row of temp.rows) {

              result_list.push({
                productid:            row.productid,
                //productgroupid:       row.productgroupid,
                //product_name:         row.product_name,
                //product_price:        row.product_price,
                //product_foto:         row.product_foto,
                //product_composition:  row.product_composition,
                //date_create:          row.date_create,
                //date_lastupdate:      row.date_lastupdate,
                product_color:        row.product_color,
              }); 
            }
            
            const result = {
              msg:"ok",
              toReturn: result_list,
              error: "",
            };
            //console.dir(result, { depth: null });
            return result;
            //console.dir(result, { depth: null });
          }
          else
          {
            const result = {
              msg:"error",
              toReturn: "",
              error: "Error. Not isset content",
            };
            return result;
          }
      }
      catch(err) {
        const result = {
          msg:"error",
          toReturn: "",
          error: err,
        };
        return result;
      }
    }

    // список продуктов с инфой по списку айдишников
    async getProductListByListId(id_list){
      // получили массив айдишников
      // собираем их вс троку и формируем запрос на БД
      try {
        
        const query = {
          text: 'SELECT  PR.product_name AS name, ' +
                '        PR.productid AS productid, ' +
                '        PR.product_foto_small AS foto, ' +
                '        PR.product_price AS price, ' +
                '        PG.productgroup_maxtime AS maxtime '+ 
                'FROM product as PR '+ 
                'RIGHT JOIN productgroup_list as PG ON PR.productgroupid = PG.productgroup_id '+
                ' WHERE PR.productid = ANY($1::integer[]);',
          values: [id_list.map(Number)],
          rowMode: 'object'
        };
        
        const temp  = await connDB.query(query);
        if (temp.rowCount > 0 )
        {
            let result_list = [];
            for (const row of temp.rows) {

              result_list.push({
                productid:            row.productid,
                name:                 row.name,
                foto:                 row.foto,
                price:                row.price,
                maxtime:              row.maxtime,
              }); 
            }
            
            const result = {
              msg:'',
              toReturn: result_list,
              error: false,
            };
            
            return result;
            
          }
          else
          {
            const result = {
              msg:"Дані про продукти відсутні повністю або присутні в неповному обсязі ",
              toReturn: "",
              error: true,
            };
            return result;
          }
      }
      catch(err) {
        //console.log(err);
        const result = {
          msg:err,
          toReturn: "",
          error: true,
        };
        return result;
      }
    }
// ******************************
//  получаем общую стоимость корзины
    async getAllPrice(cartitems)
    {
      try{
        const id_list = Object.keys(cartitems);
        const query = {
          text: 'SELECT  PR.product_price AS price, PR.productid AS productid '+ 
                'FROM product as PR '+ 
                ' WHERE PR.productid = ANY($1::integer[]);',
          values: [id_list.map(Number)],
          rowMode: 'object'
        };
        
        const temp  = await connDB.query(query);
        let allPrice = 0;
        for (const row of temp.rows) {
          allPrice += row.price * cartitems[row.productid];
        }
        return allPrice;
      }
      catch(err){
        console.log(err);
        return err;
      }
    }
//******************************************** */
    // поиск максимального првемени приготовления изделаия из тех что находятся в списке вида [id1,id2,...,id999]
    async getMaxTimeExecuteProduct(id_list){

      const result = {
        msg:"",
        maxTime: 0, // выражается в количеств часов !!!!!
        error: true,
      };

      try{
          const query = {
                text: 'SELECT  MAX(PG.productgroup_maxtime) AS maxtime ' +
                      'FROM productgroup_list AS PG '+ 
                      ' WHERE PG.productgroup_id IN (SELECT PR.productgroupid FROM product AS PR WHERE PR.productid = ANY($1::integer[]));',
                values: [id_list.map(Number)],
                rowMode: 'object'
        };
        
       
        const temp  = await connDB.query(query);

        //console.log('MaxTime = ' + temp.rows[0].maxtime);

        if (temp.rowCount == 1)
        {
          result.error = false;
          result.maxTime = temp.rows[0].maxtime;
        }
        else
        {
          result.error = true;
          result.msg = 'Error in SQl query to Data Base - search maxTime';
        }

        return result;

      }
      catch(err){
        result.error = true;
        result.maxTime = 0;
        result.msg = err;
        //console.log(err);
        return result;
      }
    }

  }
  
  export default  new productClass();
