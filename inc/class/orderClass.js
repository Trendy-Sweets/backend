import { connDB } from '../../index.js';
class orderClass {
  
    constructor()
    {
      
    }

    async getStatusList(){
      const sql_status = {
        text: 'SELECT * FROM order_status_list',
        values:"",
      };
      const result = connDB.query(sql_status);
      this.status = result.row;
    }   
    // создаем запись о заказе
    async addNewOrder(clientid, allprice, form, products)
    {
      try{
        const status_new = 1;
        const sql_order = {
          text: 'INSERT INTO order_list '+
                '(clientid, order_adress, order_commclient, order_commadmin, order_priceall, status_payorder, status_ordergo, order_region, order_city, order_phone, delivery_date, delivery_time) '+
                'VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8, $9, TO_DATE($10, \'DD.MM.YYYY\'), $11) RETURNING orderid;',
          values: [clientid, form.addres, 'commit by client', 'commit admin - test order', allprice, status_new, form.region, form.city, form.phone, form.data, form.time]
        };
        
       
        const temp = await connDB.query(sql_order);
        const insertedOrderId = temp.rows[0].orderid;

        // одбавляем продукты
        for (let key in products) {
          const getProductPriceQuery = {
            text: 'SELECT product_price FROM product WHERE productid = $1',
            values: [key]
          };
          
          const productPriceResult = await connDB.query(getProductPriceQuery);
          const productPrice = productPriceResult.rows[0].product_price;
          
          const sql_addproduct = {
            text: 'INSERT INTO order_product (orderid, productid, product_price, product_count, status_productgo) ' +
                  'VALUES ($1, $2, $3, $4, $5)',
            values: [insertedOrderId, key, productPrice, products[key], 1]
          };
          
          await connDB.query(sql_addproduct);
          
        }
        return insertedOrderId;

        // добавляем запись о заказе

      }
      catch(err){

        console.log(err);
        return false;
      }
    }

  }
  
  export default new orderClass();