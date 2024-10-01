const Category = require("../../model/category");
const Product = require("../../model/product");
const subCategory = require("../../model/subcategory");


class homeController {

    // home = async (req, res) => {
    //     try {
    //         // Count total number of categories
    //         const totalCategories = await Category.countDocuments();

    //         // Count total number of products
    //         const totalProducts = await Product.countDocuments();

    //         // Count total number of subcategories
    //         const allSubcategories = await subCategory.aggregate([
    //             { $unwind: "$subcategories" }, // Flatten the subcategories array
    //             { $group: { _id: "$subcategories" }}, // Group by subcategory to get unique entries
    //             { $count: "totalSubcategories" } // Count the unique subcategories
    //         ]);

    //         const totalSubcategories = allSubcategories.length > 0 ? allSubcategories[0].totalSubcategories : 0;

    //         // Count products by category
    //         const productsByCategory = await Product.aggregate([
    //             {
    //                 $group: {
    //                     _id: "$categoryId",
    //                     totalProducts: { $sum: 1 }
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'categories',
    //                     localField: '_id',
    //                     foreignField: '_id',
    //                     as: 'category'
    //                 }
    //             },
    //             { $unwind: "$category" },
    //             {
    //                 $project: {
    //                     categoryName: "$category.categoryName",
    //                     totalProducts: 1,
    //                     subcategories: "$category.subcategories"
    //                 }
    //             }
    //         ]);

    //         res.status(200).json({
    //             status: true,
    //             totalCategories,
    //             totalSubcategories,
    //             totalProducts,
    //             productsByCategory,
    //             message: 'Dashboard data fetched successfully'
    //         });
    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //         res.status(500).json({ status: false, message: error.message });
    //     }
    // }


    home = async (req, res) => {
        try {
            const categories = await Category.countDocuments();
            const subcategories = await subCategory.countDocuments();
            const products = await Product.countDocuments();
            
            const categoryCounts = await Category.aggregate([
              {
                $lookup: {
                  from: 'products',
                  localField: '_id',
                  foreignField: 'categoryId',
                  as: 'products'
                }
              },
              {
                $addFields: {
                  productCount: { $size: '$products' }
                }
              }
            ]);

            res.status(200).json({
                status: true,
                categories, subcategories, products, categoryCounts,
                message: 'Dashboard data fetched successfully'
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            res.status(500).json({ status: false, message: error.message });
        }
    }

}

module.exports = new homeController()