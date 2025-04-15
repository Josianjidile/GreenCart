import express from "express";
import authUser from "../middlewares/authUser.js";
import { getAllOrders, getOrdersByUserId, placeOrderCOD, placeOrderStripe } from "../controllers/orderController.js";



const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.get('/user',authUser,getOrdersByUserId)
orderRouter.get('/seller',authUser,getAllOrders)

export default orderRouter;