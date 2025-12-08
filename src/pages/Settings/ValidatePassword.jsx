import * as Yup from "yup";

export const ValidateUsername = Yup.object().shape({
  username: Yup.string()
    .required("Username tidak boleh kosong")
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter")
});

export const ValidatePassword = Yup.object().shape({        
  current_password: Yup.string()
    .required("Password saat ini wajib diisi"),

  new_password: Yup.string()
    .required("Password baru wajib diisi")
    .min(8, "Password minimal 6 karakter")
    .matches(/[a-z]/, "Password harus mengandung huruf kecil")
    .matches(/[A-Z]/, "Password harus mengandung huruf besar")
    .matches(/[0-9]/, "Password harus mengandung angka")
    .matches(
      /\S/,
      "Password harus mengandung karakter spesial (selain huruf dan angka)",
    ),

  validate_password: Yup.string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([Yup.ref("new_password")], "Password baru tidak sama"),
});