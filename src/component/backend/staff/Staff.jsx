import React, { useEffect, useState } from 'react'
import { ClipLoader, PulseLoader } from 'react-spinners';
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import confirmDelete from '../../../utils/confirmDelete';
import { useAuth } from '../../../context/AuthContext';
import api, { BASE_URL } from '../../../api/api';

import noimage from '../../../../public/no_image2.jpg'
import axios from 'axios';

const Staff = () => {

    const { can } = useAuth();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState({
        image: null,
        name: "",
        email: "",
        gender: "",
        phone: "",
        address: "",
        working_hr: ""
    });
    const [staffs, setStaffs] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [gender, setGender] = useState("");

    const [trashed, setTrashed] = useState(0);
    const [brands, setBrands] = useState([]);

    // const handleInput = (e) => {
    //     setStaff({ ...staff, [e.target.name]: e.target.value })
    // }
    const [previewImage, setPreviewImage] = useState(false);

    const handleInput = (e) => {
        const { name, files, value } = e.target;

        if (name === 'image') {
            setPreviewImage(URL.createObjectURL(files[0]))
        }

        setStaff({ ...staff, [name]: files?.length ? files[0] : value })
    }


    useEffect(() => {
        fetchDatas();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        const formData = new FormData();
        Object.keys(staff).forEach(key => {
            formData.append(key, staff[key]);
        });

        try {
            const result = await api.post(`/staffs`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            showSuccess(result.data.message);
            fetchDatas();
            setStaff({
                name: "",
                email: "",
                address: "",
                phone:"",
                gender:"",
                working_hr:"",
            });
            setPreviewImage(null);


        } catch (error) {
            showError(error.response.data.message)
        }
        finally {
            setLoading(false)
        }
    }

    const deleteStaff = async (id) => {
        const confirmed = await confirmDelete();
        if (!confirmed) return;
        setLoading(true);

        try {
            const result = await api.delete(`/staffs/${id}`)
            showSuccess(result.data.message);
            fetchDatas();
        } catch (error) {
            showError(error.response.data.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }



    const fetchDatas = async (e) => {
        try {
            const result = await api.get(`/staffs`)
            console.log(result);
            setStaffs(result.data.staffs);
            setTrashed(result.data.trashed);
            setDesignations(result.data.designations);
            setCompanies(result.data.companies);
        } catch (error) {
            showError(error.response.data.message);
        }

    }


    return (
        <div>
            <div className="admin-mgmt">
                <div className="admin-mgmt-grid">
                    {/* Create Admin Form */}
                    <div className="glass-card create-admin-card">
                        <div className="count-badge-row d-flex justify-content-between">
                            <button class="theme-toggle-btn" title="Cycle theme"><i className="bi bi-plus-circle" style={{ fontSize: "14px" }}></i> Create New User </button>

                            <div className="count-icon"><i className="bi bi-shield-person-fill" /> {staffs.length || 0}</div>
                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="form-label">Designation</label>

                                    <select
                                        name="company_id"
                                        className="form-select"
                                        onChange={handleInput}
                                    >
                                        <option value="">Select Company</option>

                                        {companies.map((company) => (
                                            <option
                                                key={company.id}
                                                value={company.id}   // or company.name
                                            >
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <div class="form-floating">
                                <input type="text" name='name' value={staff.name} onChange={handleInput} className="form-control" id="floatinginput" placeholder="e.g. Alex Rivera" />
                                <label for="floatinginput">Full Name</label>
                            </div>


                            {/* <label className="form-label">Image</label> */}
                            <div className='d-flex justify-content-between align-items-center gap-4'>
                                <input type="file" name='image' onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                                <div className="">

                                    {
                                        previewImage ? <img
                                            src={previewImage} alt="Fav" className="user-preview-image" />
                                            : <img
                                                src="/public/no_image2.jpg"

                                                alt="Fav" className="user-preview-image"
                                            />
                                    }

                                </div>
                            </div>

                            <div className="form-floating mb-0">
                                <input
                                    type="text"
                                    name="phone"
                                    value={staff.phone}
                                    onChange={handleInput}
                                    className="form-control"
                                    id="floatingphone"
                                    placeholder="Phone"
                                />
                                <label htmlFor="floatingphone">Phone</label>
                            </div>

                            <div className="form-floating mb-0">
                                <input
                                    type="text"
                                    name="email"
                                    value={staff.email}
                                    onChange={handleInput}
                                    className="form-control"
                                    id="floatingEmail"
                                    placeholder="Email"
                                />
                                <label htmlFor="floatingEmail">Email</label>
                            </div>



                            <div className="row mb-3">
                                <label className="form-label">Gender</label>

                                <div className="col-lg-12 d-flex gap-3">

                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            name="gender"
                                            id="genderMale"
                                            value="male"
                                            onChange={handleInput}
                                        />
                                        <label className="form-check-label" htmlFor="genderMale">
                                            Male
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="genderFemale"
                                            name="gender"
                                            value="female"
                                            onChange={handleInput}
                                        />
                                        <label className="form-check-label" htmlFor="genderFemale">
                                            Female
                                        </label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="genderOther"
                                            name="gender"
                                            value="other"
                                            onChange={handleInput}
                                        />
                                        <label className="form-check-label" htmlFor="genderOther">
                                            Other
                                        </label>
                                    </div>

                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="form-label">Designation</label>

                                    <select
                                        name="designation_id"
                                        className="form-select"
                                        onChange={handleInput}
                                    >
                                        <option value="">Select Designation</option>

                                        {designations.map((designation) => (
                                            <option
                                                key={designation.id}
                                                value={designation.id}   // or designation.name
                                            >
                                                {designation.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="address"
                                    value={staff.address}
                                    onChange={handleInput}
                                    className="form-control"
                                    id="floatingAddress"
                                    placeholder="Address"
                                />
                                <label htmlFor="floatingAddress">Address</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="number"
                                    name="working_hr"
                                    value={staff.working_hr}
                                    onChange={handleInput}
                                    className="form-control"
                                    id="floatingWorkingHr"
                                    placeholder="Working Hour"
                                />
                                <label htmlFor="floatingWorkingHr">Working Hour</label>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: "20px" }}>
                                {
                                    can("staffs.store") && (
                                        !loading ?
                                            <button type='submit' className="btn-primary">
                                                <i className="bi bi-check2-circle" /> Save Changes
                                            </button>
                                            :
                                            <button type="button" className="btn-primary" disabled>
                                                <ClipLoader color='color' size={20} /><i className="bi bi-check2-circle" /> Saving...
                                            </button>
                                    )
                                }



                            </div>


                        </form>
                    </div>
                    {/* Admin List */}
                    <div className="glass-card-solid admin-list-card">
                        <div className="admin-table-header">
                            <div>
                                <div className="section-title" style={{ fontSize: 15 }}>Company staff Accounts</div>
                                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Manage existing administrator accounts</div>
                            </div>

                            <div>
                                <Link to={`/admin/staff/trashed`} type="button" className="theme-toggle-btn gap-0 position-relative">
                                    <i class="bi bi-trash3-fill text-light"></i>
                                    <span className='badge ms-0'> Trashed</span>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {trashed || 0}+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </Link>

                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table class="admin-table" id="adminTable">
                                <thead>
                                    <tr>
                                        <th>S.no</th>
                                        <th>staff Name</th>
                                        <th>Company Named</th>
                                        <th>Designation</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="adminTableBody">
                                    {
                                        staffs.length > 0 ? staffs.map((staff, index) => {
                                            return (
                                                <tr key={staff.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="admin-name-cell">

                                                            <div
                                                                className="avatar-initials"
                                                                style={{ background: "#141414aa" }}
                                                            >
                                                                {
                                                                    staff.image ? <img src={`${BASE_URL}/uploads/staff/${staff.image}`} alt="Profile" class="navbar-avatar" />
                                                                        : <img alt="Profile" class="navbar-avatar" src={noimage} />
                                                                }

                                                            </div>

                                                            <div>
                                                                <div className="admin-name">{staff.name} </div>
                                                                <div className="admin-email"> {staff.email} </div>
                                                                <div className="admin-email"> {staff.phone} </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {staff.company?.name}
                                                    </td>

                                                    <td>
                                                        {staff.designation?.name}
                                                    </td>

                                                    <td>
                                                        <div className="table-actions">

                                                            {
                                                                can("staffs.show") && (
                                                                    <Link to={`/admin/staff/show/${staff.id}`} className="btn-edit-sm" title="Show" >
                                                                        <i className="bi bi-eye"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("staffs.update") && (
                                                                    <Link to={`/admin/staff/edit/${staff.id}`} className="btn-edit-sm" title="Edit" >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("staffs.destroy") && (
                                                                    <button className="btn-danger-sm" onClick={() => deleteStaff(staff.id)} title="Delete"><i className="bi bi-trash3" /></button>
                                                                )
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan={6} className='text-danger'><p>No Data Found !!</p></td>
                                            </tr>

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
        </div>
    )
}

export default Staff