// endpoints dinamis
export const CREATE_USER = '/users'; // untuk registrasi user baru
export const UPDATE_USER = (id) => `/users/${id}`; // untuk update data user
export const UPDATE_USER_PASSWORD = `/users/change-password`; // untuk ganti password user
export const DELETE_USER = (id) => `/users/${id}`; // untuk hapus user
export const GET_USER = (id) => `/users/${id}`; // untuk dapatkan data user by ID

// endpoints statis
export const GET_USERS = (page, limit) => `/users?page=${page}&limit=${limit}`; // untuk dapatkan list user dengan pagination
export const GET_USER_ME = '/users/me'; // untuk dapatkan data user yang sedang login
