import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate, fetchUser } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(
                `/api/user/${state}`,
                { name, email, password },
                { withCredentials: true }
              );
              

            if (data.success) {
                // Immediately update user state with the returned data
                setUser(data.user);
                
                // Close the login modal
                setShowUserLogin(false);
                
                // Show success message
                toast.success(data.message);
                
                // Navigate to home
                navigate("/");
                
                // Force a refresh of user data to ensure consistency
                await fetchUser();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const message =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors)[0][0]
                    : error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={() => setShowUserLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
        >
            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Type here"
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
                        placeholder="Type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required
                    />
                </div>

                {state === "register" ? (
                    <p>
                        Already have an account?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span
                            onClick={() => setState("register")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                )}

                <button
                    disabled={loading}
                    className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer ${
                        loading && "opacity-50 cursor-not-allowed"
                    }`}
                >
                    {loading
                        ? "Please wait..."
                        : state === "register"
                        ? "Create Account"
                        : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;