import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : undefined,
    withCredentials: true,
});

export default client;