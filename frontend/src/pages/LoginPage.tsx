import { useState } from "react";
import { Loader2, LockIcon, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AuthFormField from "../components/auth/AuthFormField";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginData } from "../types";

function LoginPage() {
  const [formData, setFormData] = useState<LoginData>({
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
    <AuthPageLayout
      title="Welcome Back"
      subtitle="Log in to continue chatting!"
      imageSrc="/login.png"
      imageAlt="Login Illustration"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthFormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          placeholder="john@example.com"
          icon={MailIcon}
          onChange={handleChange}
          required
        />
        <AuthFormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          placeholder="Password"
          icon={LockIcon}
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-btn" disabled={isLoggingIn}>
          {isLoggingIn ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/signup" className="auth-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    </AuthPageLayout>
  );
}

export default LoginPage;
