const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");
const PATH_ADMIN = systemConfig.prefixAdmin;

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  try {
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query);

    let find = {
      deleted: false
    }

    if (req.query.status) {
      find.status = req.query.status;
    }

    // Tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        limitItems: 4,
        currentPage: 1,
      },
      req.query,
      countProducts
    );
    //End Pagination

    const products = await Product.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
      pageTitle: "Trang sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
    });
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(`${PATH_ADMIN}/products`);
  }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });
    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products`);
  }
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const filter = { _id: { $in: ids } };

    switch (type) {
      case "active":
        await Product.updateMany(filter, { status: type });
        req.flash('success', `Cập nhật trạng thái thành công của ${ids.length} sản phẩm!`);
        break;
      case "inactive":
        await Product.updateMany(filter, { status: type });
        req.flash('success', `Cập nhật trạng thái thành công của ${ids.length} sản phẩm!`);
        break;
      case "delete-all":
        // Cách 1: Xoá vĩnh viễn
        // await Product.deleteMany(filter);

        // Cách 2: Xoá mềm
        await Product.updateMany(filter, {
          deleted: true,
          deletedAt: new Date()
        });
        req.flash('success', `Xoá thành công ${ids.length} sản phẩm!`);
        break;
      case "change-position":
        for (const item of ids) {
          const id = item.split("-")[0];
          let position = item.split("-")[1];
          position = parseInt(position);
          await Product.updateOne({ _id: id }, { position: position });
        }
        req.flash('success', `Cập nhật vị trí thành công của ${ids.length} sản phẩm!`);
        break;
      case "delete-permanently":
        await Product.deleteMany(filter);
        req.flash('success', `Xóa vĩnh viễn thành công ${ids.length} sản phẩm!`);
        break;
      case "restore":
        await Product.updateMany(filter, {
          deleted: false,
          deletedAt: null
        });
        req.flash('success', `Khôi phục thành công ${ids.length} sản phẩm!`);
        break;
      default:
        break;
    }

    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products`);
  }
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // Cách 1: Xoá vĩnh viễn
    // await Product.deleteOne({ _id: id });

    // Cách 2: Xoá mềm
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    req.flash('success', 'Xoá sản phẩm thành công!');
    res.redirect(`${PATH_ADMIN}/products`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products`);
  }
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm"
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    res.redirect(`${PATH_ADMIN}/products`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(`${PATH_ADMIN}/products/create`);
  }
}

// [GET] /admin/products/deleted
module.exports.deleted = async (req, res) => {
  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: true
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProducts
  );
  //End Pagination

  try {
    const products = await Product.find(find)
      .sort({ position: "desc" })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    res.render("admin/pages/products/deleted", {
      pageTitle: "Sản phẩm đã xoá",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
    });
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(`${PATH_ADMIN}/products/deleted`);
  }
}

// [DELETE] /admin/products/delete-permanent/:id
module.exports.deletePermanentItem = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.deleteOne({ _id: id });

    req.flash('success', 'Xóa vĩnh viễn sản phẩm thành công!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products/deleted`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products/deleted`);
  }
}

// [PATCH] /admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.updateOne(
      { _id: id },
      {
        deleted: false,
        deletedAt: null
      }
    );

    req.flash('success', 'Khôi phục sản phẩm thành công!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products/deleted`);
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products/deleted`);
  }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false,
      _id: id
    }

    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại!');
    res.redirect(`${PATH_ADMIN}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật sản phẩm thành công!');
  } catch (error) {
    req.flash('error', 'Đã có lỗi xảy ra!');
  }
  res.redirect(`${PATH_ADMIN}/products`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false,
      _id: id
    }

    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash('error', 'Sản phẩm không tồn tại!');
    res.redirect(`${PATH_ADMIN}/products`);
  }
};

