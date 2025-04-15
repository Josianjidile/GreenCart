import express from "express";
import authSeller from "../middlewares/authSeller.js";
import { addProduct, changeStock, ProductById, productList } from "../controllers/productController.js";
import { upload } from "../config/multer.js";

const productRouter = express.Router();

productRouter.post('/add', upload.array('images', 4), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', ProductById); 
productRouter.put('/stock', authSeller, changeStock); 

export default productRouter;
