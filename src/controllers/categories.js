import { read, write } from "../utils/model.js";
import { NotFoundError, AlredExistsError, InternalServerError } from "../utils/errors.js";

function GET(req, res, next) {
  try {
    let categories = read("categories");
    let subcategories = read("subCategories");

    let { categoryId } = req.params;

    if (categoryId) {
      let findCategory = categories.find(
        (category) => category.category_id == categoryId
      );
      if (!findCategory)
        return next(new NotFoundError(404, "category not found"));
      findCategory.categoryId = findCategory.category_id;
      findCategory.categoryName = findCategory.category_name;
      findCategory.subCategories = subcategories
        .filter(
          (subcategory) => subcategory.category_id == findCategory.category_id
        )
        .map((subcategory) => {
          return {
            subCategoryName: subcategory.sub_category_name,
            subCategoryId: subcategory.sub_category_id,
          };
        });
      delete findCategory.category_id;
      delete findCategory.category_name;
      return res.status(201).json({
        status: 201,
        message: "",
        data: [findCategory],
      });
    }

    categories.forEach((category) => {
      category.categoryId = category.category_id;
      category.categoryName = category.category_name;
      category.subCategories = subcategories
        .filter(
          (subcategory) => subcategory.category_id == category.category_id
        )
        .map((subcategory) => {
          return {
            subCategoryName: subcategory.sub_category_name,
            subCategoryId: subcategory.sub_category_id,
          };
        });
      delete category.category_id;
      delete category.category_name;
    });
    res.status(201).json({
      status: 201,
      message: "",
      data: categories,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function POST(req, res, next) {
  try {
    let categories = read("categories");
    let { categoryName } = req.body;
    let findCategory = categories.find(
      (category) => category.category_name == categoryName
    );
    if (findCategory)
      return next(new AlredExistsError(403, "Category already exists"));
    let newCategory = {
      category_id: categories.length
        ? categories[categories.length - 1].category_id + 1
        : 1,
      category_name: categoryName,
    };
    categories.push(newCategory);
    write("categories", categories);
    return res.status(200).json({
      status: 200,
      message: "Category added",
      data: [
        {
          categoryId: newCategory.category_id,
          categoryName,
        },
      ],
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function DELETE(req, res, next) {
  try {
    let categories = read("categories");
    let { categoryId } = req.params;
    let findCategory = categories.find(
      (category) => category.category_id == categoryId
    );
    if (!findCategory)
      return next(new NotFoundError(404, "Category not found"));
    categories = categories.filter(
      (category) => category.category_id != categoryId
    );
    write("categories", categories);
    res.status(200).json({
      status: 200,
      message: "Category delete successfully",
      data: [
        {
          categoryId: findCategory.category_id,
          categoryName: findCategory.category_name,
        },
      ],
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
}
function PUT(req, res, next) {
  try {
    let categories = read("categories");
  let { categoryId } = req.params;
  let { categoryName } = req.body;
  let findCategory = categories.find(
    (category) => category.category_id == categoryId
  );
  if (!findCategory) return next(new NotFoundError(404, "Category not found"));
  if (findCategory.category_name == categoryName)
    return next(new AlredExistsError(404, "Category already exists"));
  findCategory.category_name = categoryName;
  write("categories", categories);
  res.status(200).json({
    status: 200,
    message: "Category putting successfully",
    data: [
      {
        categoryId: findCategory.category_id,
        categoryName: findCategory.category_name,
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
  DELETE,
  PUT,
};
