import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { showError } from './../../../utils/notify';
import api, { BASE_URL } from './../../../api/api';

const AttendanceLog = () => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = async () => {
        setLoading(true);

        try {
            const result = await api.get(`/attendance-logs`);
            setLogs(result.data.logs);
        } catch (error) {
            showError(error.response.data.message || "Something went wrong")
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className="view active" id="view-daily">
                <div className="panel mb-4">
                    <form>
                        <div className="p-3 p-md-4">
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-calendar3 text-muted" />
                                    <span className="font-mono small text-muted">
                                        Attendance Logs

                                    </span>
                                </div>

                                <div className="d-flex gap-2">
                                    <Link className="btn-ghost"><i className="bi bi-printer" /> Print</Link>
                                    {/* <button type='submit' className="theme-toggle-btn"><i className="bi bi-save" /> Save</button> */}
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="attn-table">
                                    <thead>

                                        <tr>
                                            <th style={{ width: 56 }}>S.No</th>
                                            <th>Staff</th>
                                            {/* <th>Role</th> */}
                                            <th>Date</th>
                                            <th>Punch time</th>
                                            <th>Punch Type</th>
                                            <th>Verification Type</th>
                                            <th>Raw Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            logs.map((log,index) => {
                                                return (
                                                    <tr key={log.id} >
                                                        <td className="font-mono text-muted">{index +1}</td>
                                                        <td>
                                                            <div className="admin-name-cell">
                                                                <div
                                                                    className="avatar-initials"
                                                                    style={{ background: "#141414aa" }}
                                                                >
                                                                    {log.staff.image ? (
                                                                        <img
                                                                            src={`${BASE_URL}/uploads/staff/${log.staff?.image}`}
                                                                            alt="Profile"
                                                                            className="navbar-avatar"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={noimage}
                                                                            alt="Profile"
                                                                            className="navbar-avatar"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <div className="admin-name">
                                                                        {log.staff?.name}
                                                                    </div>

                                                                    <div className="admin-email">
                                                                        {log.staff?.email}
                                                                    </div>

                                                                    {/* <div className="admin-email">
                                                                        {log.staff?.phone}
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* <td></td> */}
                                                        <td style={{ fontSize: "12px", color: " rgb(148, 163, 184)" }}>{log.date} </td>
                                                        <td style={{ fontSize: "12px", color: " rgb(148, 163, 184)" }}>{log.punch_time} </td>
                                                        <td style={{ fontSize: "12px", color: " rgb(148, 163, 184)" }}>{log.punch_type} </td>
                                                        <td style={{ fontSize: "12px", color: " rgb(148, 163, 184)" }}>{log.verification_type} </td>

                                                        <td style={{ fontSize: "12px", color: " rgb(148, 163, 184)" }}>{log.raw_data} </td>
                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AttendanceLog