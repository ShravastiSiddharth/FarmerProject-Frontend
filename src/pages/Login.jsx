import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to reset loading state if it gets stuck
  useEffect(() => {
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => {
        dispatch(loginFailure("Login request timed out"));
        setIsSubmitting(false);
      }, 5000); // 5 seconds timeout
    }

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, dispatch]);

  const handleChange = (e) => {
    // Reset error when user starts typing
    if (error) {
      dispatch(loginFailure(null));
    }
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate inputs
    if (!formData.email || !formData.password) {
      dispatch(loginFailure("Please enter both email and password"));
      return;
    }

    setIsSubmitting(true);
    dispatch(loginStart());

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        setIsSubmitting(false);
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message || 'Login failed'));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Different error handling
      if (error.name === 'AbortError') {
        dispatch(loginFailure('Request timed out. Please try again.'));
      } else {
        dispatch(loginFailure(error.message || 'An unexpected error occurred'));
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        width: "100%",
        height: "90vh",
        background:
          "linear-gradient(0deg, rgba(6,95,15,1) 0%, rgba(56,142,60,1) 50%, rgba(129,199,132,1) 100%)",
        backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col border-2 border-green-700 rounded-lg p-6 w-full gap-5 bg-white bg-opacity-90 shadow-lg">
          <h1 className="text-3xl text-center font-semibold text-green-800">AGRI CONNECT</h1>
          <p className="text-center text-green-700 font-medium -mt-3">Welcome back, farmer!</p>
          
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-green-900">
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              className="p-3 rounded-md border border-green-300 bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              value={formData.email}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold text-green-900">
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="p-3 rounded-md border border-green-300 bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
              value={formData.password}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <p className="text-green-700 text-sm hover:underline">
            <Link to={`/signup`}>Don't have an account? Sign up</Link>
          </p>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-3 text-white bg-green-700 rounded-md hover:bg-green-800 transition duration-300 font-medium shadow-md disabled:opacity-70"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
          
          {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;