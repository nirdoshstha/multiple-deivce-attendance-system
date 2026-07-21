import React, { useEffect, useState } from 'react'
import { showError } from '../../../utils/notify';
import api from '../../../api/api';

const Permission = () => {

    const [routes, setRoutes] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissions, setPermissions] = useState({});


    useEffect(() => {
        getPermissions();
    }, [])

    const getPermissions = async () => {
        try {
            const result = await api.get(`/permissions`);
            setPermissions(result.data.permissions);
            setRoutes(result.data.routes);
            console.log(result)
        } catch (error) {
            showError(error.response.data.message || "Something went wrong");
        }
    }

    // const formatPermission = (name) => {
    //     return name ? name
    //         .replace(/\./g, " ")
    //         .replace(/\b\w/g, char => char.toUpperCase()) : '';
    // };
    const formatPermission = (permission) => {

        const action = permission.split(".")[1] || permission;

        return action.charAt(0).toUpperCase() + action.slice(1);

    };


    const handlePermission = (id) => {

        setSelectedPermissions(prev =>

            prev.includes(id)

                ? prev.filter(item => item !== id)

                : [...prev, id]

        );

    };


    const handleModuleSelect = (items, checked) => {

        const ids = items.map(item => item.id);

        if (checked) {

            setSelectedPermissions(prev =>

                [...new Set([...prev, ...ids])]

            );

        } else {

            setSelectedPermissions(prev =>

                prev.filter(id => !ids.includes(id))

            );

        }

    };

    const isModuleChecked = (items) => {

        return items.every(item =>

            selectedPermissions.includes(item.id)

        );

    };

    const handleSelectAll = (checked) => {

        if (checked) {

            const ids = Object.values(permissions)
                .flat()
                .map(item => item.id);

            setSelectedPermissions(ids);

        } else {

            setSelectedPermissions([]);

        }

    };

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    return (
        <div>
            <div className="admin-mgmt">
                <div className="admin-mgmt-grid">
                    {/* Create Admin Form */}
                    <div className="glass-card create-admin-card">
                        <div className="count-badge-row">
                            <div className="count-icon"><i className="bi bi-shield-person-fill" /> 2 </div>
                            <div>
                                <div className="count-label">Create New Role</div>
                                <div className="count-value" id="admin-total-count"><div className="count-value">
                                </div>
                                </div>
                            </div>
                        </div>

                        <form  >
                            <div className="form-group">
                                <label className="form-label"> Roll Name</label>
                                <input type="text" name='name' className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />

                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Permissions</label>

                                <div className="row">
                                    {routes.slice(0, 25).map((permission) => (
                                        <div className="col-md-6 mb-2" key={permission.id}>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={permission.name}
                                                    // onChange={(e) =>
                                                    //     handleCheckboxChange(permission.name, e.target.checked)
                                                    // }
                                                    id={`permission-${permission.id}`}
                                                />

                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`permission-${permission.id}`}
                                                >
                                                    <span className="status-pill active px-1">
                                                        { permission.label }
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type='submit' className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                <i className="bi bi-person-plus-fill" /> Create Role Account
                            </button>


                        </form>
                    </div>
                    {/* Admin List */}
                    {/* <div className="glass-card-solid admin-list-card">
                        <div className="admin-table-header">
                            <div>
                                <div className="section-title" style={{ fontSize: 15 }}>Permission Accounts</div>
                                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Manage existing administrator accounts</div>
                            </div>
                            <div className="search-box">
                                <i className="bi bi-search" />
                                <input type="text" className="form-control" id="adminSearch" placeholder="Search admins..." oninput="filterAdmins()" />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <div className="accordion permission-accordion">
                                <table className="admin-table" id="adminTable">
                                    <thead>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Permission</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <div className="accordion permission-accordion" id="permissionAccordion">
                                        <tbody id="adminTableBody">

                                            {Object.entries(permissions).map(([module, items], index) => (

                                                <div
                                                    className="accordion-item permission-item"
                                                    key={module}
                                                >

                                                    <h2 className="accordion-header">

                                                        <button
                                                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse-${index}`}
                                                        >

                                                            <div className="d-flex justify-content-between w-100">

                                                                <strong className="text-capitalize">

                                                                    {module}

                                                                </strong>

                                                                <span className="badge bg-primary">

                                                                    {items.length}

                                                                </span>

                                                            </div>

                                                        </button>

                                                    </h2>

                                                    <div
                                                        id={`collapse-${index}`}
                                                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                    >

                                                        <div className="accordion-body">

                                                            <div className="mb-3">

                                                                <label className="form-check">

                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        onChange={(e) =>

                                                                            handleModuleSelect(
                                                                                module,
                                                                                items,
                                                                                e.target.checked
                                                                            )

                                                                        }
                                                                    />

                                                                    <span className="fw-semibold">

                                                                        Select All

                                                                    </span>

                                                                </label>

                                                            </div>

                                                            <div className="row">

                                                                {items.map(permission => (

                                                                    <div
                                                                        className="col-lg-3 col-md-4 mb-3"
                                                                        key={permission.id}
                                                                    >

                                                                        <label className="permission-box">

                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedPermissions.includes(permission.id)}
                                                                                onChange={() => handlePermission(permission.id)}
                                                                            />

                                                                            <span>

                                                                                {formatPermission(permission.name)}

                                                                            </span>

                                                                        </label>

                                                                    </div>

                                                                ))}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                        </tbody>

                                    </div>
                                </table>

                            </div>
                        </div>
                        <div id="emptyState" style={{ display: 'none', textAlign: 'center', padding: 36, color: '#94A3B8' }}>
                            <i className="bi bi-person-x" style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
                            No admins found.
                        </div>
                    </div> */}
                    <div className="glass-card-solid admin-list-card mt-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h5 className="mb-0">
                                <i className="bi bi-shield-lock me-2"></i>
                                Permissions
                            </h5>

                            <label className="form-check">

                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={
                                        Object.values(permissions)
                                            .flat()
                                            .every(item =>
                                                selectedPermissions.includes(item.id)
                                            )
                                    }
                                    onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                    }
                                />

                                <span className="form-check-label fw-bold">

                                    Select All

                                </span>

                            </label>

                        </div>

                        <div
                            className="accordion"
                            id="permissionAccordion"
                        >

                            {

                                Object.entries(permissions).map(([module, items], index) => (

                                    <div
                                        className="accordion-item mb-3 border-0 shadow-sm rounded"
                                        key={module}
                                    >

                                        <h2 className="accordion-header">

                                            <button
                                                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${index}`}
                                                aria-expanded={index === 0}
                                            >

                                                <div className="d-flex justify-content-between w-100 align-items-center">

                                                    <strong className="text-capitalize">

                                                        {module}

                                                    </strong>

                                                    <span className="badge bg-primary">

                                                        {items.length}

                                                    </span>

                                                </div>

                                            </button>

                                        </h2>

                                        <div
                                            id={`collapse${index}`}
                                            className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                            data-bs-parent="#permissionAccordion"
                                        >

                                            <div className="accordion-body">

                                                <div className="mb-3">

                                                    <label className="form-check">

                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={isModuleChecked(items)}
                                                            onChange={(e) =>
                                                                handleModuleSelect(
                                                                    items,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />

                                                        <span className="form-check-label fw-semibold">

                                                            Select All {module}

                                                        </span>

                                                    </label>

                                                </div>

                                                <div className="row">

                                                    {

                                                        items.map(permission => (

                                                            <div
                                                                className="col-lg-3 col-md-4 col-sm-6 mb-3"
                                                                key={permission.id}
                                                            >

                                                                <label className="permission-box">

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            selectedPermissions.includes(permission.id)
                                                                        }
                                                                        onChange={() =>
                                                                            handlePermission(permission.id)
                                                                        }
                                                                    />

                                                                    <span>

                                                                        {formatPermission(permission.name)}

                                                                    </span>

                                                                </label>

                                                            </div>

                                                        ))

                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Permission