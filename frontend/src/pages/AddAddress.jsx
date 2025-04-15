import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
      <form onSubmit={onSubmitHandler} className="w-full">
        <p className="text-2xl md:text-3xl text-gray-500">
          Add Shipping <span className="font-semibold text-primary">Address</span>
        </p>

        <div className="space-y-3 max-w-xl mt-10">
          <div className="flex gap-3">
            <input
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="First Name"
              required
            />
            <input
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="Last Name"
              required
            />
          </div>

          <input
            name="email"
            value={address.email}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
            type="email"
            placeholder="Email Address"
            required
          />

          <input
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
            type="text"
            placeholder="Phone Number"
            required
          />

          <input
            name="street"
            value={address.street}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
            type="text"
            placeholder="Street Address"
            required
          />

          <div className="flex gap-3">
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="City"
              required
            />
            <input
              name="state"
              value={address.state}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="State"
              required
            />
          </div>

          <div className="flex gap-3">
            <input
              name="zipcode"
              value={address.zipcode}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="Zip Code"
              required
            />
            <input
              name="country"
              value={address.country}
              onChange={handleChange}
              className="w-1/2 px-3 py-2.5 border border-gray-300 rounded outline-none text-gray-600 focus:border-primary transition"
              type="text"
              placeholder="Country"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="max-w-xl w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull uppercase rounded"
        >
          Save Address
        </button>
      </form>

      <img
        className="md:mr-16 mt-16 md:mt-0"
        src={assets.add_address_iamge}
        alt="Add address illustration"
      />
    </div>
  );
};

export default AddAddress;
