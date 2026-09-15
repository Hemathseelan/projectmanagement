import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Navbar from './Navbar';

export default function MainLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
