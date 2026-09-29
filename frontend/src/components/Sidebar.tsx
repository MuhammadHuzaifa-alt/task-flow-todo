import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import "../styles/Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
}: SidebarProps) => {
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
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            ✓
          </div>

          <div>
            <h2>TaskFlow</h2>
            <span>Workspace</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            MAIN
          </span>

          <NavLink
            to="/dashboard"
            className={({ isActive }: { isActive: boolean }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }
            onClick={onClose}
          >
            <span className="sidebar-icon">
              ▦
            </span>

            Dashboard
          </NavLink>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">
            WORKSPACE
          </span>

          <div className="sidebar-link sidebar-link-disabled">
            <span className="sidebar-icon">
              ✓
            </span>

            My Tasks
          </div>

          <div className="sidebar-link sidebar-link-disabled">
            <span className="sidebar-icon">
              ★
            </span>

            Important
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <div className="profile-avatar">
              U
            </div>

            <div className="profile-info">
              <strong>User</strong>
              <span>Personal workspace</span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;