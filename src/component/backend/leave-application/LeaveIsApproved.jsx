import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { showError, showSuccess } from '../../../utils/notify';
import api from '../../../api/api';

const LeaveIsApproved = () => {

    useEffect(() => {
        document.title = "Is Leave Approved";
    }, []);

    const { id } = useParams();

    const navigate = useNavigate();


    const [leaveDetail, setLeaveDetail] = useState({});

    // const [isEdit, setIsEdit] = useState(false);

    const [isApprove, setIsApprove] = useState({
        approval_remarks: "",
        is_approved: 0
    });

    const handleInput = (e) => {
        setIsApprove({ ...isApprove, [e.target.name]: e.target.value })
    }


    useEffect(() => {
        getLeaveDetail();
    }, []);

    const getLeaveDetail = async () => {
        try {
            const result = await api.get(`/leave-applications/${id}`)
            setLeaveDetail(result.data.leave_application);
            setIsApprove(result.data.leave_application);
            // setIsEdit(true);

        } catch (error) {
            showError(error.response.data.message || "Something went wrong");
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await api.post(`/leave-isapproved/${id}`, isApprove)
            showSuccess(result.data.message);
            console.log(result);
            navigate('/admin/leave-application');
        } catch (error) {
            showError(error.response?.data?.message || 'Something went wrong');
        }
    }



    return (
        <div>
            <div className="glass-card-solid profile-right">
                <div style={{ marginBottom: 20 }}>
                    <div>
                        <div className="section-title" style={{ fontSize: 15 }}>Update Leave Approve / Reject <div className='float-end'>
                            <Link to={`/admin/leave-application`} className="theme-toggle-btn text-decoration-none" title="Cycle theme"><i class="bi bi-house-door"></i> Back To company</Link>
                        </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Update your Is Leave Approved ? </div>
                    </div>

                </div>



                <div className='row'>
                    <div className='col-lg-12'>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div class="alert alert-info mb-3">
                                    <small>Please review the leave application before approving or rejecting.</small>
                                </div>
                                <table className="table table-sm table-bordered mb-0">
                                    <tbody>
                                        <tr>
                                            <th width="35%"><label class="form-label"> Name</label></th>
                                            <td id="modal_user"><label className="form-label"> {leaveDetail.user?.name || ""}</label></td>
                                        </tr>
                                        <tr>
                                            <th width="35%"><label class="form-label"> Role </label></th>
                                            <td id="modal_user"><label className="form-label"> {leaveDetail.role?.name || ""} </label></td>
                                        </tr>
                                        <tr>
                                            <th><label class="form-label"> Leave Type </label></th>
                                            <td id="modal_leave_type"><label className="form-label">{leaveDetail.leave_type?.name || ""}</label></td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Leave Start / End  </label></th>
                                            <td className='d-flex'>
                                                <label className="form-label"><span>{leaveDetail.date_from || ""}</span></label>
                                                <label className="form-label px-2"> TO</label>
                                                <label className="form-label"> <span>{leaveDetail.date_to || ""}</span></label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th><label class="form-label"> Total Requested Days</label></th>
                                            <td>
                                                <span><label className="form-label">{leaveDetail.total_days || 0} </label></span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Approval Remarks</label></th>
                                            <td>
                                                <textarea name="approval_remarks" value={isApprove.approval_remarks || ""} onChange={handleInput} className="form-control" />
                                            </td>
                                        </tr>

                                        <tr>
                                            <th><label class="form-label">Approve / Reject</label></th>
                                            <td>
                                                <div>
                                                    {
                                                        leaveDetail.is_approved == 1 ? (
                                                            <button type="button" className="btn-success">
                                                                <i className="bi bi-check2-circle fs-6"></i> Approved
                                                            </button>
                                                        ) : leaveDetail.is_approved == 2 ? (
                                                            <button type="button" className="btn-danger">
                                                                <i className="bi bi-x-circle"></i> Rejected
                                                            </button>
                                                        ) : (
                                                            <button type="button" className="btn btn-secondary">
                                                                <i className="bi bi-hourglass-split fs-6"></i> Pending
                                                            </button>
                                                        )
                                                    }
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* <div className="divider" /> */}
                            <div className="modal-footer gap-3 mt-3">
                                <Link to={`/admin/leave-application`} className="btn btn-secondary"><i class="bi bi-x-lg"></i> Cancel</Link>

                                <button
                                    type="submit"
                                    className="btn-danger"
                                    onClick={() => setIsApprove({ ...isApprove, is_approved: "2" })}
                                >
                                    <i className="bi bi-x-circle"></i> Rejected
                                </button>
                                <button
                                    type="submit"
                                    className="btn-success"
                                    onClick={() => setIsApprove({ ...isApprove, is_approved: "1" })}
                                >
                                    <i className="bi bi-check2-circle fs-6"></i> Approved
                                </button>
                            </div>
                        </form>
                    </div>

                </div>



            </div >
        </div>
    )
}

export default LeaveIsApproved