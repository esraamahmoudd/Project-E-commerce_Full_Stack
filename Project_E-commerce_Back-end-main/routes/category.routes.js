const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const allowTo = require("../middlewares/allowedTo");
const verifyToken = require('../middlewares/verifyToken');

router
  .route("/")
  .get(verifyToken, allowTo('admin'), categoryController.getCategories)
  .post( categoryController.createCategory);
router
  .route("/:id")
  .get(verifyToken, allowTo('admin'), categoryController.getCategoryById)
  .put(verifyToken, allowTo('admin'), categoryController.updateCategory)
  .delete(verifyToken, allowTo('admin'), categoryController.deleteCategory);
module.exports = router;
// app.use('/api/categories', categoryRoutes);
