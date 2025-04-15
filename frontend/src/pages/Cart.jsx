import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    user,
    axios,
    setCartItems,
  } = useAppContext();

  const [showAddress, setShowAddress] = useState(false);
  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState('COD');
  const [loading, setLoading] = useState(false);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({ ...product, quantity: cartItems[key] }); // Don't mutate original object
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddresses(data.addresses || []);
        if (data.addresses?.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message || 'Failed to load addresses');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  const calculateTotal = () => {
    return cartArray.reduce(
      (total, item) => total + item.offerPrice * item.quantity,
      0
    );
  };

  const calculateTax = () => calculateTotal() * 0.02;

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItem(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('Please select a delivery address');
      }

      if (paymentOption === 'COD') {
        setLoading(true);
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.success);
          setCartItems({});
          navigate('/my-orders');
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      } else {
        // Stripe order
        setLoading(true);
        const { data } = await axios.post('/api/order/stripe', {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success && data.url) {
          setCartItems({});
          window.location.replace(data.url);
        } else {
          toast.error(data.message || 'Payment failed');
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (!user) {
    return (
      <div className="py-16 max-w-6xl w-full px-6 mx-auto text-center">
        <h1 className="text-3xl font-medium mb-4">
          Please login to view your cart
        </h1>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Login
        </button>
      </div>
    );
  }

  if (products.length === 0 || !cartItems || Object.keys(cartItems).length === 0) {
    return (
      <div className="py-16 max-w-6xl w-full px-6 mx-auto text-center">
        <h1 className="text-3xl font-medium mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-8">
      {/* Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{' '}
          <span className="text-sm text-primary">{getCartCount()} items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium py-4 border-b"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                onClick={() =>
                  navigate(`/product/${product._id}/${product.category}`)
                }
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500/70 text-sm">
                  Size: {product.size || 'N/A'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p>Qty:</p>
                  <select
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product._id, e.target.value)
                    }
                    className="outline-none border rounded px-2 py-1"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => handleRemoveItem(product._id)}
              className="cursor-pointer mx-auto flex items-center justify-center p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Remove item"
              title="Remove item"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate('/products')}
          className="group flex items-center mt-8 gap-2 text-primary font-medium hover:text-primary-dull transition"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 border border-gray-300/70 rounded-lg">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        {/* Address Section */}
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          {selectedAddress ? (
            <div className="relative flex justify-between items-start mt-2">
              <div>
                <p className="font-medium">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-gray-500 text-sm">{selectedAddress.street}</p>
                <p className="text-gray-500 text-sm">
                  {selectedAddress.city}, {selectedAddress.state}
                </p>
                <p className="text-gray-500 text-sm">
                  Phone: {selectedAddress.phone}
                </p>
              </div>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary hover:underline cursor-pointer text-sm"
              >
                Change
              </button>
              {showAddress && (
                <div className="absolute top-full right-0 left-0 z-10 py-1 bg-white border border-gray-300 rounded shadow-lg text-sm">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="font-medium">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-gray-500">{address.street}</p>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      navigate('/address');
                      setShowAddress(false);
                    }}
                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10 border-t"
                  >
                    Add new address
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-500 text-sm">No address selected</p>
              <button
                onClick={() => navigate('/address')}
                className="text-primary hover:underline cursor-pointer text-sm mt-1"
              >
                Add address
              </button>
            </div>
          )}

          {/* Payment Method */}
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none rounded"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        {/* Price Summary */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currency}
              {calculateTotal().toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {calculateTax().toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(calculateTotal() + calculateTax()).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || loading}
          className={`w-full py-3 mt-6 bg-primary text-white font-medium hover:bg-primary-dull transition rounded ${
            (!selectedAddress || loading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
