import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../../../api/api';
import { showError, showSuccess } from '../../../utils/notify';
import { ClipLoader } from 'react-spinners';
import Accordion from 'react-bootstrap/Accordion';

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
    const [permissionGroups, setPermissionGroups] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadRoleData = async () => {
            setLoading(true);
            try {
                const roleResponse = await api.get(`roles/${id}`);

                if (!isMounted) return;

                const roleData = roleResponse.data?.role;
                setRole({
                    name: roleData?.name ?? '',
                    permissions: Array.isArray(roleData?.permissions)
                        ? roleData.permissions.map((permission) => permission.name)
                        : [],
                });
                setPermissionGroups(
                    roleResponse.data?.permissions && typeof roleResponse.data.permissions === 'object'
                        ? roleResponse.data.permissions
                        : {},
                );
            } catch (error) {
                if (isMounted) {
                    showError(error.response?.data?.message || 'Unable to load role details.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadRoleData();

        return () => {
            isMounted = false;
        };
    }, [id]);

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

    const allPermissionNames = Object.values(permissionGroups)
        .flat()
        .map((permission) => permission.name);
    const allPermissionsSelected = allPermissionNames.length > 0
        && allPermissionNames.every((permissionName) => role.permissions.includes(permissionName));

    const handleAllPermissionsChange = (checked) => {
        setRole((currentRole) => ({
            ...currentRole,
            permissions: checked ? allPermissionNames : [],
        }));
    };

    const handleGroupPermissionsChange = (groupPermissions, checked) => {
        const groupPermissionNames = groupPermissions.map((permission) => permission.name);

        setRole((currentRole) => ({
            ...currentRole,
            permissions: checked
                ? [...new Set([...currentRole.permissions, ...groupPermissionNames])]
                : currentRole.permissions.filter(
                    (permissionName) => !groupPermissionNames.includes(permissionName),
                ),
        }));
    };

    const toSentenceCase = (value) => {
        const normalizedValue = String(value)
            .replace(/[._-]+/g, ' ')
            .trim()
            .toLowerCase();

        return normalizedValue
            ? `${normalizedValue.charAt(0).toUpperCase()}${normalizedValue.slice(1)}`
            : '';
    };

    const formatChildPermission = (permissionName) => {
        const childPermission = String(permissionName).split('.').slice(1).join('.');
        return toSentenceCase(childPermission || permissionName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await api.put(`roles/${id}`, role)
            showSuccess(result.data.message);
            navigate(`/admin/role`)
        } catch (error) {
            showError(error.response?.data?.message || 'Unable to update the role.');
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="about-view-card">
                <div className="row g-4 align-items-start">

                    <div className="row g-3">
                        <div className='col-lg-12'>

                            <div className="glass-card create-admin-card">
                                <div className="count-badge-row d-flex justify-content-between">
                                    <button type="button" className="theme-toggle-btn" title="Edit role">
                                        <i className="bi bi-pencil-square" /> Edit Role & Permission
                                    </button>
                                    <Link to="/admin/role" className="btn-primary text-decoration-none">
                                        <i className="bi bi-house-door" /> Back To Role
                                    </Link>

                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="roleName">Role Name</label>
                                        <input type="text" name="name" value={role.name} onChange={(e) => setRole((currentRole) => ({ ...currentRole, name: e.target.value }))} className="form-control" id="roleName" placeholder="e.g. Alex Rivera" required />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Permissions</label>

                                        {loading ? (
                                            <div className="text-center py-5"><ClipLoader size={16} /> Loading permissions...</div>
                                        ) : (
                                            <>
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="select-all-permissions"
                                                        checked={allPermissionsSelected}
                                                        onChange={(event) => handleAllPermissionsChange(event.target.checked)}
                                                    />
                                                    <label className="form-check-label fw-semibold" htmlFor="select-all-permissions">
                                                        Select all permissions
                                                    </label>
                                                </div>

                                                <Accordion alwaysOpen>
                                                    <div className="row">
                                                        {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                                                            const groupPermissions = Array.isArray(permissions) ? permissions : [];
                                                            const groupPermissionsSelected = groupPermissions.length > 0
                                                                && groupPermissions.every((permission) => role.permissions.includes(permission.name));

                                                            return (
                                                                <div className="col-lg-6 mb-3" key={groupName}>
                                                                    <Accordion.Item eventKey={groupName}>
                                                                        <div className="d-flex align-items-center">
                                                                            <Accordion.Button eventKey={groupName} className="flex-grow-1">
                                                                                <label class="form-label" for="roleName">{toSentenceCase(groupName)} </label>
                                                                            </Accordion.Button>
                                                                            <div className="form-check ms-3 me-2 text-nowrap">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    id={`select-group-${groupName}`}
                                                                                    checked={groupPermissionsSelected}
                                                                                    onChange={(event) => handleGroupPermissionsChange(groupPermissions, event.target.checked)}
                                                                                />

                                                                                <label class="form-label" for="roleName" htmlFor={`select-group-${groupName}`}> Select all </label>

                                                                            </div>
                                                                        </div>
                                                                        <Accordion.Collapse eventKey={groupName}>
                                                                            <Accordion.Body>
                                                                                <div className="row">
                                                                                    {groupPermissions.map((permission) => (
                                                                                        <div className="col-md-6 mb-2" key={permission.id}>
                                                                                            <div className="form-check">
                                                                                                <input
                                                                                                    className="form-check-input"
                                                                                                    type="checkbox"
                                                                                                    id={`permission-${permission.id}`}
                                                                                                    checked={role.permissions.includes(permission.name)}
                                                                                                    onChange={(e) => handleCheckboxChange(permission.name, e.target.checked)}
                                                                                                />
                                                                                                <label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                                                                                                    <span className="status-pill active px-1">{formatChildPermission(permission.name)}</span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </Accordion.Body>
                                                                        </Accordion.Collapse>
                                                                    </Accordion.Item>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Accordion>
                                            </>
                                        )}
                                    </div>


                                    <div className='d-flex justify-content-center align-items-center text-center mt-2'>

                                        <button type="submit" className="btn-primary" disabled={loading}>
                                            <i className="bi bi-check-circle" /> Update Role & Permissions
                                        </button>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </div>
    )
}

export default EditRole
