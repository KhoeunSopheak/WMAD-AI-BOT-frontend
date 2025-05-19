"use client"
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logo from "../assets/wmadlogo.png";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({});
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3003/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      const { token, role, user_id } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("user_id", user_id);

      navigate(`/chat/${user_id}`);
    } catch (err) {
      console.error("Error:", err.message)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="h-60 mb-4">
        <div className="w-72 h-10">
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <div className="w-full max-w-md px-6 mb-32">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition duration-200"
            disabled={loading}
          >
            {loading ? "Loging in..." : "Login"}
          </button>
        </form>
        <div className="p-2 flex justify-center">
          <h5>Don't have an account? {""}
            <Link to="/signup">
              <span className="text-[#184f71] font-semibold hover:underline">Sign up</span>
            </Link>
          </h5>
        </div>
      </div>
    </div>
  )
}
