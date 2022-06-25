import {
  InternalServerError,
  NotFoundError,
  AlredExistsError,
} from "../utils/errors.js";
import { read, write } from "../utils/model.js";

function GET(req, res, next) {
  try {
    let subCategories = read("subCategories");
    let products = read("products");

    let { subcategoriesId } = req.params;

    if (subcategoriesId) {
      let findsubcategory = subCategories.find(
        (sub) => sub.sub_category_id == subcategoriesId
      );
      findsubcategory.subCategoryId = findsubcategory.sub_category_id;
      findsubcategory.subCategoryName = findsubcategory.sub_category_name;
      if (!findsubcategory)
        return next(new NotFoundError(404, "category not found"));
      findsubcategory.products = products
        .filter(
          (product) =>
            product.sub_category_id == findsubcategory.sub_category_id
        )
        .map((product) => {
          return {
            productId: product.product_id,
            productName: product.product_name,
            model: product.model,
            color: product.color,
            price: product.price,
          };
        });
      delete findsubcategory.sub_category_id;
      delete findsubcategory.sub_category_name;
      delete findsubcategory.category_id;
      return res.status(201).json({
        status: 201,
        message: "",
        data: [findsubcategory],
      });
    }

    subCategories.forEach((sub) => {
      sub.subCategoryId = sub.sub_category_id;
      sub.subCategoryName = sub.sub_category_name;
      sub.products = products
        .filter((product) => product.sub_category_id == sub.sub_category_id)
        .map((product) => {
          return {
            productId: product.product_id,
            productName: product.product_name,
            model: product.model,
            color: product.color,
            price: product.price,
          };
        });
      delete sub.sub_category_id;
      delete sub.sub_category_name;
      delete sub.category_id;
    });
    return res.status(201).json({
      status: 201,
      message: "",
      data: subCategories,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function POST(req, res, next) {
  try {
    let subCategories = read("subCategories");
    let { categoryId, subCategoryName } = req.body;
    let findSubcategories = subCategories.find(
      (subCategory) => subCategory.sub_category_name == subCategoryName
    );
    if (findSubcategories)
      return next(new AlredExistsError(403, "subCategory already exists"));
    let newSubCategory = {
      sub_category_id: subCategories.length
        ? subCategories[subCategories.length - 1].sub_category_id + 1
        : 1,
      category_id: +categoryId,
      sub_category_name: subCategoryName,
    };
    subCategories.push(newSubCategory);
    write("subCategories", subCategories);
    return res.status(200).json({
      status: 200,
      message: "subCategory added",
      data: [
        {
          subCategoryId: newSubCategory.sub_category_id,
          subCategoryName,
          categoryId,
        },
      ],
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function DELETE(req, res, next) {
  try {
    let { subcategoriesId } = req.params;
    let subCategories = read("subCategories");
    let findsubcategory = subCategories.find(
      (sub) => sub.sub_category_id == subcategoriesId
    );
    if (!findsubcategory)
      return next(new NotFoundError(404, "Sub category not found"));
    subCategories = subCategories.filter(
      (sub) => sub.sub_category_id != subcategoriesId
    );
    write("subCategories", subCategories);
    res.status(200).json({
        status: 200,
        message: "Sub category delete successfully",
        data: [
          {
            subCategoryId: findsubcategory.sub_category_id,
            subCategoryName: findsubcategory.sub_category_name,
            categoryId: findsubcategory.category_id
          },
        ],
      });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function PUT(req, res, next){
    try {
        let { subcategoriesId } = req.params;
        let subCategories = read("subCategories");
        let {subCategoryName, categoryId} = req.body
        let findsubcategory = subCategories.find(
          (sub) => sub.sub_category_id == subcategoriesId
        );
        if (!findsubcategory)
          return next(new NotFoundError(404, "Sub category not found"));
        findsubcategory.sub_category_name = subCategoryName ? subCategoryName: findsubcategory.sub_category_name
        findsubcategory.category_id = categoryId ? categoryId: findsubcategory.category_id
        write("subCategories", subCategories);
        res.status(200).json({
            status: 200,
            message: "Sub category putting updated successfully",
            data: [
              {
                subCategoryId: findsubcategory.sub_category_id,
                subCategoryName: findsubcategory.sub_category_name,
                categoryId: findsubcategory.category_id
              },
            ],
          });
      } catch (error) {
        return next(new InternalServerError(500, error.message));
      }
}
export default {
  GET,
  POST,
  DELETE,PUT
};
