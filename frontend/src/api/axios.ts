import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-todoapp-ht44.onrender.com/api/",
});

export default api;
