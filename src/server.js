import express from 'express'
import fs from 'fs'
import path from 'path'

const PORT = process.env.PORT || 5000
const app = express()



import userRouter from './routers/user.js'
import categoriesRouter from './routers/categories.js'
import subcategoriesRouter from './routers/subcategories.js'
import productsRouter from './routers/products.js'

app.use( express.json() )


app.use(userRouter)
app.use(categoriesRouter)
app.use(subcategoriesRouter)
app.use(productsRouter)



app.use((error, req, res, next) => {
    if(error.status != 500){
        return res.status(error.status).json({
            status: error.status,
            message: error.message
        })
    }
    
    fs.appendFileSync(path.join(process.cwd(), 'src', 'log.txt'),
    `${req.url}___${error.name}___${Date.now()}___${error.status}___${error.message}\n`
    )

    res.status(error.status).json({
        status: error.status,
        message: 'InternalServerError'
    })

    process.exit()
    

})

app.listen(PORT , () => console.log(`${PORT}`))