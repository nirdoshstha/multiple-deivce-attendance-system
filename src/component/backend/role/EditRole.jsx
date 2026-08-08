import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import api from '../../../api/api';
import { showError, showSuccess } from '../../../utils/notify';
import { ClipLoader } from 'react-spinners';

const EditRole = () => {

    useEffect(() => {
            document.title = "Role Edit";
        }, []);
    const { id } = useParams();
    const navigate = useNavigate();


    // const [role, setRole] = useState(null);
    const [role, setRole] = useState({
        name: "",
        permissions: []
    })
    const [getPermissions, setGetPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRole();
        fetchPermissions();
    }, [id]);


    // const fetchRole = async () => {
    //     setLoading(true)
    //     try {
    //         const result = await api.get(`roles/${id}`)
    //         setRole(result.data.role);
    //         console.log(result);
    //     } catch (error) {
    //         showError(error.response.data.message || 'Something went wrong!!')
    //     }
    //     finally {
    //         setLoading(false);
    //     }
    // }
    const fetchRole = async () => {
        try {
            const result = await api.get(`roles/${id}`);

            setRole({
                name: result.data.role.name,
                permissions: result.data.role.permissions.map(permission => permission.name)
            });

        } catch (error) {
            showError(error.response.data.message || "Something went wrong!");
        }
    };

    const fetchPermissions = async () => {
        setLoading(true)
        try {
            const result = await api.get(`roles/`)
            setGetPermissions(result.data.permissions);
            console.log(result);
        } catch (error) {
            showError(error.response.data.message || 'Something went wrong!!')
        }
        finally {
            setLoading(false);
        }
    }

    // const handleCheckboxChange = (permissionName, checked) => {
    //     if (checked) {
    //         setRole(prev => ({
    //             ...prev, getPermissions: [...prev.getPermissions, permissionName]
    //         }));
    //     } else {
    //         setRole(prev => ({
    //             ...prev, getPermissions: prev.getPermissions.filter(name => name !== permissionName)
    //         }));
    //     }
    // };
    const handleCheckboxChange = (permissionName, checked) => {
        setRole(prev => ({
            ...prev,
            permissions: checked
                ? [...prev.permissions, permissionName]
                : prev.permissions.filter(
                    permission => permission !== permissionName
                )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api.put(`roles/${id}`, role)
            showSuccess(result.data.message);
            navigate(`/admin/role`)
            console.log(result)
        } catch (error) {
            showError(error.response.data.message);
        }
        finally {
            setLoading(false)
        }
    }



    let html_permissions = "";
    if (loading) {
        html_permissions =
            <div className="row align-items-center">

                <h5 className="text-center py-5"><ClipLoader color='color' size={16} /> Loading...</h5>
            </div>
    }
    else {
        html_permissions = (

            getPermissions.map((permission) => (
                <div className="col-md-3 mb-2" key={permission.id}>
                    <div className="form-check">
                        {/* <input
                                                            className="form-check-input"
                                                            type="checkbox" 
                                                            checked={role.permissions.includes(permission.name)}
                                                            value={permission.name}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(permission.name, e.target.checked)
                                                            }
                                                            id={`permission-${permission.id}`}
                                                        /> */}
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={role.permissions.includes(permission.name)}
                            value={permission.name}
                            onChange={(e) =>
                                handleCheckboxChange(permission.name, e.target.checked)
                            }
                        />

                        <label
                            className="form-check-label"
                            htmlFor={`permission-${permission.id}`}
                        >
                            <span className="status-pill active px-1">
                                {permission.name}
                            </span>
                        </label>
                    </div>
                </div>
            ))

        )
    }
    return (
        <div>
            <div className="about-view-card">
                <div className="row g-4 align-items-start">

                    {/* Details */}
                    <div className="row g-3">
                        <div className='col-lg-12'>

                            <div className="glass-card create-admin-card">
                                <div className="count-badge-row d-flex justify-content-between">
                                    <button class="theme-toggle-btn" title="Cycle theme"><i class="bi bi-pencil-square"></i> Edit Role </button>
                                    <Link to={`/admin/role`} type='submit' className="btn-primary text-decoration-none">
                                        <i class="bi bi-house-door"></i> Back To Role
                                    </Link>
                                    
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label"> Roll Name</label>
                                        <input type="text" name='name' value={role?.name} onChange={(e) => setRole({ ...role, name: e.target.value })} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Permissions <i class="bi bi-caret-down-square-fill text-primary"></i></label>

                                        <div className="row">
                                            {
                                                html_permissions
                                            }
                                        </div>
                                    </div>


                                    <div className='d-flex justify-content-center align-items-center text-center mt-2'>

                                        <button type='submit' className="btn-primary" >
                                            <i class="bi bi-check-circle"></i> Update Role & Permisssions
                                        </button>
                                    </div>


                                </form>
                            </div>
                        </div>


                        {/* Image */}
                        
                    </div>
                </div>

            </div>

            

        </div>
    )
}

export default EditRole