import { connDB } from '../../../index.js';

class userProductClass {

    // получаме списко ВСЕЗ продуктов и крепим к нему значение полей об обучении конкретного исполнителя
    async getEducationProductList(executer_id)
    {
       let result = {
        error:false,
        errorMSG: '',
        toReturn: [],
        countNotEducation: 0,
       };

        const sql_products = {
          text: 'SELECT * '+
                'FROM product  ORDER by productid ASC',
          values:[]
        };

        const temp = await connDB.query(sql_products);

        console.log(temp.rowCount);
        if (temp.rowCount > 0)
        {
    
            // получаем список того, чему обучился уже исполнитель
            const sql_education = {
              text: 'SELECT * FROM know_product WHERE executer_id = $1',
              values: [executer_id]
            };

            const temp_ed = await connDB.query(sql_education);
            
            let edu_product = [];

            for (const prod of temp_ed.rows)
            {
                const {
                  product_id,
                  ready_todo,
                } = prod;

                let know_temp = {
                  product_id: product_id,
                  ready_todo: ready_todo
                } 

                edu_product.push(know_temp);
            }
            // формируем общий массив всех проудктов и его статус обучения
            for (const row of temp.rows) 
            {
                const {
                  productid,
                  product_name,
                  product_foto_small,
                  product_color,
                } = row;

                const foundProduct = edu_product.find(product => product.product_id === productid);

                if (!foundProduct) result.countNotEducation += 1;

                let product_one = {
                  productid: productid,
                  product_name: product_name,
                  product_foto_small: product_foto_small,
                  product_color: product_color,
                  know_product: (foundProduct)? true:false,
                }

                result.toReturn.push(product_one);
            }
        } 
        else
        {
          result.error = true;
          result.errorMSG = 'Не має продуктів для навчання';
        }

        return result;
    }

    // ***** Данные для обучению конкретному продукту *********
    async getEducationProductInfo(idProduct)
    {
        let result = {
            error:false,
            errorMSG: '',
            toReturn: {},
           };

        try {
  
          const query_group = {
            text:   'SELECT edu.product_id AS product_id, '+
                    '       edu.composition AS composition, '+
                    '       edu.formula AS formula, '+
                    '       pr.product_foto_small AS foto '+
                    'FROM education_info_product AS edu '+
                    'LEFT JOIN product AS pr ON edu.product_id = pr.productid '+
                    'WHERE edu.product_id = $1;',
            values: [idProduct]
          };
          //console.log(query_group.text);
          const temp  = await connDB.query(query_group);
  
          if (temp.rowCount > 0 )
          {
                result.error = false;

                for (const row of temp.rows)
                {
                    const {
                        product_id: product_id,
                        foto: foto,
                        composition: composition,
                        formula: formula
                    } = row;

                    result.toReturn = {
                        product_id: product_id,
                        foto: foto,
                        composition: composition,
                        formula: formula
                    }
                }
          }
          else
          {
            result.error = false;
            result.toReturn = {
                product_id: idProduct,
                foto: '',
                composition: '',
                formula: ''
            }
          }

          return result;
         
        } catch (err) {
  
          result.error = true;
          result.errorMSG = err;
          return result;
        }
      }

    // Добавляем запись о прошедшем обучении исполнителем определеного продукта
    async addEducationProductComplete(idProduct, idExecuter)
    {
        let result = {
            error:false,
            errorMSG: '',
            toReturn: '',
           };
        try
        {
            const sql_insert = {
                text: 'INSERT INTO know_product (executer_id, product_id, ready_todo) '+
                      'VALUES ($2, $1, $3)',
                values: [idProduct, idExecuter, 0]
            };

            const temp = await connDB.query(sql_insert);

            if (temp.rowCount > 0)
            {
                result.error = false;
                result.errorMSG = '';
                result.toReturn = 'Навчання зафіксовано.';
            }
            else
            {
                result.error = true;
                result.errorMSG = 'Виникла помилка при спробі зафіксувати проходження навчання';
            }

            return result;
        }
        catch(error)
        {
            console.log(error);
            result.error = true;
            result.errorMSG = 'ERROR IN SQL !!!';//error;
            return result;
        }
    }











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
              productgroupFoto: '/pic/'+productgroup_foto,
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
                foto:                 '/pic/'+row.foto,
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
  
  export default  new userProductClass();
