import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";


const SellerLayout = () => {
  const { setIsSeller, axios } = useAppContext();
  const navigate = useNavigate();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
  
      if (data.success) {
        toast.success(data.message);
        setIsSeller(false);
        setTimeout(() => navigate("/", { replace: true }), 100); 
      }
      
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white">
        <Link to="/" className="flex items-center">
          <img className="h-9" src={assets.logo} alt="Company Logo" />
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Hi! Admin</p>
          <button
            onClick={logout}
            className="border border-gray-300 rounded-full text-sm px-4 py-1 hover:bg-gray-50 transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="md:w-64 w-16 border-r border-gray-200 bg-white flex flex-col">
          <nav className="flex-1 flex flex-col pt-4">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 gap-3 transition-colors
                  ${
                    isActive
                      ? "border-r-4 md:border-r-[6px] bg-indigo-50 border-primary text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                end
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 min-w-[24px]"
                />
                <span className="md:block hidden whitespace-nowrap">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
