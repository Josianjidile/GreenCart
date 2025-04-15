import express from "express"
import { userRegister, userLogin, isAuth,userLogout } from "../controllers/UserController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router()


userRouter.post('/register',userRegister)
userRouter.post('/login',userLogin)
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,userLogout)

export default userRouter