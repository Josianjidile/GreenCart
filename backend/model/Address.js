import mongoose from "mongoose";

const adressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
     firstName: {
         type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
       city: {
        type: String,
        required: true,
      },
              state: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      
  },
  {
    timestamps: true,
    minimize: false, // Keeps empty objects in `cartData`
  }
);

const  Address = mongoose.model("Address", adressSchema);
export default Address;
