import Router from 'express';
import ProductController from '../controller/ProductController.js';

const router = new Router;

router.get('/', ProductController.getMainPage);

router.get('/sweet/:idGroup', ProductController.getProdctGroupInfo);

router.get('/register');
router.post('/register');

router.get('/login');
router.post('/login');

export default router;