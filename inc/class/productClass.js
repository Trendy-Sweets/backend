import { connDB } from '../../index.js';
class productClass {
    
  
    async getProductGroup_list() {
      try {

        const query = {
          text: 'SELECT * FROM product LEFT JOIN productgroup_list  ON productgroup_list.productgroup_id = product.productgroupid  WHERE productgroup_list.status_public = 1  ORDER BY productgroup_list.productgroup_id ASC; ',
          values: '',
          rowMode: 'object' //'array',
        }

        const result = await connDB.query(query);
        const toReturn = [];

        for (const row of result.rows) {
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


        console.log('Product list | result = ' + toReturn[0]);

        return toReturn; //result.rows;  //.rows[0].slogan_text;
        
      } catch (error) {
        throw new error('Error getting ProductGroups List - '+error );
      }
    }

    async getProductGroupInfo(idGroup){
      try {
        const query = {
          text: 'SELECT * FROM product LEFT JOIN productgroup_list  ON productgroup_list.productgroup_id = product.productgroupid  WHERE product.productgroupid = '+ idGroup + '  ORDER BY productgroup_list.productgroup_id ASC; ',
          values: '',
          rowMode: 'object' //'array',
        }
        console.log('SQL - '+ query.text);

        const result = await connDB.query(query);

        return result;

      } catch (error) {
        throw new error(' error by get Group Sweets Information - '+error );
       
      }
    }
  }
  
  export default  new productClass();


  