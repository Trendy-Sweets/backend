import express from "express";

class sloganClass {
    constructor(conndb) {
      this.conndb = conndb;
    }
  
    async getSlogan() {
      try {

        const query = {
          text: 'SELECT * FROM advertising_slogan ORDER BY RANDOM() LIMIT 1',
          values: '',
          rowMode: '' //'array',
        }

        const result = await this.conndb.query(query);
                      
        console.log('GET RANDOM slogan result = ' + result.rows[0].slogan_text);

        return result.rows[0].slogan_text;
        
      } catch (error) {
        console.error(error);
        return 'Error getting slogan';
      }
    }
  }
  
  export default sloganClass;
  



/*exports.getRandomSlogan = function () {
    const slogan = 'подаруй насолоду';
    return slogan;
  };*/ 