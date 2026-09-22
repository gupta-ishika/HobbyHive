import AppHeader from "../components/AppHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import MobileBottomNav from "../components/MobileBottomNav";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader variant="app" />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <Card className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
          {/* On mobile (< 768px): Avatar & Edit Profile button sit side-by-side at top */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Avatar size="xl" alt="Alex Morgan" src="https://i.pravatar.cc/200?img=5" status="online" />
            <Button size="sm" className="md:hidden">Edit profile</Button>
          </div>

          {/* User info gets full width on mobile */}
          <div className="flex-1 min-w-0 w-full">
            <h1 className="font-headline font-black text-2xl md:text-3xl text-text tracking-tight">Alex Morgan</h1>
            <p className="text-primary font-semibold text-sm">@alexmorgan</p>
            <p className="text-text/60 mt-3 max-w-xl leading-relaxed text-sm md:text-base">
              Maker, photographer, and weekend hiker. Loves sharing progress and learning from the community.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Photography</Badge>
              <Badge variant="secondary">Woodworking</Badge>
              <Badge variant="secondary">Hiking</Badge>
            </div>
          </div>

          {/* On desktop (>= 768px): Edit Profile button sits at top right */}
          <Button className="hidden md:inline-flex shrink-0">Edit profile</Button>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><span className="material-symbols-outlined">palette</span></div><div><h3 className="font-semibold text-text text-sm">Hobbies</h3><p className="text-xs text-text/50 mt-0.5">3 interests</p></div></div><p className="text-sm text-text/60 mt-3 leading-relaxed">Photography, Woodworking, Hiking</p></Card>
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><span className="material-symbols-outlined">groups</span></div><div><h3 className="font-semibold text-text text-sm">Communities</h3><p className="text-xs text-text/50 mt-0.5">3 joined</p></div></div><p className="text-sm text-text/60 mt-3">Active in 2 discussions this week</p></Card>
          <Card hover><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><span className="material-symbols-outlined">article</span></div><div><h3 className="font-semibold text-text text-sm">Posts</h3><p className="text-xs text-text/50 mt-0.5">12 posts</p></div></div><p className="text-sm text-text/60 mt-3">Last post 2 hours ago</p></Card>
        </div>

        <Card className="mt-6">
          <h3 className="font-semibold text-text">About</h3>
          <p className="text-sm text-text/60 mt-2 leading-relaxed">
            Alex is a product designer who loves film photography and building furniture from reclaimed oak. Joined HobbyHive to find local woodworking collectives and photo walks. Open to collaborations.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-text/60"><span className="material-symbols-outlined text-sm">location_on</span> San Francisco, CA</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-text/60"><span className="material-symbols-outlined text-sm">calendar_today</span> Joined March 2023</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-text/60"><span className="material-symbols-outlined text-sm">link</span> alexmorgan.co</span>
          </div>
        </Card>
      </div>
      <MobileBottomNav />
    </div>
  );
}

