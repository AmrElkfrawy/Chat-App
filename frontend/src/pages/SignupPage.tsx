import { useState } from "react";
import { Loader2, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthFormField from "../components/auth/AuthFormField";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useAuthStore } from "../store/useAuthStore";
import type { SignupData } from "../types";

function SignupPage() {
  const [formData, setFormData] = useState<SignupData>({
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
    <AuthPageLayout
      title="Create an Account"
      subtitle="Join us and start chatting!"
      imageSrc="/signup.png"
      imageAlt="Signup Illustration"
      footerTitle="Join thousands of happy users!"
      footerTags={["Free", "Easy", "Secure"]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthFormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          placeholder="John Doe"
          icon={UserIcon}
          onChange={handleChange}
          required
        />
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
        <AuthFormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          placeholder="Confirm Password"
          icon={LockIcon}
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-btn" disabled={isSigningUp}>
          {isSigningUp ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="auth-link">
          Already have an account? Log in
        </Link>
      </div>
    </AuthPageLayout>
  );
}

export default SignupPage;
