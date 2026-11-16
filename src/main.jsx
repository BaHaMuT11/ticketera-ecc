import {createRoot} from 'react-dom/client'
import '@fontsource-variable/onest'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './assets/css/index.css'
import App from './components/App.jsx'
import {BrowserRouter} from "react-router";
import {UserProvider} from "./context/UserProvider.jsx";
import {TicketProvider} from "./context/TicketProvider.jsx";
import ResponsibilityProvider from "./context/ResponsibilityProvider.jsx";
import {ThemeProvider} from "./context/ThemeProvider.jsx";
import {PreferenciasTablaProvider} from "./context/PreferenciasTablaProvider.jsx";
import {ToastProvider} from "./context/ToastProvider.jsx";

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <ToastProvider>
            <PreferenciasTablaProvider>
                <ResponsibilityProvider>
                    <TicketProvider>
                        <UserProvider>
                            <BrowserRouter>
                                <App/>
                            </BrowserRouter>
                        </UserProvider>
                    </TicketProvider>
                </ResponsibilityProvider>
            </PreferenciasTablaProvider>
        </ToastProvider>
    </ThemeProvider>,
)
