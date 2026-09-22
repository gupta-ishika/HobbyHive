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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* accent blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full opacity-20 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full opacity-30 blur-3xl -z-10 pointer-events-none" />

      <Card className="w-full max-w-md" padding="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary text-background items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">Welcome back</h1>
          <p className="text-text/60 mt-2 text-sm">Sign in to continue to HobbyHive</p>
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
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon="lock"
            autoComplete="current-password"
          />
          <div className="flex justify-end -mt-1">
            <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
          </div>
          <Button type="submit" className="w-full" size="lg">Continue</Button>
          <p className="text-center text-sm text-text/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text/40">
          <span className="material-symbols-outlined text-sm">shield</span> Secured by HobbyHive
        </div>
      </Card>
    </div>
  );
}

