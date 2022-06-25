import { read, write } from "../utils/model.js";
import { InternalServerError, NotFoundError } from "../utils/errors.js";

function GET(req, res, next) {
  try {
    let products = read("products");
    let subCategories = read("subCategories");
    products.forEach((pro) => {
      pro.category_id = subCategories.find(
        (sub) => sub.sub_category_id == pro.sub_category_id
      ).category_id;
    });
    let { categoryId, subCategoryId, model, color } = req.query;
    let { productId } = req.params;
    let filtredProducts = products.filter((pro) => {
      let bySubCategoryId = subCategoryId
        ? subCategoryId == pro.sub_category_id
        : true;
      let byModel = model ? model == pro.model : true;
      let byColor = color ? color == pro.color : true;
      let byProductId = productId ? productId == pro.product_id : true;
      let byCategoryId = categoryId ? categoryId == pro.category_id : true;
      return (
        byProductId && byColor && byModel && bySubCategoryId && byCategoryId
      );
    });
    filtredProducts = filtredProducts.map((pro) => {
      return {
        productId: pro.product_id,
        subCategoryId: pro.sub_category_id,
        productName: pro.product_name,
        categoryId: pro.category_id,
        model: pro.model,
        color: pro.color,
        price: pro.price,
      };
    });
    return res.status(201).json({
      status: 201,
      message: "",
      data: filtredProducts,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function POST(req, res, next) {
  try {
    let products = read("products");
    let { subCategoryId, productName, price, color, model } = req.body;
    let newProduct = {
      product_id: products.length ? products[products.length - 1].product_id +1:1,
      sub_category_id: subCategoryId,
      model: model,
      product_name: productName,
      color: color,
      price: price,
    };
    products.push(newProduct);
    write('products', products)
    return res.status(200).json({
        status: 200,
        message: "product added",
        data: [
          {
            productId: newProduct.product_id,
            subCategoryId,
            productName,
            price,
            color,
            model,
          },
        ],
      });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function DELETE(req, res, next){
    try {
        let products = read("products");
    let {productId} = req.params
    let findProduct = products.find(pro => pro.product_id == productId);
    if(!findProduct) return next(new NotFoundError(404, "Product not found"));
    let filtredProducts = products.filter(product => product.product_id != productId)
    write("products", filtredProducts);
    res.status(200).json({
        status: 200,
        message: "Product deleted successfully",
        data: [
            findProduct
        ],
      });
    } catch (error) {
    return next(new InternalServerError(500, error.message));
    }

}
function PUT(req, res, next){
    try {
        let products = read("products");
    let {productId} = req.params
    let findProduct = products.find(pro => pro.product_id == productId);
    let { subCategoryId, productName, price, color, model } = req.body;
    if(!findProduct) return next(new NotFoundError(404, "Product not found"));
        findProduct.sub_category_id = subCategoryId ? subCategoryId:findProduct.sub_category_id,
        findProduct.model = model ? model: findProduct.model,
        findProduct.product_name = productName ? productName: findProduct.product_name,
        findProduct.color= color ? color : findProduct.color,
        findProduct.price= price ? price:findProduct.price,
    write("products", products);
    res.status(200).json({
        status: 200,
        message: "Product putting updated successfully",
        data: [
            findProduct
        ],
      });
    } catch (error) {
    return next(new InternalServerError(500, error.message));
    }
}

export default {
  GET,
  POST,
  DELETE,
  PUT
};
