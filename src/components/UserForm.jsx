import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import axios from "axios";
import {ArrowRight} from "lucide-react";
import {Button} from "./ui/Button.jsx";
import {Field, Input} from "./ui/Field.jsx";

const UserForm = () => {

    const {userName, setUserName, setInventario} = useContext(UserContext);

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
    }, [setInventario]);

    return (
        <div className="mx-auto flex min-h-[560px] max-w-[460px] flex-col justify-center">
            <h2 className="text-[40px] font-semibold leading-[1.1] tracking-tight">¿Quién atiende hoy?</h2>
            <p className="mt-3 max-w-[44ch] text-[17px] leading-7 text-ink-2">
                Tu nombre aparece en el correo de responsabilidad y en el resumen del día.
            </p>
            <form id="formUser" onSubmit={handleSubmit} className="mt-8">
                <Field label="Nombre" htmlFor="nombre2">
                    <Input id="nombre2" name="nombre2" className="h-12 text-base" autoFocus
                           value={userName.nombre2} onChange={handleChange} required/>
                </Field>
                <Button type="submit" icon={ArrowRight} full className="mt-5">Comenzar turno</Button>
            </form>
        </div>
    );
};

export default UserForm;
