import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import { Toaster } from "react-hot-toast";
import ProductCategory from "./components/ProductCategory";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import PageNotFound from "./pages/PageNotFound";
import Loading from "./components/Loading";


const App = () => {
  const location = useLocation();
  const { showUserLogin, isSeller } = useAppContext();
  
  // Check if current path is a seller route
  const isSellerRoute = location.pathname.startsWith("/seller");

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isSeller) {
      return <Navigate to="/seller" replace />;
    }
    return children;
  };

  return (
    <div >
      {/* Don't show navbar for seller routes */}
      {!isSellerRoute && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster position="top-right" />

      <main className={`flex-grow ${isSellerRoute ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<AddAddress />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          {/* Seller routes */}
          <Route path="/seller" element={isSeller ? <Navigate to="/seller/dashboard" replace /> : <SellerLogin />} />
          <Route path="/seller/*" element={
            <ProtectedRoute>
              <SellerLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      </main>

      {/* Don't show footer for seller routes */}
      {!isSellerRoute && <Footer />}
    </div>
  );
};

export default App;