import * as Yup from "yup";

export const ValidateUser = Yup.object().shape({
  username: Yup.string()
    .required("Nama wajib diisi")
    .min(3, "Username minimal 3 karakter")
    .matches(
      /^[a-z0-9_-]*$/,
      "Username hanya boleh gabungan dari huruf kecil, angka 0—9, _, dan -",
    ),

  name: Yup.string()
    .required("Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter"),

  role: Yup.string()
    .required("Role wajib diisi")
    .oneOf(["admin", "user"], "Role harus 'admin' atau 'user'"),

  password: Yup.string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .matches(/[a-z]/, "Password harus mengandung huruf kecil")
    .matches(/[A-Z]/, "Password harus mengandung huruf besar")
    .matches(/[0-9]/, "Password harus mengandung angka")
    .matches(
      /\W/,
      "Password harus mengandung karakter spesial (selain huruf dan angka)",
    ),

  confirm_password: Yup.string()
    .required("Konfirmasi password harus diisi")
    .oneOf([Yup.ref("password")], "Password tidak sesuai"),

  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),

  contact: Yup.string()
    .matches(/^(\+\d{,3})?$/, "Nomor telepon tidak valid")
    .nullable(),

  address: Yup.string().nullable(),
});
