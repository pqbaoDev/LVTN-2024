const ProductService = require('../service/ProductTemp.service');

const createProduct = async (req, res) => {
    

  
    try {
        if (!Array.isArray(req.body.products)) {
            return res.status(400).json({ success: false, message: 'Dữ liệu sản phẩm phải là một mảng' });
        }
        const product = await ProductService.createProducts(req.body);
        res.status(201).json({ success: true, message: 'Nhập sản phẩm thành công', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await ProductService.getAllProduct(req.query);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const product = await ProductService.getSingleProduct(req.params.id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await ProductService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteAllProduct = async (req, res) => {
    try {
        const { _id } = req.body;
        const deletedCount = await ProductService.deleteAllProduct(_id);
        res.status(200).json({ success: true, message: 'Xóa sản phẩm thành công', deletedCount });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
const getProductWithCategoriesName = async (req, res) => {
    try {
        const { categories } = req.query;
        const products = await ProductService.getProductWithCategoriesName(categories);
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
