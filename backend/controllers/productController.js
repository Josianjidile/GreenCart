import { v2 as cloudinary } from 'cloudinary';
import Product from '../model/productModel.js'; 

// Add product
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    // Upload all images to Cloudinary and collect their URLs
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

     await Product.create({
      ...productData,
      image: imagesUrl, 
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });

  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};


// Get all products
export const productList = async (req, res) => {
    try {
      const products = await Product.find({});
  
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve products",
        error: error.message,
      });
    }
  };
  


// Get single product by ID
export const ProductById = async (req, res) => {
    try {
      const { id } = req.body;
  
      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }
  
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving product",
        error: error.message,
      });
    }
  };
//change product in stock
import mongoose from 'mongoose';

export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            });
        }

        // Update product and return the updated document
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { inStock },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error changing stock status",
            error: error.message,
        });
    }
};