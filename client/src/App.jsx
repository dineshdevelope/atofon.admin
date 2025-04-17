import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import EmployeeCards from "./components/EmployeeCards";
import SingleEmployeeDetail from "./pages/SingleEmployeeDetail";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeEditForm from "./pages/EmployeeEditForm";
import SystemList from "./pages/SystemList";

function App() {
  return (
    <>
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/" element={<EmployeeCards />} />
        <Route path="/systems" element={<SystemList />} />
        <Route path="/employee/:id" element={<SingleEmployeeDetail />} />
        <Route path="/employee/new" element={<EmployeeForm />} />
        <Route path="/employee/edit/:id" element={<EmployeeEditForm />} />
      </Routes>
    </>
  );
}

export default App;
