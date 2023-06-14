import { connDB } from '../background.js';
class orderClass {
  
    constructor(){
        this.status_order = {
            warning : 'warning' // статус проблемного заказа: когда переносим в таблицу проьлемных
        }
    }
    // find new order
    async getNewOrder()
    {
        let result = {
            error: false,
            errorMSG: '',
            countNewOrder:0,
            newOrder: [] // get a orderid array
        }
        try {

            const sql = {
                text: 'SELECT orderid, status_payorder, order_datecreate FROM order_list WHERE status_ordergo = (SELECT statusid FROM order_status_list WHERE status_cod = $1)',
                values: ['new']
            }

            const res_sql = await connDB.query(sql);

            result.countNewOrder = res_sql.rowCount;

            for (const row of res_sql.rows) {
                const obj_tmp = {
                    orderid: row.orderid,
                    status_payorder: row.status_payorder,
                    order_datecreate: row.order_datecreate
                }
                result.newOrder.push(obj_tmp);
              }

            return result;
        }
        catch(err)
        {
            result.error = true;
            result.errorMSG = err;
            return result;
        }
    }

    // change STATUS oreder to "warning"  - whith comment_system = 'to long dont pay order'
    async changeStatusToWarning(orderid, problem_status)
    {

        // меняем статус у заказа
        // добавляем ссылку на заказ в таблице проблеммных заказов

        const sql_insert = {
            text:   'INSERT INTO problem_order (orderid, problem_cod) '+
                    'VALUES ($1, $2)',
            values:[orderid, problem_status]
        };

        const sql_update = {
            text:   'UPDATE order_list SET status_ordergo = (SELECT statusid FROM order_status_list WHERE status_cod = $2) '+
                    'WHERE orderid = $1',
            values:[orderid, this.status_order.warning]
        }

        const temp = await connDB.query(sql_insert);

        if (temp.rowCount > 0) 
        {
            const temp2 = await connDB.query(sql_update);
            if (temp2.rowCount > 0) 
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    // оплучить количество заказов со стотусом - в работе
    async getCountOrderRun()
    {
      let result = {
        toReturn:{},
        error:false,
        errorMSG: ''
      }; 

      try {
          // заказ в работе --- это status = run
          const query = {
                text:   'SELECT COUNT(orderid) AS countorderrun '+
                        'FROM order_list '+
                        'WHERE order_list.status_ordergo = (SELECT statusid FROM order_status_list WHERE status_cod = $1);',
                values: ['run']
            };

          const temp = await connDB.query(query);
          if (temp.rowCount != 1)
          {
            result.error = true;
            result.errorMSG = 'Виникли проблеми з підрахунком замовлень, зі статусом - на виконанні';
          }
          else
          {
            result.error = false;
            result.errorMSG = '';
            result.toReturn = temp.rows[0].countorderrun;
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