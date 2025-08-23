import axios from "axios";
import { message } from "antd";

export const CONFIG = {
  API_URL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3060"
      : "https://",
  BASE_NAME: process.env.NODE_ENV === "development" ? "" : "/mall",
  FILE_URL: "",
  WS_URL: "",
  ZM_USER_INFO: "eob_user_info",
  ZM_LOGIN_TOKEN: "eob_login_token",
  ZM_LOGIN_REMEMBER: "0",
};

export const get = (url: string): Promise<Res<any>> => {
  return new Promise((resolve, reject) => {
    axios
      .get(CONFIG.API_URL + url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ZM_LOGIN_TOKEN
          )}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          window.location.href = CONFIG.BASE_NAME + "/login";
        } else {
          message.error(err.response.status + ": " + err.response.data);
        }
        reject(err);
      });
  });
};

export const put = (url: string, params?: any): Promise<Res<any>> => {
  return new Promise((resolve, reject) => {
    axios
      .put(CONFIG.API_URL + url, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ZM_LOGIN_TOKEN
          )}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          window.location.href = CONFIG.BASE_NAME + "/login";
        } else {
          message.error(err.response.status + ": " + err.response.data);
        }
        reject(err);
      });
  });
};

export const post = (url: string, params?: any): Promise<Res<any>> => {
  return new Promise((resolve, reject) => {
    axios
      .post(CONFIG.API_URL + url, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ZM_LOGIN_TOKEN
          )}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          window.location.href = CONFIG.BASE_NAME + "/login";
        } else {
          message.error(err.response.status + ": " + err.response.data);
        }
        reject(err);
      });
  });
};
