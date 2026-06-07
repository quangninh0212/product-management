module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash('error', 'Vui lòng nhập tên sản phẩm!');
    res.redirect(req.get("Referrer") || `${PATH_ADMIN}/products/create`);
    return;
  }
  
  next();
}
