import React from "react";
import { assets, categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
    const { navigate } = useAppContext();

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Shop by Categories</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: category.bgColor }}
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div className="p-4 flex flex-col items-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3">
                                <img 
                                    src={category.image} 
                                    alt={category.text} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>
                            <p className="text-center font-medium text-gray-800 group-hover:text-primary">
                                {category.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;