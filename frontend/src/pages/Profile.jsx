import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import MobileBottomNav from "../components/MobileBottomNav";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <Card className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          {/* On mobile (< 768px): Avatar & Edit Profile button sit side-by-side at top */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Avatar size="xl" alt="Alex Morgan" src="https://i.pravatar.cc/200?img=5" />
            <button className="md:hidden px-4 py-2 rounded-full bg-primary text-background font-bold text-sm">
              Edit Profile
            </button>
          </div>

          {/* User info gets full width on mobile */}
          <div className="flex-1 min-w-0 w-full">
            <h1 className="font-headline font-black text-3xl text-text">Alex Morgan</h1>
            <p className="text-primary font-bold">@alexmorgan</p>
            <p className="text-text/70 mt-3 max-w-xl leading-relaxed">
              Maker, photographer, and weekend hiker. Loves sharing progress and learning from the community.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Photography</Badge>
              <Badge variant="secondary">Woodworking</Badge>
              <Badge variant="secondary">Hiking</Badge>
            </div>
          </div>

          {/* On desktop (>= 768px): Edit Profile button sits at top right */}
          <button className="hidden md:block px-5 py-2 rounded-full bg-primary text-background font-bold shrink-0">
            Edit Profile
          </button>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card><h3 className="font-bold text-text">Hobbies</h3><p className="text-sm text-text/60 mt-2">Photography, Woodworking, Hiking</p></Card>
          <Card><h3 className="font-bold text-text">Communities</h3><p className="text-sm text-text/60 mt-2">3 joined</p></Card>
          <Card><h3 className="font-bold text-text">Posts</h3><p className="text-sm text-text/60 mt-2">12 posts</p></Card>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
