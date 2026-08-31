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

// Assumes an auth token/interceptor is already set up elsewhere in your app
// (e.g. Sanctum cookie auth or an Authorization header interceptor).

// export const listDevices = () => api.get("/company-devices").then((r) => r.data.data);

// export const checkDeviceConnection = (id) =>
//   api.post(`/company-devices/${id}/check-connection`).then((r) => r.data);

// export const syncDevice = (id) =>
//   api.post(`/company-devices/${id}/sync`).then((r) => r.data.data);

export default api;