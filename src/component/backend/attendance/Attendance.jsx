import React, { useEffect, useState } from 'react'
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import api, { BASE_URL } from '../../../api/api';
import "/src/assets/backend/attendance.css";

import noimage from '../../../../public/no_image2.jpg'
import "/node_modules/@munatech/nepali-datepicker/dist/lib/nepali-datepicker.css";

import { Picker, getTodayBs } from '@munatech/nepali-datepicker';

const Attendance = () => {

    const { can } = useAuth();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [date, setDate] = useState(getTodayBs());




    const handleAttendanceChange = (staffId, field, value) => {
        setAttendances((prev) => prev.map((item) => item.staff_id === staffId ? { ...item, [field]: value } : item));
    };


    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const formattedDate = date
                ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
                : null;


            const result = await api.get("/attendance/search-by-date", {
                params: {
                    date: formattedDate,
                },
            });

            setStaffs(result.data.staffs);


            const attendanceData = result.data.staffs.map((staff) => {

                const attendance = staff.attendances[0] || {};

                return {
                    staff_id: staff.id,
                    date: attendance.date || new Date().toISOString().split("T")[0],
                    check_in: attendance.check_in
                        ? attendance.check_in.substring(0, 5)
                        : "",
                    check_out: attendance.check_out
                        ? attendance.check_out.substring(0, 5)
                        : "",
                    remarks: attendance.remarks || "",
                    late_minutes: attendance.late_minutes || 0,
                    early_leave_minutes: attendance.early_leave_minutes || 0,
                    working_minutes: attendance.working_minutes || 0,
                    overtime_minutes: attendance.overtime_minutes || 0,
                    status: attendance.status || 0,
                };
            });

            setAttendances(attendanceData);

        } catch (error) {
            showError(error.response.data.message);
        }
        finally {
            setLoading(false);
        }

    }

    const days = Array.from({ length: 32 }, (_, i) => i + 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await api.post("/attendances", { attendances, });
            showSuccess(result.data.message);
            fetchDatas(); // Refresh the data after submission
        } catch (error) {
            showError(error.response.data.message);
        }
    };

    const handleSubmitByDate = async (e) => {
        e.preventDefault();

        fetchDatas();
    };




    useEffect(() => {
        const buttons = document.querySelectorAll(".view-switch button");

        const handleClick = (btn) => {
            document
                .querySelectorAll(".view-switch button")
                .forEach((b) => b.classList.remove("active"));

            btn.classList.add("active");

            document
                .querySelectorAll(".view")
                .forEach((v) => v.classList.remove("active"));

            document
                .getElementById(`view-${btn.dataset.view}`)
                ?.classList.add("active");
        };

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => handleClick(btn));
        });

        return () => {
            buttons.forEach((btn) => {
                btn.replaceWith(btn.cloneNode(true)); // Removes attached listeners
            });
        };
    }, []);


    return (
        <div>
            <div>


                {/* Main */}
                <div className="page-wrap py-0 py-md-2">
                    {/* View switch */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div className="view-switch">
                            <button className="active" data-view="daily"><i className="bi bi-calendar-check" /> Daily Register</button>
                            <button data-view="monthly"><i className="bi bi-grid-3x3-gap" /> Monthly Report</button>
                        </div>
                        {/* <div className="text-muted small font-mono d-none d-md-block">Nepali calendar · Bikram Sambat</div> */}
                    </div>
                    {/* ============ DAILY VIEW ============ */}
                    <div className="view active" id="view-daily">
                        <div className="panel mb-4">
                            <div className="panel-head">

                                <form className="d-flex align-items-end gap-2 flex-wrap" onSubmit={handleSubmitByDate}>
                                    <div>
                                        <label className="field-label">Date (B.S.)</label>
                                        {/* <input type="date" className="control" style={{ width: 220 }} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /> */}

                                        <Picker
                                            value={date}
                                            onChange={(value) => setDate(value)}
                                            placeholder="Pick a Nepali Date"
                                        />
                                    </div>
                                    <button className="theme-toggle-btn"><i className="bi bi-search" /> Search</button>
                                </form>

                                <div>
                                    {/* <div className="eyebrow">Look up a day</div>
                                    <h2 className="panel-title">Daily check‑in register</h2> */}
                                    <div className="d-flex gap-2">


                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-3 p-md-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-calendar3 text-muted" />
                                            <span className="font-mono small text-muted">Showing records for <strong style={{ color: 'var(--teal-900)' }}>2083‑04‑16</strong></span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link className="btn-ghost"><i className="bi bi-printer" /> Print</Link>
                                            <button type='submit' className="theme-toggle-btn"><i className="bi bi-save" /> Save</button>

                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="attn-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 56 }}>S.No</th>
                                                    <th>Staff</th>
                                                    <th>Role</th>
                                                    <th>Check In</th>
                                                    <th>Check Out</th>
                                                    <th>Status</th>
                                                    <th>Note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    staffs.map((staff, index) => (
                                                        <tr key={staff.id}>
                                                            <td className="font-mono text-muted">01</td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div className="staff-avatar" style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                                                                        <img src={staff.image ? `${BASE_URL}/uploads/staff/${staff.image}` : noimage} alt={staff.name} width={40} />
                                                                    </div>
                                                                    <div>
                                                                        {/* <div className="">
                                                                            {staff.name} ({staff.id})</div>
                                                                        <div className="text-muted small font-mono">ID · STF‑014</div>  */}
                                                                        <div><div class="admin-name">{staff.name} </div>
                                                                            <div class="admin-email"> {staff.email || "Email not available"} </div>
                                                                            {/* <div class="admin-email"> {staff.phone || "Phone N/A"} </div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className="admin-email"> {staff.designation?.name}  </span></td>
                                                            <td>
                                                                <div className="time-input-wrap">
                                                                    <input type="time" name="check_in" className="control" value={attendances.find(a => a.staff_id === staff.id)?.check_in || ""}
                                                                        onChange={(e) =>
                                                                            handleAttendanceChange(staff.id, "check_in", e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="time-input-wrap">

                                                                    <input type="time" name="check_out" className="control" value={attendances.find(a => a.staff_id === staff.id)?.check_out || ""}
                                                                        onChange={(e) => handleAttendanceChange(staff.id, "check_out", e.target.value)} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div> <select class="control" name='status' value={attendances.find(a => a.staff_id === staff.id)?.status || "Present"} onChange={(e) => handleAttendanceChange(staff.id, "status", e.target.value)}>

                                                                    <option value="absent">Absent</option>
                                                                    <option value="present">Present</option>
                                                                    <option value="leave">Leave</option>
                                                                    <option value="holiday">Holiday</option>
                                                                    <option value="halfday">Half Day</option>
                                                                    <option value="weekend">Weekend</option>
                                                                </select></div>
                                                            </td>
                                                            <td>
                                                                <input type="text" name="remarks" className="control" value={attendances.find(a => a.staff_id === staff.id)?.remarks || ""}
                                                                    onChange={(e) => handleAttendanceChange(staff.id, "remarks", e.target.value)} />
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                    {/* ============ MONTHLY VIEW ============ */}
                    <div className="view" id="view-monthly">
                        <div className="panel">
                            <div className="panel-head">
                                <div>
                                    <div className="eyebrow">Term overview</div>
                                    <h2 className="panel-title">Biometric attendance report</h2>
                                </div>
                                {/* <form className="d-flex align-items-end gap-2 flex-wrap" onsubmit="return false;"> */}
                                <div>
                                    <label className="field-label">Month</label>
                                    <select className="control month-select">
                                        <option>SHRAWAN</option>
                                        <option>BHADRA</option>
                                        <option>ASHOJ</option>
                                    </select>
                                </div>
                                <button className="btn-search"><i className="bi bi-search" /> Search</button>
                                {/* </form> */}
                            </div>
                            <div className="p-3 p-md-4">
                                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                                    <div>
                                        <div className="font-display fw-semibold" style={{ color: 'var(--teal-900)', fontSize: '1.05rem' }}>
                                            Shrawan, 2083</div>
                                        <div className="legend mt-2">
                                            <span><span className="dot" style={{ background: 'var(--sage-soft)', boxShadow: 'inset 0 0 0 1.5px var(--sage)' }} />Present</span>
                                            <span><span className="dot" style={{ background: 'var(--coral-soft)', boxShadow: 'inset 0 0 0 1.5px var(--coral)' }} />Absent</span>
                                            <span><span className="dot" style={{ background: '#fff', boxShadow: 'inset 0 0 0 1.5px var(--gold)' }} />Today</span>
                                        </div>
                                    </div>
                                    <button className="btn-gold"><i className="bi bi-cloud-arrow-down" /> Export</button>
                                </div>
                                <div className="heat-scroll">
                                    <table className="heat-table">
                                        <thead>
                                            <tr>
                                                <th className="name-col">Staff</th>
                                                {/* days 1-28 */}

                                                {Array.from({ length: 32 }, (_, index) => (
                                                    <th key={index} className="day-col">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {staffs.map((staff) => (
                                                <tr key={staff.id}>

                                                    <td className="name-col">
                                                        <div className="staff-row-name">{staff.name}</div>
                                                        <div className="staff-row-meta">
                                                            {staff.designation?.name}
                                                        </div>
                                                    </td>

                                                    {days.map(day => {

                                                        const attendance = staff.attendances.find(a => {
                                                            return new Date(a.date).getDate() === day;
                                                        });

                                                        return (
                                                            <td className="cell" key={day}>

                                                                {attendance ? (
                                                                    <div
                                                                        className="punch present"
                                                                        data-tip={`${attendance.check_in} - ${attendance.check_out} = ${attendance.working_minutes} min`}
                                                                    >
                                                                        ✓
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="punch absent"
                                                                        data-tip="Absent"
                                                                    >
                                                                        ✕
                                                                    </div>
                                                                )}

                                                            </td>
                                                        );

                                                    })}

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                                    <span className="summary-pill"><i className="bi bi-check-circle me-1" />21 Present</span>
                                    <span className="summary-pill" style={{ background: 'var(--coral-soft)', color: '#a8492e' }}><i className="bi bi-x-circle me-1" />4 Absent</span>
                                    <span className="summary-pill" style={{ background: 'var(--gold-soft)', color: '#8a5a17' }}><i className="bi bi-clock-history me-1" />168h 32m logged</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Attendance