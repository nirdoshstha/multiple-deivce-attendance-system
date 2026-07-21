// import axios from "axios";

// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api',
//     withCredentials: true,
//     headers: {
//         "Accept": 'application/json',
//         "Content-Type": 'application/json',
//     }
// });

// export default api


import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        // "Content-Type": "application/json", ====> (FormData will never work.)
    },
});

export default api;