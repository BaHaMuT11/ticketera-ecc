import {createRoot} from 'react-dom/client'
import './assets/css/index.css'
import App from './components/App.jsx'
import {BrowserRouter} from "react-router";
import {UserProvider} from "./context/UserProvider.jsx";
import {TicketProvider} from "./context/TicketProvider.jsx";
import ResponsibilityProvider from "./context/ResponsibilityProvider.jsx";

createRoot(document.getElementById('root')).render(
    <ResponsibilityProvider>
        <TicketProvider>
            <UserProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </UserProvider>
        </TicketProvider>
    </ResponsibilityProvider>,
)
