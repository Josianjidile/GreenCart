import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { RxCross1 } from "react-icons/rx";
import toast from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, setUser, showUserLogin, setShowUserLogin, getCartCount, searchQuery,axios, setSearchQuery } = useAppContext();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const {data}= await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message)
        setUser(null);
        navigate('/');
      }
    
  else{
 toast.error(data.message)   
  }
     
    } catch (error) {
      toast.error(error.message) 
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/">
        <img className="h-9" src={assets.logo} alt="GreenCart Logo" />
      </NavLink>

      {/* Mobile Cart Icon - Always visible */}
      <div className="sm:hidden flex items-center gap-4">
        <NavLink to="/cart" className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </NavLink>
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="focus:outline-none">
          {open ? (
            <RxCross1 className="w-6 h-6" />
          ) : (
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>All Products</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "text-primary font-medium" : ""}>Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} className='w-4 h-4' alt="search" />
        </div>

        <NavLink to="/cart" className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </NavLink>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            </button>

            {showProfileDropdown && (
              <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <li>
                  <NavLink
                    to="/my-orders"
                    onClick={() => setShowProfileDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Orders
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? 'flex' : 'hidden'
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-4 px-5 text-sm md:hidden z-50`}
      >
        <NavLink to="/" onClick={() => setOpen(false)} className="block w-full py-2">Home</NavLink>
        <NavLink to="/products" onClick={() => setOpen(false)} className="block w-full py-2">All Products</NavLink>
        <NavLink to="/my-order" onClick={() => setOpen(false)} className="block w-full py-2">My Orders</NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)} className="block w-full py-2">Contact</NavLink>

        {!user ? (
          <button
            onClick={() => { setOpen(false); setShowUserLogin(true); }}
            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;