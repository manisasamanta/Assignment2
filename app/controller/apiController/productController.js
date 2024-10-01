const Category = require("../../model/category");
const Product = require("../../model/product");



class productController{

// Create a new product
createProduct = async (req, res) => {
    const { name, categoryId, subcategoryId, price } = req.body;

    try {
       // Check if the authenticated user is a Super Admin or Admin
       if (req.user.role !== 'Super Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }


      // const category = await Product.findOne({ _id: categoryId, _id: subcategoryId });
      // if (!category) {
      // return res.status(400).send('Subcategory not found in the specified category.');
      // }

      const product = new Product({ name, categoryId, subcategoryId, price });
      await product.save();
      res.status(201).json({
        status: true,
        data: product,
        message: "Product created successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  // Edit an existing product
  edit_Product = async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, subcategoryId, price } = req.body;

    try {
       // Check if the authenticated user is a Super Admin or Admin
       if (req.user.role !== 'Super Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }
      const product = await Product.findById(id);
      if (!product) return res.status(404).send('Product not found');

      if (name) product.name = name;
      if (categoryId) product.categoryId = categoryId;
      if (subcategoryId) product.subcategoryId = subcategoryId;
      if (price) product.price = price;

      await product.save();
      res.status(200).json({
        status: true,
        data: product,
        message: "Product updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }


  // Delete a product
  deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      // Check if the authenticated user is a Super Admin or Admin
      if (req.user.role !== 'Super Admin' && req.user.role !== 'User') {
        return res.status(403).send('Access denied.');
    }

      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).send('Product not found');

      res.status(200).json({
        status: true,
        message: "Product deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }




  // Fetch all products with category and subcategory details
  fetchAllProducts = async (req, res) => {
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories', // The name of the collection in MongoDB
            localField: 'categoryId', // Field in Product schema
            foreignField: '_id', // Field in Category schema
            as: 'categoryDetails'
          }
        },
        {
          $unwind: {
            path: '$categoryDetails',
            preserveNullAndEmptyArrays: true // Optional: Keep products without category
          }
        },
        {
          $project: {
            name: 1,
            price: 1,
            subcategory: 1,
            category: {
              name: '$categoryDetails.categoryName' // Adjust field names as necessary
            }
          }
        }
      ]);

      res.status(200).json({
        status: true,
        data: products,
        message: "Products fetched successfully"
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }

  




}

module.exports = new productController()