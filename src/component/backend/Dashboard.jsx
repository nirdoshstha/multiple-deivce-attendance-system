import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api, { BASE_URL } from '../../api/api';
import confirmDelete from '../../utils/confirmDelete';
import { showError, showSuccess } from '../../utils/notify';
import { Link } from 'react-router';
import { ClipLoader, PulseLoader } from 'react-spinners';
import * as bootstrap from "bootstrap";
import moment from 'moment/moment';
import noimage from '../../../public/no_image2.jpg'

const Dashboard = () => {

    const { user, updateAuthState } = useAuth();
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);

    const [newAdmin, setNewAdmin] = useState({
        image: null,
        name: '',
        email: '',
        phone: '',
        role: ''
    });

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        role: ''
    });

    const [userGetData, setUserGetData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    });

    const [changePassword, setChangePassword] = useState({
        password: "",
        new_password: "",
        cnew_password: "",
    })


    const submitChangePassword = async (e) => {
        e.preventDefault();

        try {
            const result = await api.put(`/users/update-password/${user.id}`, changePassword);
            console.log(result);
            showSuccess(result.data.message)
            setChangePassword({
                password: "",
                new_password: "",
                cnew_password: ""
            })
        } catch (error) {
            showError(error.response.data.message);
        }
    }


    const submitAuthProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.post(`/users/${user.id}`, userGetData);


            if (result.data.message === "Nothing to change.") {
                showError(result.data.message);
            } else {
                showSuccess(result.data.message);
                updateAuthState(
                    localStorage.getItem("auth_token"),
                    result.data.user
                );
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const [previewNewAdmin, setPreviewNewAdmin] = useState(null);



    const handleInputNewAdmin = (e) => {
        const { name, files, value } = e.target;

        if (name === 'image') {
            setPreviewNewAdmin(URL.createObjectURL(files[0]));
        }
        setNewAdmin({ ...newAdmin, [name]: files?.length ? files[0] : value })

    }

    const submitNewAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.keys(newAdmin).forEach(key => {
            formData.append(key, newAdmin[key]);
        });

        try {
            const result = await api.post('users', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (result.data.message) {
                showSuccess(result.data.message);
            }
            totalAdmins();
            setLoading(false);
            setNewAdmin({
                name: '',
                email: '',
                image: null,
                password: '',
                phone: ''
            });
            setPreviewNewAdmin(null)

        } catch (error) {
            showError(error.response.data.message)
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    }

    const [viewAdmin, setViewAdmin] = useState({});
    const [editAdminData, setEditAdminData] = useState({
        image: null,
        name: '',
        email: '',
        phone: '',
        role: ''
    });


    const deleteUser = async (id) => {
        const confirmed = await confirmDelete();

        if (!confirmed) return;

        try {
            const result = await api.delete(`users/${id}`);
            console.log(result.data);
            if (result.data.status === 200) {
                showSuccess(result.data.message);
            }

            // Refresh the list here if needed
            // fetchUsers();
            totalAdmins();

        } catch (error) {
            console.log(error);
        }
    };

    const handleAdminUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.keys(editAdminData).forEach(key => {
            formData.append(key, editAdminData[key]);
        });

        try {
            const result = await api.post(`users/${viewAdmin.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log(result.data);
            if (result.data.status === 200) {
                showSuccess(result.data.message);
                // Refresh the list here if needed

                totalAdmins();
                modal.hide();

                setTimeout(() => {
                    document.body.classList.remove("modal-open");
                    document.body.style.overflow = "";
                    document.body.style.paddingRight = "";

                    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
                }, 300);

            }

        } catch (error) {
            console.log(error);
            showError(error.response.data.message || 'Failed to update admin');
        }
    }

    const totalAdmins = async () => {
        setLoading(true);
        try {
            const result = await api.get(`users`)
            console.log(result)
            setAdmins(result.data.users);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        totalAdmins();
    }, [])



    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-title">Admin Dashboard</div>
                <div className="page-sub">Welcome back, <span className='text-primary'>{user.name || ""}</span>  Here's what's happening today.</div>
            </div>
            {/* STAT CARDS */}
            <div className="stat-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><i className="bi bi-shield-person-fill" /></div>
                    <div className="stat-value" id="stat-admin-count">4</div>
                    <div className="stat-label">Total Admins</div>
                    <div className="stat-change up"><i className="bi bi-arrow-up-short" /> +2 this month</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><i className="bi bi-people-fill" /></div>
                    <div className="stat-value">12,847</div>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-change up"><i className="bi bi-arrow-up-short" /> +8.3% growth</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-icon"><i className="bi bi-activity" /></div>
                    <div className="stat-value">99.8%</div>
                    <div className="stat-label">System Uptime</div>
                    <div className="stat-change up"><i className="bi bi-arrow-up-short" /> Stable</div>
                </div>
                <div className="stat-card cyan">
                    <div className="stat-icon"><i className="bi bi-hdd-fill" /></div>
                    <div className="stat-value">68%</div>
                    <div className="stat-label">Storage Used</div>
                    <div className="stat-change down"><i className="bi bi-arrow-down-short" /> 32% free</div>
                </div>
            </div>
            {/* ADMIN PROFILE SECTION */}
            <div className="section-header">
                <div>
                    <div className="section-title">Admin Profile</div>
                    <div className="section-sub">View and update your personal information</div>
                </div>
            </div>
            <div className="profile-section" style={{ marginBottom: 28 }}>
                {/* Left: Profile Card */}
                <div className="glass-card profile-left">
                    <div className="profile-avatar-wrap">
                        {/* <img src="" alt="" className="profile-avatar" id="profileAvatarImg" />
                        <span className="profile-online-dot" /> */}
                        {
                            user.image ? <img src={`${BASE_URL}/uploads/user/${user.image}`} alt="Profile" className="profile-avatar" />
                                : <img alt="Profile" className="profile-avatar" src={noimage} />
                        }
                    </div>
                    <div className="profile-name" id="profileDisplayName">{user?.name}</div>
                    <div className="profile-role" id="profileDisplayRole">{user?.email}</div>
                    <div className="profile-badge"><i className="bi bi-patch-check-fill" /> {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}</div>
                    <div className="profile-role" id="profileDisplayName"> <b>Joined</b>: {moment(user.created_at).format('LLLL')}</div>
                    <div className="divider" style={{ width: '100%' }} />

                    <div className="social-icons">
                        <a href="#" className="social-icon" title="LinkedIn"><i className="bi bi-linkedin" /></a>
                        <a href="#" className="social-icon" title="Twitter"><i className="bi bi-twitter-x" /></a>
                        <a href="#" className="social-icon" title="GitHub"><i className="bi bi-github" /></a>
                        <a href="#" className="social-icon" title="Email"><i className="bi bi-envelope-fill" /></a>
                    </div>
                </div>
                {/* Right: Edit Form */}
                <div className="glass-card-solid profile-right">
                    <div style={{ marginBottom: 20 }}>
                        <div className="section-title" style={{ fontSize: 15 }}>Edit Profile</div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Update your personal and password information</div>
                    </div>

                    <div>
                        <div className="admin-mgmt">
                            <div className="glass-card create-admin-card">
                                <ul className="nav nav-pills mb-3 gap-4" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-links active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Personal Information.</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-links" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Account Password.</button>
                                    </li>

                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                                        <form onSubmit={submitAuthProfileUpdate}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">First Name</label>
                                                    <input type="text" value={userGetData.name} onChange={(e) => setUserGetData({ ...userGetData, name: e.target.value })} className="form-control" placeholder="First name" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Email Address</label>
                                                    <input type="text" value={userGetData.email} onChange={(e) => setUserGetData({ ...userGetData, email: e.target.value })} className="form-control" placeholder="your@email.com" />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Phone Number</label>
                                                    <input type="text" value={userGetData?.phone} onChange={(e) => setUserGetData({ ...userGetData, phone: e.target.value })} className="form-control" placeholder="+ (977) 000-0000" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Role</label>

                                                    <input type="text" value={user.role === "admin"
                                                        ? "Admin"
                                                        : user.role === "superadmin"
                                                            ? "Super Admin"
                                                            : "User"} onChange={(e) => setUserData({ ...userData, role: e.target.value })} className="form-control" placeholder="Your role" />
                                                </div>
                                            </div>

                                            <div className="divider" />
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                {
                                                    !loading ?
                                                        <button type='submit' className="btn-primary">
                                                            <i className="bi bi-check2-circle" /> Save Changes
                                                        </button>
                                                        :
                                                        <button type="button" className="btn-primary" disabled>
                                                            <ClipLoader color='color' size={20} /><i className="bi bi-check2-circle" /> Saving...
                                                        </button>
                                                }

                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                                        <form onSubmit={submitChangePassword}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Old Password</label>
                                                    <input type="text" name='password' value={changePassword.password} onChange={(e) => setChangePassword({ ...changePassword, password: e.target.value })} className="form-control" placeholder="First name" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">New Password</label>
                                                    <input type="text" name='new_password' value={changePassword.new_password} onChange={(e) => setChangePassword({ ...changePassword, new_password: e.target.value })} className="form-control" placeholder="First name" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Confirm New Password</label>
                                                    <input type="text" name='cnew_password' value={changePassword.cnew_password} onChange={(e) => setChangePassword({ ...changePassword, cnew_password: e.target.value })} className="form-control" placeholder="your@email.com" />
                                                </div>

                                                <div className="form-group">
                                                    <div>
                                                        {
                                                            !loading ?
                                                                <button type='submit' className="btn-primary mt-4">
                                                                    <i className="bi bi-check2-circle" /> Save Changes
                                                                </button>
                                                                :
                                                                <button type="button" className="btn-primary" disabled>
                                                                    <ClipLoader color='color' size={20} /><i className="bi bi-check2-circle" /> Saving...
                                                                </button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div >

            {/* ADMIN MANAGEMENT SECTION */}
            {
                user.role === 'superadmin' ?
                    <>
                        <div className="section-header">
                            <div>
                                <div className="section-title">Admin Management</div>
                                <div className="section-sub">Create and manage administrator accounts</div>
                            </div>
                        </div>
                        <div className="admin-mgmt">
                            <div className="admin-mgmt-grid">
                                {/* Create Admin Form */}
                                <div className="glass-card create-admin-card">
                                    <div className="count-badge-row">
                                        <div className="count-icon"><i className="bi bi-shield-person-fill" />{admins.length || 0}</div>
                                        <div>
                                            <div className="count-label">Total Admins</div>
                                            <div className="count-value" id="admin-total-count"><div className="count-value">

                                            </div></div>
                                        </div>
                                    </div>
                                    <div className="section-title" style={{ fontSize: 15, marginBottom: 16 }}>Create New Admin</div>
                                    <form onSubmit={submitNewAdmin}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" name='name' value={newAdmin.name} onChange={handleInputNewAdmin} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                                            <div className="image-preview-box">
                                                <img
                                                    src={
                                                        previewNewAdmin ? previewNewAdmin : "/public/no_image2.jpg"
                                                    }
                                                    alt="Fav" className="setting-preview-image"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Image</label>
                                            <input type="file" name='image' onChange={handleInputNewAdmin} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" name='email' value={newAdmin.email} onChange={handleInputNewAdmin} className="form-control" id="newAdminEmail" placeholder="admin@company.com" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input type="tel" name='phone' value={newAdmin.phone} onChange={handleInputNewAdmin} className="form-control" id="newAdminPhone" placeholder="e.g. +1 (555) 123-4567" />
                                        </div>

                                        {
                                            !loading ?
                                                <button type='submit' className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                                    <i className="bi bi-person-plus-fill" /> Create Admin Account
                                                </button>
                                                :
                                                <button type='submit' className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                                    <PulseLoader
                                                        color='white'
                                                        loading={true}
                                                        size={14}
                                                    /> <i className="bi bi-person-plus-fill" /> Create Admin Account
                                                </button>
                                        }

                                    </form>
                                </div>
                                {/* Admin List */}
                                <div className="glass-card-solid admin-list-card">
                                    <div className="admin-table-header">
                                        <div>
                                            <div className="section-title" style={{ fontSize: 15 }}>Admin Accounts</div>
                                            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Manage existing administrator accounts</div>
                                        </div>
                                        <div className="search-box">
                                            <i className="bi bi-search" />
                                            <input type="text" className="form-control" id="adminSearch" placeholder="Search admins..." oninput="filterAdmins()" />
                                        </div>
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table class="admin-table" id="adminTable">
                                            <thead>
                                                <tr>
                                                    <tr>S.no</tr>
                                                    <th>Admin</th>
                                                    <th>Role</th>
                                                    <th>Status</th>
                                                    <th>Joined</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="adminTableBody">
                                                {
                                                    admins.map((item, index) => {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <div className="admin-name-cell">

                                                                        <div
                                                                            className="avatar-initials"
                                                                            style={{ background: "#141414aa" }}
                                                                        >
                                                                            {
                                                                                item.image ? <img src={`${BASE_URL}/uploads/user/${item.image}`} alt="Profile" class="navbar-avatar" />
                                                                                    : <img alt="Profile" class="navbar-avatar" src={noimage} />
                                                                            }

                                                                        </div>

                                                                        <div>
                                                                            <div className="admin-name">{item.name}</div>
                                                                            <div className="admin-email">{item.email}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td style={{ fontSize: "13px", color: "#64748B" }}>
                                                                    {item.role === 'superadmin' ? 'Super Admin' : item.role === 'admin' ? 'Admin' : 'User'}
                                                                </td>


                                                                <td>
                                                                    <span className="status-pill active">Active</span>
                                                                </td>

                                                                <td style={{ fontSize: "12.5px", color: "#94A3B8" }}>
                                                                    {/* {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""} */}
                                                                    {moment(item.created_at).format('LLLL')}
                                                                </td>

                                                                <td>
                                                                    <div className="table-actions">
                                                                        <button
                                                                            onClick={() => setViewAdmin(item)}
                                                                            className="btn-info-sm"
                                                                            title="View" data-bs-toggle="modal" data-bs-target="#viewModal"

                                                                        >
                                                                            <i className="bi bi-eye"></i>
                                                                        </button>

                                                                        <Link
                                                                            onClick={() => {
                                                                                setViewAdmin(item);
                                                                                setEditAdminData({
                                                                                    name: item.name,
                                                                                    email: item.email,
                                                                                    role: item.role,
                                                                                    phone: item.phone, // Assuming phone is part of the user data
                                                                                });
                                                                            }}
                                                                            className="btn-edit-sm"
                                                                            title="Edit"
                                                                            data-bs-toggle="modal" data-bs-target="#editModal"
                                                                        >
                                                                            <i className="bi bi-pencil"></i>
                                                                        </Link>

                                                                        <button
                                                                            className="btn-danger-sm"
                                                                            title="Delete"
                                                                            onClick={() => deleteUser(item.id)}>
                                                                            <i className="bi bi-trash3"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="emptyState" style={{ display: 'none', textAlign: 'center', padding: 36, color: '#94A3B8' }}>
                                        <i className="bi bi-person-x" style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
                                        No admins found.
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* View Admin Modal */}
                        <div className="modal-overlay" id="viewModal" tabIndex={-1} aria-labelledby="viewModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-box show">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                    <div id="viewAvatar" style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'rgb(255, 255, 255)', flexShrink: 0, background: 'rgb(217, 119, 6)' }}>Img</div>
                                    <div>
                                        <div className="modal-title" id="viewName"> {viewAdmin.name} </div>
                                        <div style={{ fontSize: 13, color: '#64748B' }} id="viewRole">{viewAdmin.role === 'superadmin' ? 'Super Admin' : viewAdmin.role === 'admin' ? 'Admin' : 'User'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>


                                    <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Email</div><div id="viewEmail" style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500 }}>{viewAdmin.email}</div></div>
                                    <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Phone</div><div id="viewDept" style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500 }}>{viewAdmin.phone}</div></div>
                                    <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Access Level</div><div id="viewAccess" style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500 }}>Standard</div></div>
                                    <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Status</div><div id="viewStatus"><span className="status-pill pending">Pending</span></div></div>
                                    <div><div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Joined</div><div id="viewJoined" style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500 }}> {new Date(viewAdmin.created_at).toLocaleDateString()} </div></div>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn-secondary" >Close</button>
                                </div>
                            </div>
                        </div>

                        {/* Edit Admin Modal */}
                        <div
                            className="modal fade"
                            id="editModal"
                            tabIndex="-1"
                            aria-labelledby="editModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <form onSubmit={handleAdminUpdate}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="editModalLabel">
                                                Edit Admin Account
                                            </h5>

                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={editAdminData.name}
                                                    onChange={(e) =>
                                                        setEditAdminData({
                                                            ...editAdminData,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="image"
                                                    onChange={(e) =>
                                                        setEditAdminData({
                                                            ...editAdminData,
                                                            [e.target.name]: e.target.files[0],
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={editAdminData.email}
                                                    onChange={(e) =>
                                                        setEditAdminData({
                                                            ...editAdminData,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="phone"
                                                    value={editAdminData.phone}
                                                    onChange={(e) =>
                                                        setEditAdminData({
                                                            ...editAdminData,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <select
                                                    className="form-select"
                                                    name="role"
                                                    value={editAdminData.role}
                                                    onChange={(e) =>
                                                        setEditAdminData({
                                                            ...editAdminData,
                                                            role: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="superadmin">Super Admin</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="user">User</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Close
                                            </button>

                                            <button type="submit" className="btn btn-primary">
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                    : null
            }





        </div >
    )
}

export default Dashboard