import React, { useEffect, useState } from 'react'
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import api, { BASE_URL } from '../../../api/api';
import "/src/assets/backend/attendance.css";

import noimage from '../../../../public/no_image2.jpg'
import "/node_modules/@munatech/nepali-datepicker/dist/lib/nepali-datepicker.css";

import { Picker, getTodayBs } from '@munatech/nepali-datepicker';
import { ClipLoader } from 'react-spinners';

const MONTHS = [
    { value: 1, label: "Baisakh" },
    { value: 2, label: "Jestha" },
    { value: 3, label: "Ashad" },
    { value: 4, label: "Shrawan" },
    { value: 5, label: "Bhadra" },
    { value: 6, label: "Ashoj" },
    { value: 7, label: "Kartik" },
    { value: 8, label: "Mangsir" },
    { value: 9, label: "Poush" },
    { value: 10, label: "Magh" },
    { value: 11, label: "Falgun" },
    { value: 12, label: "Chaitra" },
];

const Attendance = () => {

    const { can } = useAuth();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [monthlyLoading, setMonthlyLoading] = useState(false);

    const [staffs, setStaffs] = useState([]);
    const [attendances, setAttendances] = useState([]);

    // ---- Daily view state ----
    const [date, setDate] = useState(getTodayBs());

    // ---- Monthly view state ----
    const [monthlyStaffs, setMonthlyStaffs] = useState([]);
    const [month, setMonth] = useState(getTodayBs().month);
    const [year, setYear] = useState(getTodayBs().year);

    const handleAttendanceChange = (staffId, field, value) => {
        setAttendances((prev) => prev.map((item) => item.staff_id === staffId ? { ...item, [field]: value } : item));
    };

    useEffect(() => {
        fetchDailyData(date);
    }, []);

    // ===================== DAILY SEARCH =====================
    const fetchDailyData = async (dateObj) => {
        // setLoading(true);
        try {
            const formattedDate = dateObj
                ? `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`
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
                    date: attendance.date || formattedDate,
                    check_in: attendance.check_in ? attendance.check_in.substring(0, 5) : "",
                    check_out: attendance.check_out ? attendance.check_out.substring(0, 5) : "",
                    remarks: attendance.remarks || "",
                    late_minutes: attendance.late_minutes || 0,
                    early_leave_minutes: attendance.early_leave_minutes || 0,
                    working_minutes: attendance.working_minutes || 0,
                    overtime_minutes: attendance.overtime_minutes || 0,
                    status: attendance.status || "present",
                };
            });

            setAttendances(attendanceData);
        } catch (error) {
            showError(error?.response?.data?.message || "Failed to load attendance");
        } finally {
            // setLoading(false);
        }
    };

    const handleSubmitByDate = async (e) => {
        e.preventDefault();
        fetchDailyData(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await api.post("/attendances", { attendances });
            showSuccess(result.data.message);
            fetchDailyData(date); // Refresh after submission
        } catch (error) {
            showError(error?.response?.data?.message || "Failed to save attendance");
        }
    };

    // ===================== MONTHLY SEARCH =====================
    const fetchMonthlyData = async (m, y) => {
        setMonthlyLoading(true);
        try {
            const result = await api.get("/attendance/search-by-date", {
                params: {
                    month: m,
                    year: y,
                },
            });

            setMonthlyStaffs(result.data.staffs);
        } catch (error) {
            showError(error?.response?.data?.message || "Failed to load monthly report");
        } finally {
            setMonthlyLoading(false);
        }
    };

    const handleMonthlySubmit = (e) => {
        e.preventDefault();
        fetchMonthlyData(month, year);
    };

    // Nepali BS date strings look like "2083-04-16" — pull the day out
    // directly instead of using `new Date(...)`, which will misparse a
    // BS string as if it were Gregorian.
    const getBsDay = (bsDateString) => {
        if (!bsDateString) return null;
        const parts = bsDateString.split("-");
        return parts.length === 3 ? parseInt(parts[2], 10) : null;
    };

    const days = Array.from({ length: 32 }, (_, i) => i + 1);

    // ===================== VIEW SWITCH =====================
    useEffect(() => {
        const buttons = document.querySelectorAll(".view-switch button");

        const handleClick = (btn) => {
            document.querySelectorAll(".view-switch button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
            document.getElementById(`view-${btn.dataset.view}`)?.classList.add("active");

            // Lazy-load the monthly report the first time that tab is opened
            if (btn.dataset.view === "monthly" && monthlyStaffs.length === 0) {
                fetchMonthlyData(month, year);
            }
        };

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => handleClick(btn));
        });

        return () => {
            buttons.forEach((btn) => {
                btn.replaceWith(btn.cloneNode(true)); // Removes attached listeners
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlyStaffs, month, year]);

    return (
        <div>
            {/* Main */}
            <div className="page-wrap py-0 py-md-2">
                {/* View switch */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-0 mb-4">
                    <div className="view-switch">
                        <button className="active" data-view="daily"><i className="bi bi-calendar-check" /> Daily Register</button>
                        <button data-view="monthly"><i className="bi bi-grid-3x3-gap" /> Monthly Report</button>
                    </div>

                    <form className="d-flex align-items-end gap-2 flex-wrap" onSubmit={handleSubmitByDate}>
                        <div>
                            <label className="field-label">Date (B.S.)</label>
                            <Picker
                                value={date}
                                onChange={(value) => setDate(value)}
                                placeholder="Pick a Nepali Date"
                            />
                        </div>
                        <button type="submit" className="theme-toggle-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <ClipLoader color="white" size={20} />
                                    <span className="ms-2">Searching...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search" /> Search
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* ============ DAILY VIEW ============ */}
                <div className="view active" id="view-daily">
                    <div className="panel mb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="p-3 p-md-4">
                                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar3 text-muted" />
                                        <span className="font-mono small text-muted">
                                            Showing records for{" "}
                                            <strong style={{ color: 'var(--teal-900)' }}>
                                                {date ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}` : "-"}
                                            </strong>
                                        </span>
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
                                                {/* <th>Role</th> */}
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Status</th>
                                                <th>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-4">Loading...</td></tr>
                                            ) : staffs.length === 0 ? (
                                                <tr><td colSpan={7} className="text-center text-muted py-4">No staff found for this date.</td></tr>
                                            ) : (
                                                staffs.map((staff, index) => (
                                                    <tr key={staff.id}>
                                                        <td className="font-mono text-muted">{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="staff-avatar" style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                                                                    <img src={staff.image ? `${BASE_URL}/uploads/staff/${staff.image}` : noimage} alt={staff.name} width={40} />
                                                                </div>
                                                                <div>
                                                                    <div className="admin-name">{staff.name}</div>
                                                                    <div className="admin-email">{staff.email || "Email not available"}</div>
                                                                    <div className="staff-row-meta">{staff.designation?.name} </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* <td></td> */}
                                                        <td>
                                                            <div className="time-input-wrap">
                                                                {/* <input
                                                                    type="time"
                                                                    name="check_in"
                                                                    className="control ${staff.attendances.check_in != null) ? 'punch present' : ''}"
                                                                    value={attendances.find(a => a.staff_id === staff.id)?.check_in || ""}
                                                                    onChange={(e) => handleAttendanceChange(staff.id, "check_in", e.target.value)}
                                                                /> */}
                                                                <input
                                                                    type="time"
                                                                    name="check_in"
                                                                    className={`control ${attendances.find(a => a.staff_id === staff.id)?.check_in
                                                                        ? "punch present"
                                                                        : "punch absent"
                                                                        }`}
                                                                    value={attendances.find(a => a.staff_id === staff.id)?.check_in || ""}
                                                                    onChange={(e) =>
                                                                        handleAttendanceChange(staff.id, "check_in", e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="time-input-wrap">
                                                                <input
                                                                    type="time"
                                                                    name="check_out"
                                                                    className={`control ${attendances.find(a => a.staff_id === staff.id)?.check_out
                                                                        ? "punch present"
                                                                        : "punch absent"
                                                                        }`}
                                                                    value={attendances.find(a => a.staff_id === staff.id)?.check_out || ""}
                                                                    onChange={(e) => handleAttendanceChange(staff.id, "check_out", e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="control"
                                                                name='status'
                                                                value={attendances.find(a => a.staff_id === staff.id)?.status || "present"}
                                                                onChange={(e) => handleAttendanceChange(staff.id, "status", e.target.value)}
                                                            >
                                                                <option value="absent">Absent</option>
                                                                <option value="present">Present</option>
                                                                <option value="leave">Leave</option>
                                                                <option value="holiday">Holiday</option>
                                                                <option value="halfday">Half Day</option>
                                                                <option value="weekend">Weekend</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="remarks"
                                                                className="control"
                                                                value={attendances.find(a => a.staff_id === staff.id)?.remarks || ""}
                                                                onChange={(e) => handleAttendanceChange(staff.id, "remarks", e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
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

                            <form className="d-flex align-items-end gap-2 flex-wrap" onSubmit={handleMonthlySubmit}>
                                <div>
                                    <label className="field-label">Month</label>
                                    <select
                                        className="control month-select"
                                        value={month}
                                        onChange={(e) => setMonth(Number(e.target.value))}
                                    >
                                        {MONTHS.map((m) => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="field-label">Year</label>
                                    <input
                                        type="number"
                                        className="control"
                                        style={{ width: 100 }}
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                    />
                                </div>
                                <button type="submit" className="btn-search" disabled={monthlyLoading}>
                                    <i className="bi bi-search" /> {monthlyLoading ? "Searching..." : "Search"}
                                </button>
                            </form>
                        </div>

                        <div className="p-3 p-md-4">
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                                <div>
                                    <div className="font-display fw-semibold" style={{ color: 'var(--teal-900)', fontSize: '1.05rem' }}>
                                        {MONTHS.find(m => m.value === Number(month))?.label}, {year}
                                    </div>
                                    {/* <div className="legend mt-2">
                                        <span><span className="dot" style={{ background: 'var(--sage-soft)', boxShadow: 'inset 0 0 0 1.5px var(--sage)' }} />Present</span>
                                        <span><span className="dot" style={{ background: 'var(--coral-soft)', boxShadow: 'inset 0 0 0 1.5px var(--coral)' }} />Absent</span>
                                        <span><span className="dot" style={{ background: '#fff', boxShadow: 'inset 0 0 0 1.5px var(--gold)' }} />Today</span>
                                    </div> */}
                                </div>
                                <button className="btn-gold"><i className="bi bi-cloud-arrow-down" /> Export</button>
                            </div>

                            <div className="heat-scroll">
                                <table className="heat-table">
                                    <thead>
                                        <tr>
                                            <th className="name-col">Staff</th>
                                            {days.map((day) => (
                                                <th key={day} className="day-col">{String(day).padStart(2, "0")}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyLoading ? (
                                            <tr><td colSpan={days.length + 1} className="text-center text-muted py-4">Loading...</td></tr>
                                        ) : monthlyStaffs.length === 0 ? (
                                            <tr><td colSpan={days.length + 1} className="text-center text-muted py-4">No records found for this month.</td></tr>
                                        ) : (
                                            monthlyStaffs.map((staff) => (
                                                <tr key={staff.id}>
                                                    <td className="name-col">
                                                        <div className="staff-row-name">{staff.name}</div>
                                                        <div className="staff-row-meta">{staff.designation?.name} Present: {staff.attendances.filter((a) => a.check_in).length}</div>
                                                        <div className="staff-row-meta">
                                                            Hours: {(staff.attendances.reduce(
                                                                (sum, a) => sum + (a.working_minutes || 0), 0) / 60).toFixed(2)}{" "}
                                                            hr
                                                        </div>
                                                    </td>

                                                    {days.map((day) => {
                                                        // staff.attendances only contains rows for the
                                                        // selected month (filtered server-side), so we just
                                                        // match on the day portion of the BS date string.
                                                        const attendance = staff.attendances.find(
                                                            (a) => getBsDay(a.date) === day
                                                        );

                                                        return (
                                                            <td className="cell" key={day}>
                                                                {attendance && attendance.check_in ? (
                                                                    <div
                                                                        className="punch present m-1"
                                                                        data-tip={`${attendance.check_in?.slice(0, 5) ?? ''} - ${attendance.check_out?.slice(0, 5) ?? ''} = ${attendance.working_minutes ?? 0} min`}
                                                                    > {attendance.check_in?.slice(0, 5) ?? ''} - {attendance.check_out?.slice(0, 5) ?? ''} <br /> = {(attendance.working_minutes / 60).toFixed(2) ?? 0} Hr
                                                                        ✓
                                                                    </div>
                                                                ) : (
                                                                    <div className="punch absent m-1" data-tip="Absent">
                                                                        ✕
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex flex-wrap gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                                <span className="summary-pill"><i className="bi bi-check-circle me-1" />
                                    {monthlyStaffs.reduce((sum, s) => sum + s.attendances.length, 0)} Present
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Attendance
