import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import axios from "axios";


const UserForm = () => {

    const {userName, setUserName} = useContext(UserContext);
    const {setInventario} = useContext(UserContext);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setUserName({
            ...userName,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/baha-ticket");
    };

    useEffect(() => {
        axios.get("https://bahamut11.github.io/logical-Inventory/inventario.json")
            .then(response => {
                setInventario(response.data);
            })
            .catch(error => {
                console.error('Error al cargar el inventario:', error);
            });
    }, []);

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header text-bg-primary d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">INFORMACIÓN PERSONAL</h5>
                </div>
                <div className="card-body">
                    <form id="formUser" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label htmlFor="nombre2" className="form-label">Nombre</label>
                                <input type="text" className="form-control form-control-sm" id="nombre2" name="nombre2"
                                       value={userName.nombre2} onChange={handleChange} required />
                            </div>
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-success">Continuar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;