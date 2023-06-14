import config from '../config.json' assert { type: "json" };
import pg from 'pg';
import backLoop from './class/backLoopFunction.js';

  const connDB = new pg.Client(config.connDB);
  export { connDB };
  export {config };

  async function startBackgound(){
    try {
      await connDB.connect()
      .then(console.log('Connect to DataBase .... ok'))
    
      while (true) {
             
        const promisesArray = [];

         // ну теперь в цикле мы должны что то делать
        // самое первое - искать новые заказы  
        promisesArray.push(backLoop.processingNewOrder());


        promisesArray.push(backLoop.function2());
       
        await Promise.all(promisesArray); 
        
        await new Promise(resolve => setTimeout(resolve, 60000)) // Пауза 1 минута
        .then(console.log('1 minutes - IS OVER ...'))
      }
    } catch(err) {
      console.error('Error', err);
    }
  }
  
  startBackgound();
  