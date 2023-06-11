import { connDB } from '../../../index.js';
class executerClass {
  
    async getExecutersListWhait()
    {
        let result = {
            toReturn:{},
            error:false,
            errorMSG: ''
          };
        try {
            const sql_ex = {
                text:   'SELECT COUNT(executer_id) AS countexecuter FROM executer WHERE allowed = 0; ',
                values: []
            };
            const temp = await connDB.query(sql_ex);
            return temp.rows[0].countexecuter;
        }        
        catch(err)
        {
            result.error = true;
            result.errorMSG = err;
            return result;
        }
    }

    async getExecutersListAllowed()
    {
        let result = {
            toReturn:{},
            error:false,
            errorMSG: ''
          };
        try {
            const sql_ex = {
                text:   'SELECT COUNT(executer_id) AS countexecuter FROM executer WHERE allowed = 1; ',
                values: []
            };
            const temp = await connDB.query(sql_ex);
            return temp.rows[0].countexecuter;
        }        
        catch(err)
        {
            result.error = true;
            result.errorMSG = err;
            return result;
        }
    }

    async getExecutersListReady()
    {
        let result = {
            toReturn:{},
            error:false,
            errorMSG: ''
          };
        try {
            const sql_ex = {
                text:   'SELECT COUNT(executer_id) AS countexecuter FROM executer WHERE allowed = 1 AND ready = 1; ',
                values: []
            };
            const temp = await connDB.query(sql_ex);
            return temp.rows[0].countexecuter;
        }        
        catch(err)
        {
            result.error = true;
            result.errorMSG = err;
            return result;
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

    async testsql(){
        const allowed = 0;
        const ready = 0;
        const sql_ex = {
            text:   'SELECT COUNT(executer_id) AS countexecuter FROM executer '+
                    'WHERE allowed = $1 AND ready = $2;',
            values: [allowed, ready]
        };
        console.log(sql_ex.text);
        console.log('!!!!!!!!!!!!!!!!!!!!!!REZULT SQL  -'); 
        const temp = await connDB.query(sql_ex);
        console.log(' SQL  - '+temp.rows[0].countexecuter);
        const result = temp.rows[0].countexecuter;
        return result;
    }

  }
  
  export default new executerClass();