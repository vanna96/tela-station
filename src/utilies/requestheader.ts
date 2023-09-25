import axios, { AxiosError, ResponseType, AxiosResponse } from "axios"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { UpdateDataSuccess } from "./ClientError"

// export const url = "https://103.120.133.234:50000/b1s/v1";
export const url = "https://192.168.1.11:50000/b1s/v1";


export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: url,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response)
      }
    }

    return Promise.reject(response)
  },
  (error) => {
    return Promise.reject(error)
  }
)
const requestHeader = async (
  method: string,
  url: string,
  data?: any,
  responseType?: ResponseType,
  headers?: any
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        axiosInstance({
          method,
          url,
          data,
          headers: {
            "B1S-ReplaceCollectionsOnPatch":
              method.toLowerCase() === "patch" ? true : false,
            ...headers,
          },
          responseType: responseType ?? "json",
        })
          .then((response) => {
            // Check if status code is 201 in the response headers
            if (response.headers && response.headers.status === '201 OK') {
              resolve("Update Successfully");
            } else {
              resolve({ data: response.data, headers: response.headers });
            }
          })
          .catch((e) => {
            console.log(e);

            if (!(e instanceof AxiosError)) {
              if (window.location.pathname !== "/login" && e?.status !== 204) {
                // window.location.href = "/login"
              } else if (e?.status === 204) {
                resolve("Update Successfully");
              } else {
                reject(new Error("Internal Server Error"));
              }

              return;
            }

            if (e?.code === AxiosError.ERR_NETWORK) {
              reject(new Error("Please check your connect"));
            }

            if (e?.status === 401 && window.location.pathname !== "/login") {
              // window.location.href = "/login"
              return;
            }

            if (e?.status === 204) {
              reject(new Error("Update Successfully"));
            }

            let error = e?.response?.data?.error?.message?.value;
            reject(new Error(error ?? "Invalid request"));
          });
      } catch (e) {
        // Handle exceptions here if needed
      }
    }, 1000);
  });
};

export default requestHeader;
