import productClass from '../class/productClass.js';
import sloganClass from '../class/sloganClass.js';

class ProductController {
    async getMainPage(req, res) {
        console.log('get main page ...');
        try {
            const result = await sloganClass.getSlogan();
            const products = await productClass.getProductGroup_list();
            const klient_arr = [];
            
            const tosend = {
                'slogan': result,
                'products': products, //array
                'klient': klient_arr // status_log:false/true login: name: idclient
            };
        
            res.json(tosend);
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    async getProdctGroupInfo(req, res) {
        try {
            const {idGroup} = req.params;
            console.log('ProdctGroup Page. IdGroup = ' + idGroup);
            const productGroup = await productClass.getProductGroupInfo(idGroup);
            
            console.log('productGroup - ' + productGroup);
            res.json(productGroup);


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }


}


export default new ProductController();