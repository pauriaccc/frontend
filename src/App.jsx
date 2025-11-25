import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AILecturer from "./components/AILecturer";
import AdminPanel from "./components/AdminPanel";
import CreateAccount from "./components/CreateAccount";
import Dashboard from "./components/Dashboard";
import Dictionaries from "./components/Dictionaries";
import Journals from "./components/Journals";
import Login from "./components/Login";
import Settings from "./components/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lecturer" element={<AILecturer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dictionaries" element={<Dictionaries />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
