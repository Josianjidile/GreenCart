import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';
import { FiPackage, FiCreditCard, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { currency ,user,axios} = useAppContext();

  const fetchMyOrders = async () => {
     try {
      const {data}= await  axios.get("/api/order/user")
      if (data.success) {
          setMyOrders(data.orders)
      }
     } catch (error) {
       console.log(error)
     }
  };

  useEffect(()=>{
if (user) {
  fetchMyOrders()
}
  },[user])

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'processing':
        return <FiClock className="text-yellow-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">View your order history and track shipments</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <FiPackage className="text-gray-400 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div 
                className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div className="bg-gray-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <FiPackage className="text-gray-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 sm:flex-none">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Order #{order._id.slice(0, 8).toUpperCase()}</h3>
                    <div className="flex flex-wrap items-center mt-1 space-x-2 sm:space-x-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <FiCalendar className="mr-1" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <FiDollarSign className="mr-1" />
                        <span>{currency}{order.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        <span className={`capitalize ${
                          order.status === 'completed'
                            ? 'text-green-600'
                            : order.status === 'processing'
                            ? 'text-yellow-600'
                            : order.status === 'cancelled'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-xs sm:text-sm font-medium text-primary hover:text-primary-dark mt-2 sm:mt-0 ml-auto sm:ml-0">
                  {expandedOrder === order._id ? 'Hide details' : 'View details'}
                </button>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FiCreditCard className="mr-2 text-gray-500" />
                        Payment Information
                      </h4>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        <p><span className="font-medium">Method:</span> {order.paymentType}</p>
                        <p><span className="font-medium">Total:</span> {currency}{order.amount.toFixed(2)}</p>
                        <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h4>
                      <div className="space-y-2 sm:space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs sm:text-sm">
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-1 sm:mr-2">{item.quantity || 1}x</span>
                              <span className="text-gray-700">{item.product.name}</span>
                            </div>
                            <span className="text-gray-900 font-medium">
                              {currency}{(item.product.offerPrice * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 pt-1 sm:pt-2 mt-1 sm:mt-2 flex justify-between font-medium text-gray-900">
                          <span>Total</span>
                          <span>{currency}{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Items</h4>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-lg bg-white overflow-hidden">
                        {/* Full-width image section */}
                        <div className="w-full h-48 sm:h-64 overflow-hidden bg-gray-100">
                          <img
                            src={item.product.image[0]}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        {/* Product details section */}
                        <div className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row">
                            <div className="flex-1">
                              <h5 className="text-base sm:text-lg font-medium text-gray-900">{item.product.name}</h5>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">Category: {item.product.category}</p>
                              <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Qty: {item.quantity || 1}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {currency}{item.product.offerPrice.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4 sm:ml-6 text-right">
                              <p className="text-base sm:text-lg font-medium text-gray-900">
                                {currency}{(item.product.offerPrice * (item.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;