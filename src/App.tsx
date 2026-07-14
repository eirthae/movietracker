import { Outlet, Route, Routes } from 'react-router-dom';

import { TabBar } from '@/components/TabBar';
import { AddCinemaPage } from '@/pages/AddCinemaPage';
import { CinemasPage } from '@/pages/CinemasPage';
import { SettingsPage } from '@/pages/SettingsPage';

/** Phone-width shell with the bottom tab bar (Cinemas + Settings). */
function TabLayout() {
  return (
    <div className="shell">
      <Outlet />
      <TabBar />
    </div>
  );
}

/** Phone-width shell without the tab bar (add flow). */
function PlainLayout() {
  return (
    <div className="shell">
      <Outlet />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<TabLayout />}>
        <Route path="/" element={<CinemasPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route element={<PlainLayout />}>
        <Route path="/add" element={<AddCinemaPage />} />
      </Route>
    </Routes>
  );
}
