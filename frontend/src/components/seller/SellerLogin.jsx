import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const { isSeller,axios, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const {data} = await axios.post('/api/seller/login', { email, password }); 
      if (data.success) {
        setIsSeller(true);
        navigate('/seller');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error( error.message);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate('/seller/product-list');
    }
  }, [isSeller, navigate]);

  return (
    !isSeller && (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 text-sm text-gray-600">
        <form
          onSubmit={onSubmitHandler}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Seller</span> Login
          </p>

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
