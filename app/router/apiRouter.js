const express = require('express')
const roleController = require('../controller/apiController/roleController')
const superAdminController = require('../controller/apiController/super_AdminController')
const userApiController = require('../controller/apiController/userApiController')
const { isSuperAdmin, verifyToken } = require('../middleware/auth')
const adminController = require('../controller/apiController/adminController')
const categoryController = require('../controller/apiController/categoryController')
const productController = require('../controller/apiController/productController')
const homeController = require('../controller/apiController/homeController')
const Router = express.Router()

//role controller
Router.post('/create/role',roleController.create_role)
Router.get('/all/role',roleController.all_role)


//super Admin controller
Router.post('/create/super_Admin',verifyToken,superAdminController.create_super_Admin)
Router.post('/login/super_Admin',superAdminController.login_super_Admin)
Router.get('/all/super_Admin',verifyToken,isSuperAdmin,superAdminController.all_super_Admin)
Router.post('/edit/super_Admin/:id',verifyToken,isSuperAdmin,superAdminController.edit_Super_Admin)
Router.post('/activate_deactivate/super_Admin/:id',verifyToken,isSuperAdmin,superAdminController.activate_or_deactivate_superAdmin)
Router.delete('/delete/super_Admin/:id',verifyToken,isSuperAdmin,superAdminController.delete_super_Admin)

//userController
Router.post('/login/user',userApiController.login_user)
Router.post('/create/user',verifyToken,isSuperAdmin,userApiController.createUser)
Router.post('/edit/user/:id',verifyToken,userApiController.editUser)
Router.post('/activate_deactivate/user/:id',verifyToken,userApiController.activate_or_deactivate_user)
Router.delete('/delete/user/:id',verifyToken,userApiController.delete_user)

//admin Controller
Router.post('/login/admin',adminController.login_admin)

//category controller
Router.post('/create/category',verifyToken,categoryController.createCategory)
Router.post('/edit/category/:id',verifyToken,categoryController.edit_Category)
Router.delete('/delete/category',verifyToken,categoryController.delete_Category)
Router.delete('/delete/sub_category',verifyToken,categoryController.deleteSubcategory)

Router.post('/add/subCategory',verifyToken,categoryController.add_subCategory)
Router.post('/all/subCategory',verifyToken,categoryController.list_all_SubCategories)
Router.delete('/edit/subCategory/:id',verifyToken,categoryController.edit_subCategory)
Router.delete('/delete/subCategory/:id',verifyToken,categoryController.delete_subCategory)




//product controller
Router.post('/create/product',verifyToken,productController.createProduct)
Router.post('/edit/product/:id',verifyToken,productController.edit_Product)
Router.delete('/delete/product/:id',verifyToken,productController.deleteProduct)
Router.get('/all/product',verifyToken,productController.fetchAllProducts)

//home controller
Router.get('/home',homeController.home)






module.exports = Router