
import { connDB } from '../../../index.js';
class productAdminClass {
    async getProductGroup_list() {
      try {
        const query = {
          text: 'SELECT productgroup_list.productgroup_id AS productgroupid,  '+
                '       productgroup_list.productgroup_name AS productgroup_name, '+
                '       productgroup_list.status_public AS group_public, '+
                '       productgroup_list.productgroup_foto AS productgroup_foto, '+
                '       product.productid AS productid, '+
                '       product.product_name AS product_name, '+
                '       product.product_foto_small AS product_foto_small, '+
                '       product.status_public AS product_public, '+
                '       product.product_color AS product_color '+
                'FROM product '+
                'LEFT JOIN productgroup_list  ON productgroup_list.productgroup_id = product.productgroupid '+
                'ORDER BY productgroup_list.productgroup_id ASC; ',
          values: '',
          rowMode: 'object' //'array',
        }
        //console.log(query.text);
        const temp = await connDB.query(query);
        const toReturn = [];

        for (const row of temp.rows) {
          const {
            productid,
            productgroupid,
            product_name,
            product_foto,
            group_public,
            product_public,
            product_color,
            productgroup_id,
            productgroup_name,
            productgroup_foto
          } = row;

          // проверяем, есть ли уже массив с таким productgroup_id в toReturn 
          let productGroupArray = toReturn.find((el) => el.productgroupId === productgroupid);

          if (!productGroupArray) {
            // если массива с таким productgroup_id нет, создаем его и добавляем в toReturn
            productGroupArray = {
              productgroupId: productgroupid,
              group_public: group_public,
              productgroupName: productgroup_name,
              productgroupFoto: '/pic/'+productgroup_foto,
              products: []
            };

            toReturn.push(productGroupArray); 
          }

         
          // добавляем в массив информацию о продукте
         
            productGroupArray.products.push({
                productId: productid,
                product_public: product_public,
                productName: product_name,
                productColor: product_color,
                productFoto: product_foto
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
          temp.rows[0].product_foto = '/pic/'+temp.rows[0].product_foto;
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

    

  }
  
  export default  new productAdminClass();
