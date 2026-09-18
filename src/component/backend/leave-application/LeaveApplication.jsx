import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { showError, showSuccess } from "../../../utils/notify";
import confirmDelete from "../../../utils/confirmDelete";
import { useAuth } from "../../../context/AuthContext";
import api, { BASE_URL } from "../../../api/api";
import { Link, useParams } from "react-router"
import Select from "react-select";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { getTodayBs, Picker } from "@munatech/nepali-datepicker";

const LeaveApplication = () => {
    useEffect(() => {
        document.title = "Leave Type";
    }, []);
    const { can } = useAuth();
    const { id } = useParams();

    const [viewLeaveApproval, setviewLeaveApproval] = useState({});

    const [dateFrom, setDateFrom] = useState(getTodayBs());
    const [dateTo, setDateTo] = useState(getTodayBs());

    const [loading, setLoading] = useState(false);
    const [leaveApplication, setLeaveApplication] = useState({
        user_id: "",
        role_id: "",
        leave_type_id: "",
        day_type: "",
        total_days: "",
        date_from: "",
        date_to: "",
    });
    const [leaveApplications, setLeaveApplications] = useState([]);
    const [leaveType, setLeaveType] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [options, setOptions] = useState([]);

    const [selectedRole, setSelectedRole] = useState(null);
    const [optionRole, setOptionRole] = useState([]);

    const [leaveaIsApproved, setLeaveIsApproved] = useState({
        is_approved: 0,
        approval_remarks: ""
    })

    const handleInput = (e) => {
        setLeaveApplication({ ...leaveApplication, [e.target.name]: e.target.value });
    };

    const handleApprove = (e) => {
        setLeaveIsApproved({ ...leaveaIsApproved, [e.target.name]: e.target.value });
    }


    useEffect(() => {
        fetchDatas();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.post(`/leave-applications`, leaveApplication);
            showSuccess(result.data.message);
            fetchDatas();
            setLeaveApplication({
                user_id: "",
                role_id: "",
                leave_type_id: "",
                day_type: "",
                reason: "",
                date_from: "",
                date_to: ""
            });
        } catch (error) {


            // Fallback for non-validation errors (500s, network errors, etc.)
            showError(error.response?.data?.message || "Something went wrong.");

        } finally {
            setLoading(false);
        }
    };

    const deleteLeave = async (id) => {
        const confirmed = await confirmDelete();
        if (!confirmed) return;
        setLoading(true);

        try {
            const result = await api.delete(`/leave-applications/${id}`);
            showSuccess(result.data.message);
            fetchDatas();
        } catch (error) {
            showError(error.response.data.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchDatas = async () => {
        try {
            const result = await api.get(`/leave-applications`);
            setLeaveApplications(result.data.leave_applications);
            setLeaveType(result.data.leave_type);

        } catch (error) {
            showError(error.response.data.message);
        }
    };


    const searchUsers = async (search) => {
        if (!search || search.trim() === "") {
            setOptions([]);
            return;
        }

        try {
            const response = await api.get("/users/search", {
                params: {
                    search: search.trim(),
                },
            });

            const users = response.data.users || [];

            const formattedOptions = users.map((user) => ({
                value: user.id,
                label: `${user.name} - ${user.email}`,
            }));

            setOptions(formattedOptions);
        } catch (error) {
            console.error("Search users error:", error);
            setOptions([]);
        }
    };

    const handleUserInputChange = (inputValue, { action }) => {
        if (action === "input-change") {
            searchUsers(inputValue);
        }
        return inputValue;
    };


    const searchRole = async (search = "") => {
        try {
            const response = await api.get("/roles");

            const roles = response.data.roles || [];

            const filteredRoles = roles.filter((role) =>
                role.name.toLowerCase().includes(search.toLowerCase())
            );

            const formattedOptionsRole = filteredRoles.map((role) => ({
                value: role.id,
                label: role.name,
            }));

            setOptionRole(formattedOptionsRole);
        } catch (error) {
            console.error("Search roles error:", error);
            setOptionRole([]);
        }
    };

    const handleRoleInputChange = (inputValue, { action }) => {
        if (action === "input-change") {
            searchRole(inputValue);
        }

        return inputValue;
    };




    return (
        <div>
            <div className="admin-mgmt">
                <div className="admin-mgmt-grid">
                    {/* Create Admin Form */}
                    <div className="glass-card create-admin-card">
                        <div className="count-badge-row d-flex justify-content-between">
                            <button className="theme-toggle-btn" title="Cycle theme">
                                <i
                                    className="bi bi-plus-circle"
                                    style={{ fontSize: "14px" }}
                                ></i>
                                Create New Leave Application
                            </button>
                            <div className="count-icon">
                                <i className="bi bi-shield-person-fill" /> {leaveApplications?.length || 0}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-floating mb-3">


                                {/* <Select
                  name="user_id"
                  options={options}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  onInputChange={handleUserInputChange}
                  isSearchable
                  placeholder="Search users..."
                  isClearable
                /> */}
                                <Select
                                    name="user_id"
                                    options={options}
                                    value={selectedUser}
                                    onChange={(selectedOption) => {
                                        setSelectedUser(selectedOption);

                                        setLeaveApplication((prev) => ({
                                            ...prev,
                                            user_id: selectedOption ? selectedOption.value : "",
                                        }));
                                    }}
                                    onInputChange={handleUserInputChange}
                                    isSearchable
                                    placeholder="Search users..."
                                    isClearable
                                />


                                {/* <Select
                  name="role_id"
                  options={optionRole}
                  onInputChange={handleRoleInputChange}
                  onMenuOpen={() => searchRole("")}
                  placeholder="Select Role"
                  className="mt-3"
                  isClearable
                /> */}

                                <Select
                                    name="role_id"
                                    options={optionRole}
                                    value={selectedRole}
                                    onChange={(selectedOption) => {
                                        setSelectedRole(selectedOption);

                                        setLeaveApplication((prev) => ({
                                            ...prev,
                                            role_id: selectedOption ? selectedOption.value : "",
                                        }));
                                    }}
                                    onInputChange={handleRoleInputChange}
                                    onMenuOpen={() => searchRole("")}
                                    placeholder="Select Role"
                                    className="mt-3"
                                    isClearable
                                />


                                {/* <label for="leaveName"> User Name</label> */}
                            </div>




                            <Form.Select name="leave_type_id" onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                                <option>Please Select Leave Type <span className="text-danger">*</span></option>
                                {
                                    leaveType.map((item) => {
                                        return (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </Form.Select>


                            {/* <FloatingLabel
                controlId="floatingSelectGrid"
              // label="Day Type"
              > */}
                            <Form.Select name="day_type" onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                                <option value="">Please Select Day Type <span className="text-danger">*</span></option>
                                <option value="full_day">Full Day</option>
                                <option value="half_day">Half Day</option>
                            </Form.Select>
                            {/* </FloatingLabel> */}


                            <div className="d-flex justify-content-evenly">
                                <label for="leaveName"> From <span className="text-danger">*</span></label>
                                <label for="leaveName"> To <span className="text-danger">*</span></label></div>

                            <div className="form-group d-flex gap-3 mb-3">

                                <Picker
                                    name="date_from"
                                    value={dateFrom}
                                    onChange={(value) => {
                                        setDateFrom(value);

                                        setLeaveApplication((prev) => ({
                                            ...prev,
                                            date_from: `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`,
                                        }));
                                    }}
                                    placeholder="Pick a Nepali Date"
                                    className="w-100"
                                />

                                <Picker
                                    name="date_to"
                                    value={dateTo}
                                    onChange={(value) => {
                                        setDateTo(value);

                                        setLeaveApplication((prev) => ({
                                            ...prev,
                                            date_to: `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`,
                                        }));
                                    }}
                                    placeholder="Pick a Nepali Date"
                                    className="w-100"
                                />
                            </div>

                            <div className="form-floating mb-0">
                                <textarea
                                    name="reason"
                                    value={leaveApplication?.reason}
                                    onChange={handleInput}
                                    className="form-control"
                                    id="route"
                                    placeholder="Reason"
                                />
                                <label for="route">Reason</label>
                            </div>


                            {can("leave-applications.store") && (
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ width: "100%", justifyContent: "center" }}
                                >
                                    {loading ? (
                                        <PulseLoader color="white" loading={true} size={12} />
                                    ) : (
                                        ""
                                    )}
                                    <i className="bi bi-person-plus-fill" /> Create Leave
                                </button>
                            )}
                        </form>
                    </div>
                    {/* Admin List */}
                    <div className="glass-card-solid admin-list-card">
                        <div className="admin-table-header">
                            <div>
                                <div className="section-title" style={{ fontSize: 15 }}>
                                    Leave Application
                                </div>
                                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                                    Manage existing administrator accounts
                                </div>
                            </div>

                        </div>
                        <div style={{ overflowX: "auto" }}>

                            <table className="admin-table" id="adminTable">
                                <thead>
                                    <tr>
                                        <th>S.no</th>
                                        <th>Name / Role</th>
                                        <th>Leave Name</th>
                                        <th>Leave Start/End</th>
                                        <th>Days</th>
                                        <th> Is Approved?</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="adminTableBody">
                                    {
                                        leaveApplications.map((leave, index) => {
                                            return (
                                                <tr key={leave.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {/* {leave.user?.name}<br />
                                                        <span className="status-pill active">{leave.role?.name}</span> */}
                                                        <div className="admin-name-cell">

                                                            <div
                                                                className="avatar-initials"
                                                                style={{ background: "#141414aa" }}
                                                            >
                                                                {
                                                                    leave.user?.image ? <img src={`${BASE_URL}/uploads/user/${leave.user?.image}`} alt="Profile" className="navbar-avatar" />
                                                                        : ""
                                                                }

                                                            </div>

                                                            <div>
                                                                <div className="admin-name">{leave.user?.name} </div>
                                                                <div className="admin-email"> {leave.role?.name} </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <small>{leave.leave_type?.name}</small>
                                                    </td>
                                                    <td>
                                                        <span className="status-pill active">{leave.date_from}</span>
                                                        <span className="status-pill mt-1">{leave.date_to}</span>
                                                    </td>
                                                    <td>
                                                        {
                                                            leave.total_days !== 0 ? <span className="status-pill active px-2"> {leave.total_days}</span> :
                                                                <span className="status-pill active px-2"> Unlimited / As needed</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            {
                                                                leave.is_approved === 0 ? <span className="status-pill px-2">Pending</span> :
                                                                    leave.is_approved === 1 ? <span className="status-pill active px-2">Approved</span> :
                                                                        leave.is_approved === 2 ? <span className="status-pill px-2">Rejected</span> : <span className="status-pill px-2">Pending</span>
                                                            }

                                                            

                                                                {
                                                                    can("leave_is_approved") && (
                                                                    <Link to={`/admin/is-leave-approved/${leave.id}`} className="theme-toggle-btn" title="Approved/Rejected"><i className="bi bi-check2-circle fs-6"></i> </Link>
                                                                ) 
                                                            }
                                                        </div>

                                                    </td>


                                                    <td>
                                                        <div className="table-actions">



                                                            {
                                                                can("leave-applications.show") && (
                                                                    <Link to={`/admin/leave-application/${leave.id}`} className="btn-info-sm" title="Edit" >
                                                                        <i className="bi bi-eye"></i>
                                                                    </Link>
                                                                )
                                                            }

                                                            {
                                                                can("leave-applications.update") && (
                                                                    <Link to={`/admin/leave-application/edit/${leave.id}`} className="btn-edit-sm" title="Edit" >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("leave-applications.destroy") && (
                                                                    <button className="btn-danger-sm" onClick={() => deleteLeave(leave.id)} title="Delete"><i className="bi bi-trash3" /></button>
                                                                )
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>


                            </table>
                        </div>
                        <div
                            id="emptyState"
                            style={{
                                display: "none",
                                textAlign: "center",
                                padding: 36,
                                color: "#94A3B8",
                            }}
                        >
                            <i
                                className="bi bi-person-x"
                                style={{ fontSize: 36, marginBottom: 10, display: "block" }}
                            />
                            No admins found.
                        </div>
                    </div>
                </div>
            </div>



            {/* <!-- Modal --> */}
            {/* <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Approval Request From</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleIsApprovedSubmit}>
                            <div className="modal-body">
                                <div class="alert alert-info mb-3">
                                    <small>Please review the leave application before approving or rejecting.</small>
                                </div>
                                <table className="table table-sm table-bordered mb-0">
                                    <tbody>
                                        <tr>
                                            <th width="35%"><label class="form-label"> Name</label></th>
                                            <td id="modal_user">{viewLeaveApproval.user?.name}</td>
                                        </tr>
                                        <tr>
                                            <th><label class="form-label"> Leave Type </label></th>
                                            <td id="modal_leave_type">{viewLeaveApproval.leave_type?.name}</td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Leave Start / End  </label></th>
                                            <td>
                                                <span>{viewLeaveApproval.date_from} </span>
                                                to
                                                <span> {viewLeaveApproval.date_to}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th><label class="form-label"> Total Requested Days</label></th>
                                            <td>
                                                <span>{viewLeaveApproval.total_days}</span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Approval Remarks</label></th> 
                                            <td>
                                                <textarea name="approval_remarks" value={leaveaIsApproved.approval_remarks} onChange={handleApprove} className="form-control" />
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Approve / Reject</label></th>
                                            <td>
                                                <div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" value={0} type="radio" name="is_approved" id="inlineRadio0" />
                                                        <label className="form-check-label" htmlFor="inlineRadio0">Pending</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" value={1} type="radio" name="is_approved" id="inlineRadio1" />
                                                        <label className="form-check-label" htmlFor="inlineRadio1">Approve</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" value={2} type="radio" name="is_approved" id="inlineRadio2" />
                                                        <label className="form-check-label" htmlFor="inlineRadio2">Reject</label>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-lg"></i> Cancel</button>
                                <button type="submit" className="btn-danger"><i class="bi bi-x-circle"></i> <label htmlFor="inlineRadio2"> Rejected</label></button>
                                <button type="submit" className="btn-success"><i className="bi bi-check2-circle fs-6"></i> <label htmlFor="inlineRadio1"> Approved </label></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default LeaveApplication;
