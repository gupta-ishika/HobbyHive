import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // TODO(auth): Mock stub — always logs in as a fixed identity regardless of entered
    // credentials. Replace with real auth once the backend is wired up.
    // Note: Signup.jsx already forwards the real form data; keep both in sync.
    login({ name: "Alex Morgan", username: "alexmorgan", avatar: "https://i.pravatar.cc/100?img=5" });
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* accent blobs like Landing */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent rounded-full opacity-30 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary rounded-full opacity-40 blur-3xl -z-10" />

      <Card className="w-full max-w-md" padding="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-full bg-accent text-primary items-center justify-center mb-3">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <h1 className="font-headline font-black text-3xl text-text tracking-tight">Welcome back</h1>
          <p className="text-text/60 mt-2">Sign in to your Hobby Hub</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon="mail"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon="key"
          />
          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full" size="lg">Login</Button>
          <p className="text-center text-sm text-text/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-accent flex items-center justify-center gap-2 text-xs text-text/40">
          <span className="material-symbols-outlined text-sm">shield</span> Secured by Hobby Hub
        </div>
      </Card>
    </div>
  );
}
