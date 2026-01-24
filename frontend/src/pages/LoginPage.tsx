import { useState } from "react";
import {
  Loader2,
  LockIcon,
  MailIcon,
  MessageCircleCodeIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useAuthStore } from "../store/useAuthStore";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-800px h-650px">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* Form Column left side */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* Heading Text */}
                <div className="text-center mb-8">
                  <MessageCircleCodeIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">Log in to continue chatting!</p>
                </div>
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                        className="input"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="auth-btn"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <Loader2 className="animate-spin text-center w-full" />
                      ) : (
                        "Log In"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>
            {/* Image Column right side */}
            <div className="hidden md:w-1/2 md:flex md:flex-col items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <img
                src="/login.png"
                alt="Login Illustration"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Start Your Journey Today!
                </h3>
                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Secure</span>
                  <span className="auth-badge">Fast</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default Login;
