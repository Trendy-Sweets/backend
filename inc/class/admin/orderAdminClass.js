import { connDB } from '../../../index.js';
class orderAdminClass {
  
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
  
  export default new orderAdminClass();