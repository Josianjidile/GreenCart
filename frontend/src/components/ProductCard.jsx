import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product, compact }) => {
    const { currency, navigate, addToCart, updateCartItem, removeFromCart, cartItems } = useAppContext();

    const handleAddToCart = () => addToCart(product._id);
    const handleIncrement = () => updateCartItem(product._id, (cartItems[product._id] || 0) + 1);
    const handleDecrement = () => {
        const newQuantity = (cartItems[product._id] || 0) - 1;
        newQuantity <= 0 ? removeFromCart(product._id) : updateCartItem(product._id, newQuantity);
    };

    return product && (
        <div className={`border border-primary/20 rounded-lg bg-white w-full h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
         
            {/* Product Image */}
            <div 
                className="relative cursor-pointer flex-grow flex items-center justify-center p-3 bg-gradient-to-b from-primary-dull/5 to-white"
                onClick={() => navigate(`/products/${product.category}/${product._id}`)}
            >
                <img 
                    className="group-hover:scale-110 transition-transform duration-300 object-contain w-full h-[120px] xs:h-[140px] sm:h-[120px]"
                    src={product.image[0]} 
                    alt={product.name} 
                    loading="lazy"
                />
            </div>
            
            {/* Product Details */}
            <div className="p-3 pt-0 flex flex-col">
                <p className="text-xs text-primary/70 font-medium uppercase tracking-wide mt-2">
                    {product.category}
                </p>
                <p 
                    className="text-gray-800 font-semibold text-sm truncate hover:text-primary cursor-pointer my-1 transition-colors"
                    onClick={() => navigate(`/products/${product.category}/${product._id}`)}
                >
                    {product.name}
                </p>
                
                {/* Rating - Exactly as in your second component */}
                <div className="flex items-center gap-0.5 mb-2">
                    {Array(5).fill('').map((_, i) => (
                        <img 
                            key={i} 
                            className='md:w-3.5 w-3' 
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon} 
                            alt="rating star" 
                        />
                    ))}
                    <p className="text-xs text-gray-500">(4)</p>
                </div>
                
                {/* Price and CTA */}
                <div className="flex items-end justify-between mt-2">
                    <div>
                        <p className="text-base font-bold text-primary">
                            {currency}{product.offerPrice || product.price}
                        </p>
                        {product.offerPrice && (
                            <p className="text-gray-500/80 text-xs line-through">
                                {currency}{product.price}
                            </p>
                        )}
                    </div>
                    <div className="text-primary">
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-dull text-white w-16 h-8 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                onClick={handleAddToCart}
                            >
                                <img src={assets.cart_icon} alt="cart" className="w-3 filter brightness-0 invert" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-20 h-8 bg-primary/10 rounded-full text-primary font-medium">
                                <button 
                                    onClick={handleDecrement} 
                                    className="w-6 h-full flex items-center justify-center hover:text-primary-dull"
                                >
                                    -
                                </button>
                                <span className="text-sm">{cartItems[product._id]}</span>
                                <button 
                                    onClick={handleIncrement} 
                                    className="w-6 h-full flex items-center justify-center hover:text-primary-dull"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;