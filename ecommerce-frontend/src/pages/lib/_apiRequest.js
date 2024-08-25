import axios from "axios";

export const apiRequest= axios.create({
        baseURL: process.env.BASE_URL,
        // baseURL: 'http://estate-app-hu0u.onrender.com/api',
        withCredentials:true
}
)