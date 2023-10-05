import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:3001/api/v1/";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 60000;

const axiosClient = axios.create();
axiosClient.defaults.withCredentials = true; //enable to request with cookies
// Add a request interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    // Do something before request is sent

    const accessToken = JSON.parse(window.localStorage.getItem("token"));
    // console.log('token  trruoc khi :',accessToken);
    if (accessToken) {
      // console.log("test");
      config.headers = {
        token: `Bearer ${accessToken}`,
      };

      const now = new Date();
      const expiresTime = jwt_decode(accessToken);
      if (expiresTime.exp * 1000 < now.getTime()) {
        // console.log(expiresTime.exp * 1000 < now.getTime());
        try {
          const result = await axios({
            method: "POST",
            url: "users/refresh-token",
            withCredentials: true,
          });
          // console.log('token sau khi refresh',result.data.newToken);
          config.headers = {
            token: `Bearer ${result.data.newToken}`,
          };
          window.localStorage.setItem("token", JSON.stringify(result.data.newToken));
        } catch (error) {
          console.log(error);
        }
      }
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosClient;