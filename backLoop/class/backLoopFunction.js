import orderClass from "./orderClass.js";
import { config } from "../background.js";

class BackLoopClass {

    constructor(){
        this.count = 0;
    }

    async processingNewOrder() {
      
        const currentTime = new Date(); // Текущее время
        // first - find is isset new order
        let result = await orderClass.getNewOrder();

        result.payOrderOk = 0;
        result.payOrderNot = 0;

        // if new orders >  0
        if (result.countNewOrder > 0 )
        {   // п каждому - смотрим наличие оплаты
            for (const order of result.newOrder)
            {
                if (order.status_payorder == 0)
                {    // если нету ---
                    result.payOrderNot += 1;
                    // если заказ давно не оплачен  - задаем значение в конфиге timeOrderNotPay
                    const order_datecreate = new Date(order.order_datecreate);

                    const timeDelta = currentTime - order_datecreate;

                    if (timeDelta >= (config.timeOrderNotPayHour * 60 * 60 * 1000)) 
                    {
                        // Прошло 2 часа или более
                        console.log( ' ---------------------------------------------------------------------------\n'+
                                     ' An order (order number - '+order.orderid.toString().padStart(6, '0')+' )\n was found in the "not paid" status,\n'+
                                     ' the status was set more than '+config.timeOrderNotPay+' hours ago. \n'+
                                     ' We transfer orders to PROBLEM ones for processing by the administrator \n '+
                                     ' ---------------------------------------------------------------------------');
                        // собственно переводим заказа в проблемные с пометкой - проблема в долгой оплате
                        try {
                            const statusChanged = await orderClass.changeStatusToWarning(order.orderid, config.problem_status.dontpay);
                            if (statusChanged) {
                              console.log(' ...... set new status for Order #' + order.orderid.toString().padStart(6, '0') + ' - DONE');
                            } else {
                              console.log(' ...... set new status for Order #' + order.orderid.toString().padStart(6, '0') + ' - ERROR');
                            }
                          } catch (error) {
                            console.log(' ...... set new status for Order #' + order.orderid.toString().padStart(6, '0') + ' - ERROR');
                          }        
                    } 
                    else 
                    {
                    // Не прошло 2 часа
                       
                    }
                }
                else
                {
                    result.payOrderOk += 1;
                }
            }
        }

        console.log('Number of new orders found - ' + result.countNewOrder);
        //console.dir(result);
        // если оплата есть --- 

    }
  
    async function2() {
      this.count += 1;
      console.log('FUNCTION 2 is coplete -- count = '+ this.count);
    }
  
     
  }
  
  export default new BackLoopClass();