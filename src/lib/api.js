import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

/*
  Notes:
  1. Base URL otomatis pilih lokal atau production
  2. Axios instance pake cookie auth (withCredentials: true + otomatis cek cookienya)
  3. Interceptor handle 401, jadi bisa reload page otomatis
  4. List formatt respon error, status, data, message
  5. List helper GET, POST, Patch, DELETE, fetchWithPagination
  6. POST/Patch otomatis nge-cek FormData buat multipart
*/

// base URL api, otomatis nyesuain lokal - prdction
function getBaseApiUrl() {
  const hname = window.location.hostname || "";
  if (hname.includes("localhost") || hname.includes("127.0.0.1")) {
    return (
      import.meta.env.VITE_BASE_URL_API_LOCAL ||
      import.meta.env.VITE_BASE_URL_API_DOMAIN
    );
  }
  return import.meta.env.VITE_BASE_URL_API_DOMAIN;
}

// instance axios, cookie otomatis dikirim
const api = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true, // cookie auth otomatis
  headers: { Accept: "application/json" },
});

// intercept response, kalo 401 langsung reload page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) return Promise.reject(err);
  },
);

// helper format error, biar konsisten
function formatError(err) {
  const status = err?.response?.status || 500;
  const data = err?.response?.data;
  const message =
    data?.error || data?.message || err.message || "Terjadi kesalahan sistem";
  return { error: true, status, data, message };
}

// helper format sukses, biar konsisten
function formatSuccess(res) {
  return {
    error: false,
    status: res.status,
    data: res.data,
    message: res.data?.message || "Success",
  };
}

// GET request sederhana, params jadi query string otomatis
export async function apiGet(path, params = {}) {
  try {
    const res = await api.get(path, { params });
    return formatSuccess(res);
  } catch (err) {
    return formatError(err);
  }
}

// POST request, cek FormData otomatis untuk multipart
export async function apiPost(path, payload, extraConfig = {}) {
  try {
    const isForm = payload instanceof FormData;
    const config = {
      ...(isForm ? { headers: { "Content-Type": "multipart/form-data" } } : {}),
      ...extraConfig,
    };
    const res = await api.post(path, payload, config);
    return formatSuccess(res);
  } catch (err) {
    return formatError(err);
  }
}

// Patch request, sama seperti POST
export async function apiPatch(path, payload, extraConfig = {}) {
  try {
    const isForm = payload instanceof FormData;
    const config = {
      ...(isForm ? { headers: { "Content-Type": "multipart/form-data" } } : {}),
      ...extraConfig,
    };
    const res = await api.patch(path, payload, config);
    return formatSuccess(res);
  } catch (err) {
    return formatError(err);
  }
}

// DELETE request, bisa kasih query params opsional
export async function apiDelete(path, params = {}) {
  try {
    const res = await api.delete(path, { params });
    return formatSuccess(res);
  } catch (err) {
    return formatError(err);
  }
}

// fetch data dengan server-side pagination
export async function fetchWithPagination(path, options = {}) {
  const { page = 1, limit = 10, sort, order, ...other } = options;
  const params = { page, limit, ...other };
  if (sort) params.sort = sort;
  if (order) params.order = order;
  return apiGet(path, params);
}

// fetch logout
export async function apiLogout(path) {
  try {
    const tempApi = axios.create({
      baseURL: getBaseApiUrl(),
      withCredentials: true,
      headers: { Accept: "application/json" },
    });

    const res = await tempApi.get(path);
    return formatSuccess(res);
  } catch (err) {
    return formatError(err);
  }
}

export default api;
