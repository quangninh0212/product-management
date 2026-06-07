const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = products.map(item => {
    item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(2);
    return item;
  })

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
}

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const find = {
      slug: slug,
      status: "active",
      deleted: false
    }
    const product = await Product.findOne(find);
    if (!product) {
      res.flash("error", "Lỗi! Không tìm thấy sản phẩm");
      return res.redirect("/products");
    }
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.flash("error", "Lỗi! Không tìm thấy sản phẩm");
    res.redirect("/products");
  }
}
