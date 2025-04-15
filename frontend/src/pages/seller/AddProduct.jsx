import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { axios } = useAppContext();

  const handleImageChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!name || !category || !price) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(offerPrice) > parseFloat(price)) {
        throw new Error('Offer price cannot be greater than regular price');
      }

      const productData = {
        name,
        description: description.split('\n').filter(line => line.trim() !== ''),
        category,
        price,
        offerPrice: offerPrice || null, // Send null if no offer price
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      
      // Add only valid files
      files.forEach(file => {
        if (file) {
          formData.append('images', file);
        }
      });

      const { data } = await axios.post('/api/product/add', formData);

      if (data.success) {
        toast.success('Product added successfully!');
        // Reset form
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
      } else {
        throw new Error(data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill('').map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input 
                  onChange={(e) => handleImageChange(e, index)} 
                  accept="image/*" 
                  type="file" 
                  id={`image${index}`} 
                  hidden 
                />
                <img 
                  className="max-w-24 cursor-pointer" 
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} 
                  alt="uploadArea" 
                  width={100} 
                  height={100} 
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Product Name <span className="text-red-500">*</span></label>
          <input 
            id="product-name" 
            type="text" 
            placeholder="Type here" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
          <textarea 
            id="product-description" 
            rows={4} 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" 
            placeholder="Type here (use new lines for bullet points)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">Category <span className="text-red-500">*</span></label>
          <select 
            id="category" 
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.path}>{item.path}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Product Price <span className="text-red-500">*</span></label>
            <input 
              id="product-price" 
              type="number" 
              placeholder="0" 
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required 
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
            <input 
              id="offer-price" 
              type="number" 
              placeholder="0" 
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary-dull transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;