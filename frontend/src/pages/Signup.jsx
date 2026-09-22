import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (form.confirm !== form.password) {
      newErrors.confirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // per new spec: Signup → Hobby Selection → Feed
    login({ name: form.name, username: form.username, email: form.email, avatar: "https://i.pravatar.cc/100?img=5" });
    navigate("/onboarding/hobbies");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full opacity-20 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full opacity-20 blur-3xl -z-10 pointer-events-none" />

      <Card className="w-full max-w-md" padding="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary text-background items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined">person_add</span>
          </div>
          <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">Create account</h1>
          <p className="text-text/60 mt-2 text-sm">Join HobbyHive in seconds</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input label="Full name" name="name" placeholder="Alex Morgan" value={form.name} onChange={update("name")} error={errors.name} icon="person" autoComplete="name" />
          <Input label="Username" name="username" placeholder="alexmorgan" value={form.username} onChange={update("username")} error={errors.username} icon="alternate_email" autoComplete="username" />
          <p className="text-xs text-text/50 -mt-2 px-1">Your permanent public identity — choose wisely.</p>
          <Input label="Email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email} icon="mail" autoComplete="email" />
          <Input label="Password" type="password" name="password" placeholder="••••••••" value={form.password} onChange={update("password")} error={errors.password} icon="lock" autoComplete="new-password" />
          <Input label="Confirm password" type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={update("confirm")} error={errors.confirm} icon="lock" autoComplete="new-password" />
          <Button type="submit" className="w-full" size="lg">Create account</Button>
          <p className="text-center text-xs text-text/50 px-2 leading-relaxed">
            By signing up you agree to our <a className="text-primary font-semibold hover:underline" href="#">Terms</a> and{" "}
            <a className="text-primary font-semibold hover:underline" href="#">Privacy</a>
          </p>
          <p className="text-center text-sm text-text/60">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

