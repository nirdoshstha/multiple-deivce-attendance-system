import React, { useState } from 'react'
import '../../assets/backend/style.css'
import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';


//theme change
const themes = ['', 'theme-forest', 'theme-violet', 'theme-rose', 'theme-amber', 'theme-dark'];
const themeNames = ['Ocean Blue', 'Forest Green', 'Violet Night', 'Rose Red', 'Amber Gold', 'Theme Dark'];

const MasterLayout = () => {
    const { user, clearAuthState } = useAuth();
    const { can } = useAuth();

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userDeviceOpen, setUserDeviceOpen] = useState(false);
    const [userCompanyOpen, setUserCompanyOpen] = useState(false);

    const isMenuActive =
        location.pathname.startsWith("/admin/user") ||
        location.pathname.startsWith("/admin/gender") ||
        location.pathname.startsWith("/admin/designation") ||
        location.pathname.startsWith("/admin/vendor") ||
        location.pathname.startsWith("/admin/company");

    const isDeviceActive =
        location.pathname.startsWith("/admin/device-brand") ||
        location.pathname.startsWith("/admin/devices");

    const isCompanyActive =
        location.pathname.startsWith("/admin/company") ||
        location.pathname.startsWith("/admin/company-device");


    const [themeIdx, setThemeIdx] = useState(0);

    const handleThemeToggle = () => {
        const next = (themeIdx + 1) % themes.length;

        // Remove previous theme
        document.body.classList.remove(...themes.filter(Boolean));

        // Add next theme
        if (themes[next]) {
            document.body.classList.add(themes[next]);
        }

        // Save current theme
        setThemeIdx(next);
    };

    const [collapsed, setCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        if (window.innerWidth <= 768) {
            document.getElementById("sidebar").classList.toggle("open");
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <div>
            {/* ░░ SIDEBAR ░░ */}
            <aside className="sidebar" id="sidebar" style={{
                width: collapsed ? "64px" : "var(--sidebar-width)"
            }}>
                <div className="sidebar-brand">
                    <div className="brand-icon"><i className="bi bi-grid-3x3-gap-fill" /></div>
                    <div>
                        <div className="brand-name">Multi Device Attendance System</div>
                        <div className="brand-sub">Super Admin</div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Overview</div>
                    <div className="nav-item">
                        <NavLink to="dashboard"
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><i className="bi bi-house-door" /> Dashboard</NavLink>
                    </div>

                    <div className={`nav-item ${userMenuOpen ? "open" : ""}`}>
                        <button
                            className={`nav-link nav-dropdown ${isMenuActive ? "active" : ""}`}
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <span>
                                <i className="bi bi-people" /> Users
                            </span>

                            <i
                                className={`bi ${userMenuOpen ? "bi-chevron-down" : "bi-chevron-right"
                                    }`}
                            />
                        </button>

                        <div className={`submenu ${userMenuOpen ? "show" : ""}`} style={{ marginTop: "5px" }}>
                            <NavLink
                                to="user"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-person" /> User List
                            </NavLink>

                            <NavLink
                                to="gender"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-gender-ambiguous" /> Gender
                            </NavLink>

                            <NavLink
                                to="designation"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-briefcase" /> Designation
                            </NavLink>

                            <NavLink
                                to="vendor"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-briefcase" /> Vendors
                            </NavLink>

                            
                        </div>
                    </div>

                    <div className={`nav-item ${userCompanyOpen ? "open" : ""}`}>
                        <button
                            className={`nav-link nav-dropdown ${isCompanyActive ? "active" : ""}`}
                            onClick={() => setUserCompanyOpen(!userCompanyOpen)}
                        >
                            <span>
                                <i className="bi bi-people" /> Company & Device
                            </span>

                            <i
                                className={`bi ${userCompanyOpen ? "bi-chevron-down" : "bi-chevron-right"
                                    }`}
                            />
                        </button>

                        <div className={`submenu ${userCompanyOpen ? "show" : ""}`} style={{ marginTop: "5px" }}>
                            <NavLink
                                to="company"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-person" />Company List
                            </NavLink>

                            <NavLink
                                to="company-device"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-gender-ambiguous" /> Company Devices
                            </NavLink>



                        </div>
                    </div>

                    <div className={`nav-item ${userDeviceOpen ? "open" : ""}`}>
                        <button
                            className={`nav-link nav-dropdown ${isDeviceActive ? "active" : ""}`}
                            onClick={() => setUserDeviceOpen(!userDeviceOpen)}
                        >
                            <span>
                                <i className="bi bi-people" /> Devices
                            </span>

                            <i
                                className={`bi ${userDeviceOpen ? "bi-chevron-down" : "bi-chevron-right"
                                    }`}
                            />
                        </button>

                        <div className={`submenu ${userDeviceOpen ? "show" : ""}`} style={{ marginTop: "5px" }}>
                            <NavLink
                                to="device-brand"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-person" />Deivce Brand
                            </NavLink>

                            <NavLink
                                to="device"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                } style={{ color: "light" }}
                            >
                                <i className="bi bi-gender-ambiguous" /> Devices
                            </NavLink>



                        </div>
                    </div>


                    <div className="nav-item">
                        <NavLink to="role" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><i className="bi bi-people" /> Roles & Permissions</NavLink>
                    </div>
                    <div className="nav-item">
                        <NavLink to="permission" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><i className="bi bi-people" /> Permission</NavLink>
                    </div>

                    <div className="nav-item">
                        <NavLink to="about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><i className="bi bi-bar-chart-line" /> About Us <span className="nav-badge">New</span></NavLink>
                    </div>
                    <div className="nav-section-label">Management</div>
                    <div className="nav-item">
                        <a href="#" className="nav-link"><i className="bi bi-shield-person" /> Admins <span className="nav-badge" id="sidebar-admin-count">4</span></a>
                    </div>

                    <div className="nav-item">
                        <a href="#" className="nav-link"><i className="bi bi-file-earmark-text" /> Reports</a>
                    </div>
                    <div className="nav-section-label">System</div>

                    {
                        can("settings.store") && (
                            <div className="nav-item">
                                <NavLink to="setting" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><i className="bi bi-gear" /> Settings</NavLink>
                            </div>
                        )
                    }

                    <div className="nav-item">
                        <a href="#" className="nav-link"><i className="bi bi-bell" /> Notifications <span className="nav-badge">3</span></a>
                    </div>
                    <div className="nav-item">
                        <a href="#" className="nav-link"><i className="bi bi-question-circle" /> Help</a>
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <img src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8&size=80" alt="Sarah Chen" className="sidebar-user-img" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }} />
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user.name ?? ''}</div>
                            <div className="sidebar-user-role">{user.role ?? ''}</div>
                        </div>
                        <button onClick={(e) => clearAuthState()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }} title="Logout">
                            <i className="bi bi-box-arrow-right" />
                        </button>
                    </div>
                </div>
            </aside>


            {/* ░░ MAIN WRAP ░░ */}
            <div className="main-wrap" id="mainWrap" style={{
                marginLeft: collapsed ? "64px" : "var(--sidebar-width)"
            }}>
                {/* TOP NAVBAR */}
                <header className="top-navbar">
                    {/* <button className="nav-toggle-btn" id="sidebarToggle" title="Toggle sidebar">
                        <i className="bi bi-list" />
                    </button> */}

                    <button
                        className="nav-toggle-btn"
                        onClick={handleSidebarToggle}
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    <div className="nav-breadcrumb">
                        <i className="bi bi-house" style={{ fontSize: 13 }} />
                        <i className="bi bi-chevron-right" style={{ fontSize: 10, color: '#CBD5E1' }} />
                        <span>Dashboard</span>
                    </div>
                    <div className="navbar-right">
                        <button className="theme-toggle-btn" onClick={handleThemeToggle} title="Cycle theme">

                            <i className="bi bi-palette" /> Theme
                        </button>
                        <button className="icon-btn" title="Search">
                            <i className="bi bi-search" />
                        </button>
                        <button className="icon-btn" title="Notifications">
                            <i className="bi bi-bell" />
                            <span className="notif-dot" />
                        </button>
                        <button className="icon-btn" title="Messages">
                            <i className="bi bi-chat-dots" />
                        </button>
                        <img src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8&size=80" alt="Profile" className="navbar-avatar" />
                    </div>
                </header>
                {/* PAGE BODY */}
                <main className="page-body">

                    <Outlet />

                </main>
            </div>
            {/* ░░ MODALS ░░ */}






            {/* Delete Confirm Modal */}
            <div className="modal-overlay" id="deleteModal">
                <div className="modal-box" style={{ maxWidth: 380, textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26, color: '#EF4444' }}>
                        <i className="bi bi-trash3" />
                    </div>
                    <div className="modal-title">Delete Admin?</div>
                    <div className="modal-sub">This action cannot be undone. The admin will lose all access permanently.</div>
                    <input type="hidden" id="deleteAdminId" />
                    <div className="modal-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn-secondary" onclick="closeModal('deleteModal')">Cancel</button>
                        <button style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }} onclick="confirmDelete()">
                            <i className="bi bi-trash3" /> Delete
                        </button>
                    </div>
                </div>
            </div>
            {/* Toast Container */}
            <div className="toast-container" id="toastContainer">
            </div>


        </div>

    )
}

export default MasterLayout