import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Link } from "react-router-dom";
import {
  Loader2,
  LockIcon,
  MailIcon,
  MessageCircleCodeIcon,
  UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";

function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    signup(formData);
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
                    Create an Account
                  </h2>
                  <p className="text-slate-400">Join us and start chatting!</p>
                </div>
                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name Input */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        name="fullName"
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

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

                  {/* Confirm Password Input */}
                  <div>
                    <label className="auth-input-label">Confirm Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleChange}
                        className="input"
                        placeholder="Confirm Password"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="auth-btn"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? (
                        <Loader2 className="animate-spin text-center w-full" />
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Log in
                  </Link>
                </div>
              </div>
            </div>
            {/* Image Column right side */}
            <div className="hidden md:w-1/2 md:flex md:flex-col items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <img
                src="/signup.png"
                alt="Signup Illustration"
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

export default SignupPage;
