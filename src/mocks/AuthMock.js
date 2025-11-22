// src/mocks/authMock.js

export const mockUser = {
  email: "admin-umkm@yopmail.com",
  password: "test",
  name: "Admin UMKM",
  role: "admin",
  token: "mock-token-123", // apa aja lah, bebas
};

export function loginMock({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === mockUser.email && password === mockUser.password) {
        resolve({
          success: true,
          message: "Login success (mock)",
          data: {
            name: mockUser.name,
            role: mockUser.role,
            token: mockUser.token,
          },
        });
      } else {
        reject({
          success: false,
          message: "Invalid email or password (mock)",
        });
      }
    }, 500); // simulasi delay
  });
}
