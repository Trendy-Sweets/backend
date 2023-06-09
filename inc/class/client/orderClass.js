import { connDB } from '../../../index.js';
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

    async getOrderListByClientId(clientId)
    {
      let result = {
        toReturn:{},
        error:false,
        errorMSG: ''
      };

      try {
          const query = {
            text:   'SELECT order_list.orderid      AS orderid, '+
                    '       order_list.order_city   AS city, '+
                    '       order_list.delivery_date AS date_delivery, '+
                    '       order_list.delivery_time AS time_delivery, '+
                    '       order_list.order_priceall AS allprice, '+
                    '       order_list.status_payorder AS pay_order, '+
                    '       order_status_list.status_text AS status_order, '+
                    '       order_status_list.status_cod AS status_cod ' +
                    ' FROM order_list '+
                    ' LEFT JOIN order_status_list ON order_list.status_ordergo = order_status_list.statusid '+
                    ' WHERE order_list.clientid = $1 ;',
            values: [clientId]
            };

          const temp = await connDB.query(query);
          //console.log(temp.rows[0]);
          if (temp.rowCount > 0)
          {
            result.toReturn = temp.rows;
            result.error = false;
            result.errorMSG = '';
          }
          else
          {
            result.error = true;
            result.errorMSG = 'Замовлення відустні';
          }

          return result;
          
      }
      catch(err){
        console.log(err);
        return err;
      }
    }

    async getProductsInOrder(orderId)
    {
      let result = {
        toReturn:[],
        error:false,
        errorMSG: ''
      };

      try {
          const query = {
            text: 'SELECT OP.product_count AS product_count, '+
                  '       PR.product_color AS product_color ' +
                  'FROM order_product AS OP ' +
                  'LEFT JOIN product AS PR ON OP.productorderid = PR.productid '+
                  'WHERE OP.orderid = $1 ;',
            values: [orderId]
            };
          //console.log('order ID = '+ orderId + ' || SQL - '+query.text );
          const temp = await connDB.query(query);
          //console.log(temp.rows[0]);
          if (temp.rowCount > 0)
          {
            result.toReturn = temp.rows;
            //console.log('ROWS - '+ temp.rows);
            result.error = false;
            result.errorMSG = '';
          }
          else
          {
            result.error = true;
            result.errorMSG = 'Не знайшли продуктів в замовленні';
          }

          return result;
          
      }
      catch(err){
        console.log(err);
        return err;
      }
    }

  }
  
  export default new orderClass();