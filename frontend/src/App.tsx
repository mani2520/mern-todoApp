import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Todo from "./pages/Todo";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Todo />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
};

export default App;
