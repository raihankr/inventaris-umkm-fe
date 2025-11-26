// endpoints dinamis
export const CREATE_USER = '/users';
export const UPDATE_USER = (id) => `/users/${id}`; // iur
export const UPDATE_USER_PASSWORD = (id) => `/users/${id}/change-password`; // iur
export const DELETE_USER = (id) => `/users/${id}`;
export const GET_USER = (id) => `/users/${id}`;

// endpoints statis
export const GET_USERS = '/users?page=1&limit=4';
export const GET_USER_ME = '/users/me'; // iur
