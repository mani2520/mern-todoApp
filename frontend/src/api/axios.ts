import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-todoapp-ht44.onrender.com/api", //https://mern-todoapp-ht44.onrender.com/api //http://localhost:5000/
});

export default api;
