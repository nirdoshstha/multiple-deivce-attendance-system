import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { showError, showSuccess } from "../../../utils/notify";
import confirmDelete from "../../../utils/confirmDelete";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/api";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router"

const Menu = () => {
  useEffect(() => {
    document.title = "Menus";
  }, []);
  const { can } = useAuth();

  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState({
    parent_id: "",
    name: "",
    display_name: "",
    permission_id: '',
    rank: "",
    route: "",
    icon: ""
  });
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const handleInput = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    fetchDatas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.post(`/menus`, menu);
      showSuccess(result.data.message);
      fetchDatas();
      setMenu({
        parent_id: "",
        name: "",
        display_name: "",
        route: "",
        rank: "",
        icon: ""
      });
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deletemenu = async (id) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;
    setLoading(true);

    try {
      const result = await api.delete(`/menus/${id}`);
      showSuccess(result.data.message);
      fetchDatas();
    } catch (error) {
      showError(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatas = async (e) => {
    try {
      const result = await api.get(`/menus`);
      // console.log(result);
      setMenus(result.data.menus);
      setCategory(result.data.category);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await api.get(`/menus`);
        console.log(response);

        setPermissions(response.data.permissions);
      } catch (error) {
        console.log(error);
      }
    };

    getPermissions();
  }, []);
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
                ></i>{" "}
                Create New Menu{" "}
              </button>
              <div className="count-icon">
                <i className="bi bi-shield-person-fill" /> {menus?.length || 0}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <select
                  name="parent_id"
                  className="form-select"
                  onChange={handleInput}
                >
                  <option value=""> Please Select Parent</option>
                  {category.map((item) => {
                    return <option key={item.id} value={item.id}> {item.name}</option>;
                  })}
                </select>
              </div>



              <div className="form-floating">

                <input
                  type="text"
                  name="name"
                  value={menu?.name}
                  onChange={handleInput}
                  className="form-control"
                  id="menuName"
                  placeholder="Menu Name"
                />
                <label for="menuName"> Menu Name</label>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="display_name">
                  Display Name
                </label>

                <input
                  type="text"
                  name="display_name"
                  value={menu?.display_name}
                  onChange={handleInput}
                  className="form-control"
                  id="display_name"
                  placeholder="Display Name"
                />

              </div>

              <div className="form-floating">
                <input
                  type="text"
                  name="route"
                  value={menu?.route}
                  onChange={handleInput}
                  className="form-control"
                  id="route"
                  placeholder="Route Name"
                />
                <label for="route"> Route Name</label>
              </div>

              <div className="form-floating">
                <input
                  type="number"
                  name="rank"
                  value={menu?.rank}
                  onChange={handleInput}
                  className="form-control"
                  id="rank"
                  placeholder="Rank"
                />
                <label for="rank">Rank</label>
              </div>

              <div className="form-floating">
                <input
                  type="text"
                  name="icon"
                  value={menu?.icon}
                  onChange={handleInput}
                  className="form-control"
                  id="icon"
                  placeholder="bi bi-users"
                />
                <label for="icon"> Icon (eg: bi bi-users)</label>
              </div>

              {can("menus.store") && (
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
                  <i className="bi bi-person-plus-fill" /> Create menu Account
                </button>
              )}
            </form>
          </div>
          {/* Admin List */}
          <div className="glass-card-solid admin-list-card">
            <div className="admin-table-header">
              <div>
                <div className="section-title" style={{ fontSize: 15 }}>
                  Menu Accounts
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                  Manage existing administrator accounts
                </div>
              </div>

            </div>
            <div style={{ overflowX: "auto" }}>


              {category.map((item, index) => {
                return (
                  <Accordion defaultActiveKey="0">

                    <Accordion.Item eventKey={item.id}>
                      <Accordion.Header className="">  <label class="form-label me-2"># {index + 1}</label>
                        {
                          can("menus.update") && (
                            <Link to={`/admin/menu/edit/${item.id}`} className="btn-edit-sm me-2" title="Edit" >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )
                        }


                        {
                          can("menus.destroy") && (
                            <button className="btn-danger-sm me-2" onClick={() => deletemenu(item.id)} title="Delete"><i className="bi bi-trash3" /></button>
                          )
                        }

                        <label class="form-label">{item.display_name} <span className="gap-5"> ({item.sub_categories?.length || 0})</span>   <i className={`${item.icon} ms-4`}></i></label>




                      </Accordion.Header>

                      <Accordion.Body>
                        <table class="admin-table" id="adminTable">
                          <thead>
                            <tr>
                              <th>S.no</th>
                              <th>Name</th>
                              <th>Route Name</th>
                              <th>Rank</th>
                              <th>Icon</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody id="adminTableBody">
                            {
                              item.sub_categories?.map((menu, index) => {
                                return (
                                  <tr key={menu.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {menu.name}
                                    </td>
                                    <td>{menu.route}</td>

                                    <td>
                                      {menu.rank}
                                    </td>

                                    <td>
                                      <i className={menu.icon}></i>
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

                      </Accordion.Body>
                    </Accordion.Item>

                  </Accordion>
                );
              })}

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

export default Menu;
