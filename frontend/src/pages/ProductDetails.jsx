import React, { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    const { id, category } = useParams();
    const navigate = useNavigate();
    const { products, currency, addToCart } = useAppContext();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => 
                product.category === item.category && item._id !== id
            );
            setRelatedProducts(productsCopy.slice(0, 4));
        }
    }, [products, id, product]);

    useEffect(() => {
        if (product?.image?.[0]) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="mt-12 px-4 max-w-7xl mx-auto">
            <p className="text-sm text-gray-600">
                <span 
                    className="cursor-pointer hover:text-primary" 
                    onClick={() => navigate('/')}
                >
                    Home
                </span> / 
                <span 
                    className="cursor-pointer hover:text-primary" 
                    onClick={() => navigate('/products')}
                >
                    Products
                </span> / 
                <span 
                    className="cursor-pointer hover:text-primary" 
                    onClick={() => navigate(`/products/${category}`)}
                >
                    {category}
                </span> / 
                <span className="text-primary">{product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                {/* Image section */}
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} 
                                className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Product details */}
                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img 
                                key={i} 
                                className='md:w-3.5 w-3' 
                                src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                                alt="rating star" 
                            />
                        ))}
                        <p className="text-base ml-2">({product.rating})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: ${product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded">
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart"); }} className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary-dull transition rounded">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.filter(product => product.inStock).map((product) => (
                            <ProductCard 
                                key={product._id}
                                product={product}
                                onClick={() => navigate(`/product/${product._id}/${product.category}`)}
                            />
                        ))}
                    </div>
                    
                    {/* See More Button */}
                    <div className="mt-10 flex justify-center">
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-primary text-white font-medium rounded hover:bg-primary-dull transition-colors duration-300"
                        >
                            See More Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;