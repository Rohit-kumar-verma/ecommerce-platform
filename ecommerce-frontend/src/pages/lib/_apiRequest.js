import axios from "axios";

export const apiRequest= axios.create({
        baseURL: process.env.BASE_URL,
        withCredentials:true
}
)