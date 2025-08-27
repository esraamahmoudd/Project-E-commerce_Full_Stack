const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const allowTo = require('../middlewares/allowedTo');


const productcontroller = require('../controllers/product.controller');
const router = express.Router();
const upload =require('../uploads/uploadImage')
router.route('/')
    .get(productcontroller.getAllProducts)
    .post(upload.single('image'),productcontroller.createProduct
    )
    

router.route('/:productId')
    .get(productcontroller.getProduct)
    .patch(upload.single('image'),productcontroller.updateProduct)
    .delete(productcontroller.deleteProduct);

module.exports = router;


