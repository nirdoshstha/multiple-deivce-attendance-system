import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { showError, showSuccess } from '../../../utils/notify';
import api from '../../../api/api';

const MenuEdit = () => {

    useEffect(() => {
        document.title = "Menu Edit";
    }, []);

    const { id } = useParams();
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [menu, setMenu] = useState({
        name: "",
        website: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSpecificData();
    }, [])

    const getSpecificData = async () => {
        try {
            const result = await api.get(`/menus/${id}`)
            setMenu(result.data.menu);
            setMenus(result.data.menus)
            console.log(result)
        } catch (error) {
            showError(error.response.data.message || "Something went wrong")
        }
    }


    const handleInput = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await api.put(`/menus/${id}`, menu)
            showSuccess(result.data.message);
            navigate("/admin/menu")
        } catch (error) {
            showError(error.response.data.message || "Something went wrong")
        }
    }

    return (
        <div>
            <div className="glass-card-solid profile-right">
                <div style={{ marginBottom: 20 }}>
                    <div>
                        <div className="section-title" style={{ fontSize: 15 }}>Edit company<div className='float-end'>
                            <Link to={`/admin/menu`} className="theme-toggle-btn text-decoration-none" title="Cycle theme"><i class="bi bi-house-door"></i> Back To company</Link>
                        </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Update your company information</div>

                    </div>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">menu Name</label>
                            <input type="text" name='name' value={menu.name} onChange={handleInput} className="form-control" placeholder="First name" />
                        </div>

                        <div className="form-group">
                            <label className="form-label"> menu menu Name</label>
                            <select
                                name="menu_menu_id"
                                className="form-select mb-3"
                                value={menu.menu_id}
                                onChange={handleInput}
                            >

                                {menus.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>





                    <div className="divider" />
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type='submit' className="btn-primary" onclick="saveProfile()">
                            <i className="bi bi-check2-circle" /> Save Changes
                        </button>

                    </div>
                </form>
            </div >
        </div>
    )
}

export default MenuEdit