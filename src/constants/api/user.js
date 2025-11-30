// endpoints dinamis
export const CREATE_USER = '/users';
export const UPDATE_USER = (id) => `/users/${id}`; 
export const UPDATE_USER_PASSWORD = `/users/change-password`; 
export const DELETE_USER = (id) => `/users/${id}`;
export const GET_USER = (id) => `/users/${id}`;

// endpoints statis
export const GET_USERS = (page, limit) => `/users?page=${page}&limit=${limit}`;
export const GET_USER_ME = '/users/me';
