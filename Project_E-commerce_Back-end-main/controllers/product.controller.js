const Product = require('../models/product.model');


const getAllProducts = async (req, res) => {
    try {
       
        const products = await Product.find({}, { __v: false }).populate('category', 'name');
        res.status(200).json(products);

    } 
    catch (err) 
    {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);


    } 
    catch (err) 
    {
        res.status(500).json({ error: "Internal server error" });
    }
};


const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            image: req.file ? req.file.filename : null,
            category: req.body.category  
        });

        await newProduct.save();
        console.log(req.body)
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};



const updateProduct = async (req, res) => {
    try {
        const updatedData = 
        {
            ...req.body,
        };

       
        if (req.file)
             {
            updatedData.image = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { $set: updatedData },
            { new: true }
        ).populate('category', 'name'); 

        if (!updatedProduct)
         {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } 
    catch (err)
     {
        res.status(500).json({ error: "Internal server error" });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.productId);
        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};


