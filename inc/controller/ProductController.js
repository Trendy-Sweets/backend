import productClass from '../class/productClass.js';
import sloganClass from '../class/sloganClass.js';

class ProductController {
    async getMainPage(req, res) {
        console.log('get main page ...');
        try {
            const result = await sloganClass.getSlogan();
            const products = await productClass.getProductGroup_list();
            const klient_arr = [];
            
            // if products.msg == "ok" - то все хорошо
            // если  .msg ==  error  - то были проблемы с получением данных
            // текст ошибки лежит в products.error

            const tosend = {
                slogan: result,
                products: products.toReturn, //array
                klient: klient_arr, // status_log:false/true login: name: idclient
                error: false,
            };
            res.json(tosend);
            
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    // страница просмотра конкретного товара - данные о товаре
    async getProdctGroupInfo(req, res) {
        try {
            const {idGroup} = req.params;
            console.log('ProdctGroup Page. IdGroup = ' + idGroup);
            
            const temp_group = await productClass.getProductGroupInfo(idGroup);
            const temp_list  = await productClass.getProductsListInGroup(idGroup);
            const klient_arr = [];

            // if temp_group/temp_list.msg == "ok" - то все хорошо
            // если  .msg ==  error  - то были проблемы с получением данных
            // текст ошибки лежит в temp_group/temp_list.error

            const tosend = {
                groupInfo: temp_group.toReturn, //  информация о группе продуктов
                products: temp_list.toReturn, // список вариаций продукта
                klient: klient_arr, // status_log:false/true login: name: idclient
                error: false,
            };

            console.log('productGroup - ' + tosend.groupInfo);
            res.json(tosend);


        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }


}


export default new ProductController();