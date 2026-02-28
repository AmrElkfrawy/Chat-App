import type { LucideIcon } from "lucide-react";

interface AuthFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function AuthFormField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  icon: Icon,
  onChange,
  required = false,
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="auth-input-label">{label}</label>
      <div className="relative">
        <Icon className="auth-input-icon" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

export default AuthFormField;
