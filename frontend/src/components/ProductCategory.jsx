import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path?.toLowerCase() === category?.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product) => product.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col uppercase mb-6">
        <p className="text-2xl font-medium uppercase">
          {searchCategory?.label || category || "CATEGORY"}
        </p>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-1" />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} compact />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-16">
          <p className="text-xl text-gray-400">Sorry, no products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;