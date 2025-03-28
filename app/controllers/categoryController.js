const categoryModel = require('../models/categoryModel');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryModel.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryModel.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Tìm tất cả món ăn theo category_id
    async getFoodsByCategoryId(req, res) {
        try {
            const { category_id } = req.params;
            const foods = await categoryModel.getFoodsByCategoryId(category_id);
            res.json(foods);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Tìm danh mục theo food_id
    async getCategoryByFoodId(req, res) {
        try {
            const { food_id } = req.params;
            const category = await categoryModel.getCategoryByFoodId(food_id);
            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục cho món ăn này' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createCategory(req, res) {
        try {
            const newCategory = await categoryModel.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const updatedCategory = await categoryModel.updateCategory(id, req.body);
            res.json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await categoryModel.deleteCategory(id);
            res.json({ message: 'Xóa danh mục thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
