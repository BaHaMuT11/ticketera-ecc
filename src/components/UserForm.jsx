import {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";


const UserForm = () => {

    const {userName, setUserName} = useContext(UserContext);
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
                                       value={userName.nombre2} onChange={handleChange} />
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