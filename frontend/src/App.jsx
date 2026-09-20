import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HobbySelectionMinimal from "./pages/HobbySelectionMinimal";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Communities from "./pages/Communities";
import CommunityDetails from "./pages/CommunityDetails";
import Events from "./pages/Events";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes — redirect to /login if unauthenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding/hobbies" element={<HobbySelectionMinimal />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/communities/:id" element={<CommunityDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/profile/me" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-4">
                <h1 className="font-headline font-black text-4xl">Page not found</h1>
                <p className="text-text/60 mt-2">The page you are looking for does not exist.</p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center justify-center font-bold rounded-lg bg-primary text-background px-6 py-2.5"
                >
                  Go home
                </Link>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

