// src/pages/Settings/ValidatePassword.jsx
import * as Yup from "yup";

export const ValidatePassword = Yup.object().shape({
  current_password: Yup.string()
    .required("Password saat ini wajib diisi"),

  new_password: Yup.string()
    .required("Password baru wajib diisi")
    .min(6, "Password minimal 6 karakter"),

  validate_password: Yup.string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([Yup.ref("new_password")], "Password baru tidak sama"),
});
