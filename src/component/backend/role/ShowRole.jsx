import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import moment from "moment";

import api from "../../../api/api";
import { showError } from "../../../utils/notify";
import { ClipLoader } from "react-spinners";

const ShowRole = () => {
    const { id } = useParams();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRole();
    }, [id]);

    const fetchRole = async () => {
        setLoading(true);
        try {
            const result = await api.get(`roles/${id}`);
            setRole(result.data.role);
        } catch (error) {
            showError(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    const formatPermission = (name) => {
        return name
            .replace(/\./g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    };


    <tr style={{ height: "100px" }}>
        <td
            colSpan={5}
            className="text-center align-middle"
        >
            <ClipLoader color="green" size={22} /> Loading...
        </td>
    </tr>

    let html_permissions = '';
    if (loading) {
        html_permissions = <div className="permissions_fetche">
            <div className="row align-items-start">
                <div>
                </div>  <h5 className="text-center py-0"><ClipLoader color='color' size={16} /> Loading...</h5>
            </div>
        </div>
    }
    else {
        html_permissions = (role?.permissions?.length > 0 ? (
            role.permissions.map((permission) => (
                <span
                    key={permission.id}
                    className="status-pill active m-1"
                >
                    {formatPermission(permission.name)}
                </span>
            ))
        ) : (
            <p className="text-danger mb-0">
                No permissions assigned.
            </p>
        ))
    }


    return (
        <div className="about-view-card">
            <div className='col-lg-12'>

                <div className="glass-card create-admin-card">
                    <div className="count-badge-row d-flex justify-content-between">
                        <button class="theme-toggle-btn" title="Cycle theme"><i class="bi bi-eye"></i> View Role </button>
                        <Link to={`/admin/role`} type='submit' className="btn-primary text-decoration-none">
                            <i class="bi bi-house-door"></i> Back To Role
                        </Link>

                    </div>

                    <div className="col-md-12">
                        <div className="info-card mb-3">
                            <span className="info-label">Role Name</span>
                            <h6>{role?.name}</h6>
                        </div>

                        <div className="info-card mb-3">
                            <span className="info-label d-block mb-2">
                                Permissions
                            </span>

                            <div id="permissions_fetche">
                                {
                                    html_permissions
                                }
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="info-card">
                                    <span className="info-label">
                                        Created Date
                                    </span>
                                    <h6>
                                        {role?.created_at
                                            ? moment(role.created_at).format("LLL")
                                            : "-"}
                                    </h6>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="info-card">
                                    <span className="info-label">
                                        Updated Date
                                    </span>
                                    <h6>
                                        {role?.updated_at
                                            ? moment(role.updated_at).format("LLL")
                                            : "-"}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-md-5 text-center">
                    <img
                        src="/roles.jpg"
                        alt="Role"
                        className="view-image"
                    />
                </div> */}
                </div>


            </div>
        </div>
    );
};

export default ShowRole;