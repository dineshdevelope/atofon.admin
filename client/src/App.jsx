import "./App.css";
import { ToastContainer } from "react-toastify";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeCards from "./components/EmployeeCards";
import SingleEmployeeDetail from "./pages/SingleEmployeeDetail";
import { Routes, Route } from "react-router-dom";
//import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <>
      <ToastContainer limit={1} />
      <Routes>
        <Route path="/" element={<EmployeeCards />} />
        <Route path="/employee/:id" element={<SingleEmployeeDetail />} />
        <Route path="/employee/new" element={<EmployeeForm />} />
      </Routes>
    </>
  );
}

export default App;
