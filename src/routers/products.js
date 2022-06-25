import { Router } from "express";
import controller from '../controllers/products.js'
import checkToken from '../middlewares/checkToken.js'


const router = Router()

router.get('/products', controller.GET)
router.get('/products/:productId', controller.GET)
router.post('/products', checkToken,controller.POST)
router.delete('/products/:productId', checkToken,controller.DELETE)
router.put('/products/:productId', checkToken,controller.PUT)


export default router