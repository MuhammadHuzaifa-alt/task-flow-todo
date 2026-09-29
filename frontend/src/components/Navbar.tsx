import {
  useNavigate,
} from "react-router-dom";

import "../styles/Navbar.css";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({
  onMenuClick,
}: NavbarProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    navigate("/login");
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="mobile-logo">
          TaskFlow
        </div>

        <div className="breadcrumb">
          <span>Workspace</span>
          <b>/</b>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          ♢

          <span className="notification-dot" />
        </button>

        <div className="navbar-divider" />

        <div className="navbar-user">
          <div className="navbar-avatar">
            U
          </div>

          <div className="navbar-user-info">
            <strong>User</strong>
            <span>Member</span>
          </div>
        </div>

        <button
          className="navbar-logout"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;