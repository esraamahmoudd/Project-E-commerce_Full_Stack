const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowTo = require('../middlewares/allowedTo');


const productcontroller = require('../controllers/product.controller');
const router = express.Router();
const upload =require('../uploads/uploadImage')
router.route('/')
    .get(productcontroller.getAllProducts)
    .post(verifyToken, allowTo('admin'),upload.single('image'),productcontroller.createProduct
    )
    

router.route('/:productId')
    .get(productcontroller.getProduct)
    .patch(verifyToken, allowTo('admin'),upload.single('image'),productcontroller.updateProduct)
    .delete(verifyToken, allowTo('admin'),productcontroller.deleteProduct);

module.exports = router;

