



//update user cartdata
import User from "../model/userModel.js"
export const updateCart  = async (req,res) => {
    try {
        const {userId,cartItems}= req.body
        await   User.findByIdAndUpdate(userId,{cartItems})
        res.json({success:true,message: "cart updated"})
    } catch (error) {
        console.log(error.message)
       res.json({success:false, message:error.message})
    }
}