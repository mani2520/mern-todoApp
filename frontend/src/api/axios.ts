import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", //https://mern-todoapp-ht44.onrender.com/api //http://localhost:5000/
});

export default api;
