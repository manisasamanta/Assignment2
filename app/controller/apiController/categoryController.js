const Category = require("../../model/category");
const Product = require("../../model/product");
const subCategory = require("../../model/subcategory");


class categoryController {

    // Create a new category
    createCategory = async (req, res) => {
        try {
            const { categoryName} = req.body;

            // Check if the authenticated user is a Super Admin or Admin
            if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
                return res.status(403).send('Access denied.');
            }

            const category = new Category({ categoryName});
            await category.save();

            res.status(201).json({
                status: true,
                data: category,
                message: "Category created successfully"
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

    


    // Edit an existing category
  edit_Category = async (req, res) => {
    const { id } = req.params;
    const { categoryName} = req.body;

    try {
        // Check if the authenticated user is a Super Admin or Admin
        if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
            return res.status(403).send('Access denied.');
        }
      const category = await Category.findById(id);
      if (!category) return res.status(404).send('Category not found');

      if (categoryName) category.categoryName = categoryName;
      // if (subcategories) category.subcategories = subcategories;

      await category.save();
      res.status(200).json({
        status: true,
        data: category,
        message: "Category updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

  // Delete a category
  delete_Category = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the authenticated user is a Super Admin or Admin
        if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
            return res.status(403).send('Access denied.');
        }

      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).send('Category not found');

      res.status(200).json({
        status: true,
        message: "Category deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

  
  // Add a new subcategory
  add_subCategory = async (req, res) => {
    const {subcategoryName,categoryId} = req.body;
    try {
       // Check if the authenticated user is a Super Admin or Admin
       if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }

      const product = new subCategory({ subcategoryName,categoryId});
      await product.save();
      
      res.status(201).json({
        status: true,
        data: product,
        message: "subCategory created successfully"
    });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  // List all subcategories with category names
  list_all_SubCategories = async (req, res) => {
    try {
      // Check if the authenticated user is a Super Admin or Admin
      if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }

      const products = await subCategory.find().populate('categoryId');
      const subcategories = products.map(product => ({
        subcategory: product.subcategoryName,
        category: product.categoryId.name
      }));
      
      res.status(201).json({
        status: true,
        data: subcategories,
        message: "all subCategory fetched successfully"
    });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  // Edit a subcategory
  edit_subCategory = async (req, res) => {
    const { id } = req.params;
    const { subcategoryName, categoryId} = req.body;
    try {
      // Check if the authenticated user is a Super Admin or Admin
      if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }

      const product = await subCategory.findByIdAndUpdate(id, { subcategoryName, categoryId}, { new: true });
      if (!product) {
        return res.status(404).send('Product not found');
      }
      res.json(product);
      res.status(201).json({
        status: true,
        data: product
    });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

  // Delete a subcategory
  delete_subCategory = async (req, res) => {
    const { id } = req.params;
    try {
      // Check if the authenticated user is a Super Admin or Admin
      if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }

      const product = await subCategory.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      
      res.status(201).json({
        status: true,
        message: "subCategory deleted successfully"
    });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }






   // Delete a subcategory from a specific category
   deleteSubcategory = async (req, res) => {
    const { categoryId, subcategory } = req.body;

    try {
      // Check if the authenticated user is a Super Admin or Admin
      if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
        return res.status(403).send('Access denied.');
      }

      // Find the category and update its subcategories array
      const category = await Category.findOneAndUpdate(
        { _id: categoryId, subcategories: subcategory },
        { $pull: { subcategories: subcategory } }, // Remove subcategory from the array
        { new: true } // Return the updated document
      );

      if (!category) {
        return res.status(404).json({
          status: false,
          message: 'Category or subcategory not found'
        });
      }

      res.status(200).json({
        status: true,
        data: category,
        message: "Subcategory deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }



}

module.exports = new categoryController()