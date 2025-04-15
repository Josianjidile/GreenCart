import { useEffect, useState } from "react";
import { assets, dummyOrders } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { FiBox, FiCreditCard, FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const Orders = () => {
  const { currency,axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const {data}= await  axios.get("/api/order/seller")
      if (data.success) {
          setOrders(data.orders)
      }
     } catch (error) {
       console.log(error)
     };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="md:p-8 p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        <p className="text-gray-600 mt-1">View and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <img src={assets.box_icon} alt="" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-600">Your orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Order Items */}
                <div className="md:col-span-5">
                  <div className="flex items-start space-x-4">
                    <div className=" w-12 h-12 bg-gray-100 p-3 rounded-lg flex-shrink-0">
                    <img src={assets.box_icon} alt="" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order #{order._id.slice(0, 8).toUpperCase()}</h3>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 mr-3">
                              <img
                                src={item.product.image[0] || assets.placeholder}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {item.product.name}
                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                              </p>
                              <p className="text-xs text-gray-500">{currency}{item.product.offerPrice.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="md:col-span-3 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Customer</h4>
                  <p className="text-gray-800">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600 truncate">
                    {order.address.street}, {order.address.city}
                  </p>
                  <p className="text-gray-600">
                    {order.address.state}, {order.address.zipcode}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-2 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-800 font-medium">
                    Total: {currency}{order.amount.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(order.status)}
                    <span className={`ml-1.5 capitalize ${
                      order.status === 'completed' ? 'text-green-600' :
                      order.status === 'processing' ? 'text-yellow-600' :
                      order.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="md:col-span-2 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                  <div className="flex items-center text-gray-600">
                    <FiCreditCard className="mr-1.5" />
                    <span className="capitalize">{order.paymentType}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <FiCalendar className="mr-1.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`mt-1 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;