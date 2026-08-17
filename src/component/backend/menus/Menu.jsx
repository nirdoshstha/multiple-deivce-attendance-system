import React, { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners';
import { showError, showSuccess } from '../../../utils/notify';
import { Link } from 'react-router';
import confirmDelete from '../../../utils/confirmDelete';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/api';

const Menu = () => {


    useEffect(() => {
        document.title = "Menus";
    }, []);
    const { can } = useAuth();

    const [loading, setLoading] = useState(false);
    const [menu, setMenu] = useState({});
    const [menus, setMenus] = useState([]);
    const [category, setCategory] = useState([]);

    const handleInput = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        fetchDatas();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        try {
            const result = await api.post(`/menus`, menu)
            showSuccess(result.data.message);
            fetchDatas();
            setMenu({});


        } catch (error) {
            showError(error.response.data.message)
        }
        finally {
            setLoading(false)
        }
    }

    const deletemenu = async (id) => {
        const confirmed = await confirmDelete();
        if (!confirmed) return;
        setLoading(true);

        try {
            const result = await api.delete(`/menus/${id}`)
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
            const result = await api.get(`/menus`)
            // console.log(result);
            setMenus(result.data.menus);
            setCategory(result.data.category)
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
                            <button class="theme-toggle-btn" title="Cycle theme"><i className="bi bi-plus-circle" style={{ fontSize: "14px" }}></i> Create New menu menu </button>
                            <div className="count-icon"><i className="bi bi-shield-person-fill" />  {menus?.length || 0}</div>
                        </div>


                        <form onSubmit={handleSubmit}  >

                            <div className="form-group mb-3">
                                <label className="form-label"> Category</label>

                                <select name='parent_id' className='form-select' onChange={handleInput}>
                                    <option value=""> Please Select Parent</option>
                                    {
                                        category.map((item, index) => {
                                            return (
                                                <option value={item.id}> {item.name}</option>
                                            )
                                        })
                                    }

                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label"> Menu Name</label>

                                <input type="text" name='name' value={menu?.name} onChange={handleInput} className="form-control" id="newAdminName" placeholder="Menu Name" />
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Route Name</label>
                                <input type="text" name='route' value={menu?.route} onChange={handleInput} className="form-control" id="newAdminName" placeholder="Route Name" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rank</label>
                                <input type="number" name='rank' value={menu?.rank} onChange={handleInput} className="form-control" id="newAdminName" placeholder="Rank" />
                            </div>


                            {
                                can("menus.store") && (
                                    <button type='submit' className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        {loading ? <PulseLoader
                                            color='white'
                                            loading={true}
                                            size={12}
                                        /> : ''}
                                        <i className="bi bi-person-plus-fill" /> Create menu Account
                                    </button>
                                )
                            }


                        </form>
                    </div>
                    {/* Admin List */}
                    <div className="glass-card-solid admin-list-card">
                        <div className="admin-table-header">
                            <div>
                                <div className="section-title" style={{ fontSize: 15 }}>menu Accounts</div>
                                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>Manage existing administrator accounts</div>
                            </div>
                            <div className="search-box">
                                <i className="bi bi-search" />
                                <input type="text" className="form-control" id="adminSearch" placeholder="Search admins..." oninput="filterAdmins()" />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table class="admin-table" id="adminTable">
                                <thead>
                                    <tr>
                                        <th>S.no</th>
                                        <th>Parent Name</th>
                                        <th>Name</th>
                                        <th>Route Name</th>
                                        <th>Rank</th>
                                        <th>Icon</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="adminTableBody">
                                    {
                                        menus.map((menu, index) => {
                                            return (
                                                <tr key={menu.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{menu.parent?.name}</td>
                                                    <td>
                                                        {menu.name}
                                                    </td>
                                                    <td>{menu.route}</td>

                                                    <td>
                                                        {menu.rank}
                                                    </td>

                                                    <td>
                                                        {menu.icon}
                                                    </td>

                                                    <td>
                                                        <div className="table-actions">

                                                            {
                                                                can("menus.update") && (
                                                                    <Link to={`/admin/menu/edit/${menu.id}`} className="btn-edit-sm" title="Edit" >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </Link>
                                                                )
                                                            }


                                                            {
                                                                can("menus.destroy") && (
                                                                    <button className="btn-danger-sm" onClick={() => deletemenu(menu.id)} title="Delete"><i className="bi bi-trash3" /></button>
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

export default Menu