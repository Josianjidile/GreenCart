import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const currency = import.meta.env.VITE_CURRENCY;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setCartItems({});
    }
  };

  const addToCart = (itemId) => {
    const cartData = { ...cartItems };
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    const cartData = { ...cartItems };
    if (cartData[itemId]) {
      delete cartData[itemId];
      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, cur) => acc + cur, 0);
  };

  const getCartTotal = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return Math.round(total * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (data.success) {
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  return (
    <AppContext.Provider
      value={{
        navigate,
        getCartCount,
        addToCart,
        getCartTotal,
        updateCartItem,
        removeFromCart,
        isSeller,
        setIsSeller,
        searchQuery,
        setSearchQuery,
        currency,
        products,
        setProducts,
        cartItems,
        setCartItems,
        user,
        setUser,
        fetchProducts,
        showUserLogin,
        setShowUserLogin,
        axios,
        fetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
