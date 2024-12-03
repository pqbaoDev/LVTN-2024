const productService = require('../service/Products.service');

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProducts(req.body);
        res.status(201).json({ success: true, message: 'Nhập sản phẩm thành công', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await productService.getAllProduct(req.query);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getSingleProduct = async (req, res) => {
    try {
        const product = await productService.getSingleProduct(req.params.id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteAllProduct = async (req, res) => {
    try {
        const { _id } = req.body;
        const deletedCount = await productService.deleteAllProduct(_id);
        res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công', deletedCount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
const getProductWithCategoriesName = async (req, res) => {
    try {
        const { categories } = req.query;
        const products = await productService.getProductWithCategoriesName(categories);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getSingleProduct,
    getAllProduct,
    deleteProduct,
    deleteAllProduct,
    getProductWithCategoriesName,
};
