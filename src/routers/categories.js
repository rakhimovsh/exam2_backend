import {Router} from 'express'
import controller from '../controllers/categories.js'
import checkToken from '../middlewares/checkToken.js'



const router = Router()

router.get('/categories', controller.GET)
router.get('/categories/:categoryId', controller.GET)
router.post('/categories',checkToken, controller.POST)
router.delete('/categories/:categoryId',checkToken,controller.DELETE)
router.put('/categories/:categoryId',checkToken,controller.PUT)




export default router