import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { showError, showSuccess } from "../../../utils/notify";
import confirmDelete from "../../../utils/confirmDelete";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/api";
import { Link } from "react-router"
import Select from "react-select";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { getTodayBs, Picker } from "@munatech/nepali-datepicker";

const LeaveApplication = () => {
  useEffect(() => {
    document.title = "Leave Type";
  }, []);
  const { can } = useAuth();

  const [dateFrom, setDateFrom] = useState(getTodayBs());
  const [dateTo, setDateTo] = useState(getTodayBs());

  const [loading, setLoading] = useState(false);
  const [leaveApplication, setLeaveApplication] = useState({
    user_id: "",
    role_id: "",
    leave_type_id: "",
    date_from: "",
    date_to: "",
  });
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveType, setLeaveType] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [options, setOptions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [optionRole, setOptionRole] = useState([]);

  const handleInput = (e) => {
    setLeaveApplication({ ...leaveApplication, [e.target.name]: e.target.value });
  };


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
        name: "",
        days_per_year: "",

      });
    } catch (error) {
      showError(error.response.data.message);
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
              <button class="theme-toggle-btn" title="Cycle theme">
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



              <FloatingLabel
                controlId="floatingSelectGrid"
                label="Leave Type"
              >
                <Form.Select name="leave_type_id" onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                  <option>Please Select Leave Type</option>
                  {
                    leaveType.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>{item.name}</option>
                      )
                    })
                  }
                </Form.Select>
              </FloatingLabel>


              <FloatingLabel
                controlId="floatingSelectGrid"
                label="Day Type"
              >
                <Form.Select name="day_type" onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                  <option>Please Select Day Type</option>
                  <option value="full_day">Full Day</option>
                  <option value="half_day">Half Day</option>
                </Form.Select>
              </FloatingLabel>


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
                  Leave Types Accounts
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                  Manage existing administrator accounts
                </div>
              </div>

            </div>
            <div style={{ overflowX: "auto" }}>

              <table class="admin-table" id="adminTable">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Staff Name</th>
                    <th>Role</th>
                    <th>Leave Name</th>
                    <th>Days / Year</th>
                    <th> Approval</th>
                    <th> Status</th>
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
                            {leave.user?.name}
                          </td>
                          <td>
                            <span className="status-pill active">{leave.role?.name}</span>
                          </td>
                          <td>
                            <small>{leave.leave_type?.name}</small>
                          </td>
                          <td>
                            {
                              leave.total_days !== 0 ? <span className="status-pill active px-2"> {leave.total_days} Days</span> :
                                <span className="status-pill active px-2"> Unlimited / As needed</span>
                            }
                          </td>
                          <td>
                            {
                              leave.is_approved === 0 ? <span className="status-pill px-2">Pending</span> :
                                leave.is_approved === 1 ? <span className="status-pill active px-2">Approved</span> :
                                  leave.is_approved === 2 ? <span className="status-pill active px-2">Rejected</span> : <span className="status-pill px-2">Pending</span>
                            }
                          </td>


                          <td>
                            {

                              <span className="theme-toggle-btn" title="Approved/Rejected"><i class="bi bi-check2-circle fs-6"></i> </span>
                            }
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
    </div>
  );
};

export default LeaveApplication;
