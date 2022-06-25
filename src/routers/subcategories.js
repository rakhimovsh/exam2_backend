import { Router } from "express";
import controller from '../controllers/subcategories.js'
import checkToken from '../middlewares/checkToken.js'


const router = Router()


router.get('/subcategories', controller.GET)
router.get('/subcategories/:subcategoriesId', controller.GET)
router.post('/subcategories',checkToken, controller.POST)
router.delete('/subcategories/:subcategoriesId',checkToken, controller.DELETE)
router.put('/subcategories/:subcategoriesId',checkToken, controller.PUT)


export default router