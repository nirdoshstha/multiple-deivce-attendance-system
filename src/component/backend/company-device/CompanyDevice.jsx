import React, { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners';
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import confirmDelete from '../../../utils/confirmDelete';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/api';
// import axios from 'axios';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const CompanyDevice = () => {

    useEffect(() => {
        document.title = "Company Device";
    }, []);

    const { can } = useAuth();

    const [loading, setLoading] = useState(false);
    const [device, setDevice] = useState({});
    const [devices, setDevices] = useState([]);
    const [deviceName, setDeviceName] = useState([]);
    const [deviceBrand, setDeviceBrand] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [trashed, setTrashed] = useState(0);
    const [brands, setBrands] = useState([]);

        const handleInput = async (e) => { 
            const { name, value } = e.target;

            setDevice((prev) => ({
                ...prev,
                [name]: value,
            }));

            if (name === "device_brand_id") {
        // Clear previous device selection
        setDevice((prev) => ({
            ...prev,
            device_brand_id: value,
            device_id: ""
        }));

        if (!value) {
            setDeviceName([]);
            return;
        }

        try {
            const response = await api.get(`/devices/by-brand`, {
                params: {
                    device_brand_id: value
                }
            });
             

            setDeviceName(response.data.devices || []);
        } catch (error) {
            console.error("Error fetching devices:", error);
            setDeviceName([]);
        }
    }
        };
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
                company_id: "",
                device_brand_id: "",
                device_id: "",
                serial_no: "",
                port: "",
                api_key: "",
                device_code: "",
                api_url: "",
                ip: ""
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



    const fetchDatas = async () => {
        try {
            const result = await api.get(`/company-devices`)
            console.log(result);
            setDevices(result.data.devices);
            setDeviceName(result.data.device_name)
            setDeviceBrand(result.data.device_brand)
            setCompanies(result.data.companies);
            setTrashed(result.data.trashed);
        } catch (error) {
            showError(error.response.data.message);
        }

         
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

                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Device Name (eg: Branch Office HK Vision)"
                                >
                                    <input type="text" name='name' value={device?.name} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                                </FloatingLabel>
                            </div>




                            <div className="form-group">
                                <label className="form-label"> Company Name</label>


                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Company Name"
                                >
                                    <Form.Select name="company_id" onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                                        <option>Please Select Company</option>
                                        {
                                            companies.map((item) => {
                                                return (
                                                    <option value={item.id} key={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    
                                </FloatingLabel>
                            </div>
                            <div className="form-group">
                                {/* <label className="form-label"> Device Brand Id(Name)</label>
                                <input type="number" name='device_brand_id' value={device?.device_brand_id} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" /> */}
                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Device Brand"
                                >
                                    {/* <Form.Select name="device_brand_id" value={device?.device_brand_id || ""} onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                                        <option>Please Select Device Brand</option>
                                        {
                                            deviceBrand.map((item) => {
                                                return (
                                                    <option value={item.id} key={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select> */}

                                    <Form.Select
                                        name="device_brand_id"
                                        value={device?.device_brand_id || ""}
                                        onChange={handleInput}
                                        className="mb-3"
                                    >
                                        <option value="">Please Select Device Brand</option>

                                        {deviceBrand.map((item) => (
                                            <option value={item.id} key={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>

                            </div>

                            <div className="form-group">
                                <label className="form-label"> Device Id</label>
                                <Form.Select name="device_id" value={device?.device_id || ""} onChange={handleInput} aria-label="Floating label select example" className="mb-3">
                                    <option>Please Select Device</option>
                                    {
                                        deviceName.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </div>

                            {/* <div className="form-group">
                                <label className="form-label"> Serial Number</label>
                                <input type="text" name='serial_no' value={device?.serial_no} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. ZKTK40PRO001" />
                            </div> */}

                             <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Serial Number (eg:ZKTK40PRO001)"
                                >
                                    <input type="text" name='serial_no' value={device?.serial_no} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. ZKTK40PRO001" />
                                </FloatingLabel>

                            {/* <div className="form-group">
                                <label className="form-label"> Port</label>
                                <input type="number" name='port' value={device?.port} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div> */}

                            <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="PORT (eg:4370)"
                                >
                                    <input type="text" name='port' value={device?.port} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. 4370" />
                                </FloatingLabel>


                            {/* <div className="form-group">
                                <label className="form-label"> API KEY</label>
                                <input type="number" name='api_key' value={device?.api_key} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div> */}

                             <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="API KEY (eg:123456)"
                                >
                                    <input type="text" name='api_key' value={device?.api_key} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. 123456" />
                                </FloatingLabel>

                            {/* <div className="form-group">
                                <label className="form-label"> Device Code</label>
                                <input type="text" name='device_code' value={device?.device_code} onChange={handleInput} className="form-control" placeholder="e.g. Alex Rivera" />
                            </div> */}
                            <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Device Code (eg:ZKT-001)"
                                >
                                    <input type="text" name='device_code' value={device?.device_code} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. 1ZKT-001" />
                                </FloatingLabel>

                            {/* <div className="form-group">
                                <label className="form-label"> API URL</label>
                                <input type="text" name='api_url' value={device?.api_url} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div> */}

                             <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="API URL (eg: http://192.168.1.201/api)"
                                >
                                    <input type="text" name='api_url' value={device?.api_url} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. 1ZKT-001" />
                                </FloatingLabel>

                            {/* <div className="form-group">
                                <label className="form-label">IP</label>
                                <input type="text" name='ip' value={device?.ip} onChange={handleInput} className="form-control" id="newAdminName" placeholder="e.g. Alex Rivera" />
                            </div> */}

                            <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="IP ADDRESS (eg: 192.168.1.201)"
                                >
                                    <input type="text" name='ip' value={device?.ip} onChange={handleInput} className="form-control"  placeholder="e.g. 192.168.1.201" />
                                </FloatingLabel> 


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
                                        <th>Serial No</th>
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
                                                        {device.company?.name}
                                                    </td>

                                                    <td>
                                                        {device.brand?.name}
                                                    </td>

                                                    <td>
                                                        {device.serial_no}
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