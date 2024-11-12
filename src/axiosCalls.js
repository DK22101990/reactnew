import axios from "axios";

// Old URL
// const baseUrl = "http://172.18.6.117/api/v1/"; old 1
// const baseUrl = "http://172.28.11.154/api/v1/"; old 2
const baseUrl = "http://192.168.111.112/api/v1/";

export default axios.create({
    baseURL: baseUrl
})