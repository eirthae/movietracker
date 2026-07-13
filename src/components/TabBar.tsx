import { NavLink } from 'react-router-dom';

export function TabBar() {
  return (
    <nav className="tabbar">
      <NavLink to="/" end className={({ isActive }) => `tabbar-item${isActive ? ' active' : ''}`}>
        <iconify-icon icon="solar:clapperboard-linear" />
        <span>Cinemas</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => `tabbar-item${isActive ? ' active' : ''}`}
      >
        <iconify-icon icon="solar:settings-linear" />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
}
