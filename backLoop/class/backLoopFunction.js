import orderClass from "./orderClass.js";

class BackLoopClass {

    constructor(){
        this.count = 0;
    }

    async processingNewOrder() {
      
        // first - find is isset new order
        let result = await orderClass.getNewOrder();

        console.log('FIND new order - ' );
        console.dir(result);

    }
  
    async function2() {
      this.count += 1;
      console.log('FUNCTION 2 is coplete -- count = '+ this.count);
    }
  
     
  }
  
  export default new BackLoopClass();