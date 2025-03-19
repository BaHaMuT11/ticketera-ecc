import {Route, Routes} from "react-router";
import Layout from "../views/Layout.jsx";
import UserView from "../views/UserView.jsx";
import TicketView from "../views/TicketView.jsx";
import ResponsibilityView from "../views/ResponsibilityView.jsx";
import SummaryView from "../views/SummaryView.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<UserView />} />
                <Route path="/baha-ticket" element={<TicketView />} />
                <Route path="/baha-responsible" element={<ResponsibilityView />} />
                <Route path="/baha-summary" element={<SummaryView />} />
            </Route>
        </Routes>
    );
};

export default App;