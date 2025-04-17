import "./App.css";
import { ToastContainer } from "react-toastify";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeCards from "./components/EmployeeCards";
import SingleEmployeeDetail from "./pages/SingleEmployeeDetail";
import EmployeeEditForm from "./pages/EmployeeEditForm"; // Add this import
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/" element={<EmployeeCards />} />
        <Route path="/employee/:id" element={<SingleEmployeeDetail />} />
        <Route path="/employee/new" element={<EmployeeForm />} />
        <Route path="/employee/edit/:id" element={<EmployeeEditForm />} />{" "}
        {/* Add this route */}
      </Routes>
    </>
  );
}

export default App;
