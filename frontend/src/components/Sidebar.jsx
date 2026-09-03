import { useState } from "react";
import ChangePassword from "./ChangePassword";
import "./Sidebar.css";

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '▦' },
  { id: 'transactions', label: 'Transactions',  icon: '⇄' },
  { id: 'budget',       label: 'Budget',        icon: '◎' },
  { id: 'reports',      label: 'Reports',       icon: '↗' },
];

export default function Sidebar({ page, setPage, onLogout, user, theme, toggleTheme }) {
  const [showCP, setShowCP] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const initials = user?.name?.slice(0, 2).toUpperCase() || '??';

  return (
    <>
      <aside className="sidebar">

        <div className="sidebar-glow" />

        {/* Logo */}
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">FinTrack</span>
        </div>

        <div className="sidebar-divider" />

        {/* User Card */}
        <div className="user-card">
          <div className="user-avatar">
            {initials}
            <span className="online-dot" />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-status">● Active session</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav */}
        <nav className="sidebar-nav">
          <p className="nav-section-label">NAVIGATION</p>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''} ${hoveredItem === id ? 'hovered' : ''}`}
              onClick={() => setPage(id)}
              onMouseEnter={() => setHoveredItem(id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
              {page === id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">

          {/* 🌙 / ☀️ Theme Toggle */}
          <button className="btn-theme-toggle" onClick={toggleTheme}>
            <span className="btn-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* 🔑 Change Password */}
          <button className="btn-change-password" onClick={() => setShowCP(true)}>
            <span className="btn-icon">🔑</span>
            <span>Change Password</span>
          </button>

          {/* 🚪 Logout */}
          <button className="btn-logout" onClick={onLogout}>
            <span className="btn-icon">→</span>
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {showCP && (
        <ChangePassword userId={user?.id} onClose={() => setShowCP(false)} />
      )}
    </>
  );
}