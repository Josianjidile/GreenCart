import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
    const { products = [] } = useAppContext(); // Default to empty array
    
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Best Sellers</h2>
            
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
                {products.slice(0, 5).map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;