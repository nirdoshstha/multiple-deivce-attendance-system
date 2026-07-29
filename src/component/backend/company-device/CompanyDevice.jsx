import React, { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners';
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import confirmDelete from '../../../utils/confirmDelete';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/api';
import axios from 'axios';

const CompanyDevice = () => {

    const { can } = useAuth();

    const [loading, setLoading] = useState(false);
    const [device, setDevice] = useState({});
    const [devices, setDevices] = useState([]);

    const [trashed, setTrashed] = useState(0);
    const [brands, setBrands] = useState([]);

    const handleInput = (e) => {
        setDevice({ ...device, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        fetchDatas();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        try {
            const result = await api.post(`/company-devices`, device)
            showSuccess(result.data.message);
            fetchDatas();
            setDevice({
                name: "",
                website: ""
            });


        } catch (error) {
            showError(error.response.data.message)
        }
        finally {
            setLoading(false)
        }
    }

    const deleteDevice = async (id) => {
        const confirmed = await confirmDelete();
        if (!confirmed) return;
        setLoading(true);

        try {
            const result = await api.delete(`/company-devices/${id}`)
            showSuccess(result.data.message);
            fetchDatas();
        } catch (error) {
            showError(error.response.data.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }



    const fetchDatas = async (e) => {
        try {
            const result = await api.get(`/company-devices`)
            console.log(result);
            setDevices(result.data.devices);
            setTrashed(result.data.trashed);
        } catch (error) {
            showError(error.response.data.message);
        }

        // try {
        //     const url = `https://mockend.com/api/mockend/demo/posts`;
        //     const response = await fetch(url);
        //     const data = await response.json();
        //     console.log(data.title)
        //     setDevices(data)

        // } catch (error) {
        //       showError('something went wrong');
        // }

        // try {

        //     axios.get(`https://jsonplaceholder.typicode.com/users`).then((response) => {
        //         setDevices(response.data)
        //     })

        // } catch (error) {
        //     showError('something went wrong');
        // }
    }


    return (
        <div>
            <div className="admin-mgmt">
                <div className="admin-mgmt-grid">
                    {/* Create Admin Form */}
                    <div className="glass-card create-admin-card">
                        <div className="count-badge-row d-flex justify-content-between">
                            <button class="theme-toggle-btn" title="Cycle theme"><i className="bi bi-plus-circle" style={{ fontSize: "14px" }}></i> Create New Company Device </button>
                            <div className="count-icon"><i className="bi bi-shield-person-fill" />  {devices?.length || 0}</div>
                        </div>


                        <form onSubmit={handleSubmit}  >
                            <div className="form-group">
                                <label className="form-label"> Company Device Name</label>
                                <input type="text" name='name' value={device?.name} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>




                            <div className="form-group">
                                <label className="form-label"> Company Name (id)</label>
                                <input type="number" name='company_id' value={device?.company_id} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>
                            <div className="form-group">
                                <label className="form-label"> Device Brand Id(Name)</label>
                                <input type="number" name='device_brand_id' value={device?.device_brand_id} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Device Id</label>
                                <input type="number" name='device_id' value={device?.device_id} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Serial Number</label>
                                <input type="number" name='serial_no' value={device?.serial_no} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Port</label>
                                <input type="number" name='port' value={device?.port} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>
                            <div className="form-group">
                                <label className="form-label"> API KEY</label>
                                <input type="number" name='api_key' value={device?.api_key} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Device Code</label>
                                <input type="text" name='device_code' value={device?.device_code} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>
                            <div className="form-group">
                                <label className="form-label"> API URL</label>
                                <input type="text" name='api_url' value={device?.api_url} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">IP</label>
                                <input type="text" name='ip' value={device?.ip} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div>



                            <div className="form-group">
                                <label className="form-label"> Device Type</label>
                                <input type="text" name='type' value={device?.type} onChange={handleInput} className="form-control" id="newAdminName" placeholder="www.example.com" />

                            </div>



                            {
                                can("company-devices.store") && (
                                    <button type='submit' className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        {loading ? <PulseLoader
                                            color='white'
                                            loading={true}
                                            size={12}
                                        /> : ''}
                                        <i className="bi bi-person-plus-fill" /> Create Company Device
                                    </button>
                                )
                            }


                        </form>
                    </div>
                    {/* Admin List */}
                    <div className="glass-card-solid admin-list-card">
                        <div className="admin-table-header">
                            <div>
                                <div className="section-title" style={{ fontSize: 15 }}>Company Device Accounts</div>
                                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Manage existing administrator accounts</div>
                            </div>

                            <div>
                                <Link to={`/admin/company-device/trashed`} type="button" className="theme-toggle-btn gap-0 position-relative">
                                    <i class="bi bi-trash3-fill text-light"></i>
                                    <span className='badge ms-0'> Trashed</span>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {trashed || 0}+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </Link>

                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table class="admin-table" id="adminTable">
                                <thead>
                                    <tr>
                                        <th>S.no</th>
                                        <th>Device Name</th>
                                        <th>Company Named</th>
                                        <th>Device Brand</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="adminTableBody">
                                    {
                                        devices.length > 0 ? devices.map((device, index) => {
                                            return (
                                                <tr key={device.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {device.name}
                                                    </td>

                                                    <td>
                                                        {device.ip}
                                                    </td>

                                                    <td>
                                                        {device.device_brand_id}
                                                    </td>

                                                    <td>
                                                        <div className="table-actions">

                                                            {
                                                                can("company-devices.show") && (
                                                                    <Link to={`/admin/company-device/${device.id}`} className="btn-edit-sm" title="Show" >
                                                                        <i className="bi bi-eye"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("company-devices.update") && (
                                                                    <Link to={`/admin/company-device/edit/${device.id}`} className="btn-edit-sm" title="Edit" >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("company-devices.destroy") && (
                                                                    <button className="btn-danger-sm" onClick={() => deleteDevice(device.id)} title="Delete"><i className="bi bi-trash3" /></button>
                                                                )
                                                            }
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan={6} className='text-danger'><p>No Data Found !!</p></td>
                                            </tr>

                                    }


                                </tbody>
                            </table>
                        </div>
                        <div id="emptyState" style={{ display: 'none', textAlign: 'center', padding: 36, color: '#94A3B8' }}>
                            <i className="bi bi-person-x" style={{ fontSize: 36, marginBottom: 10, display: 'block' }} />
                            No admins found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDevice