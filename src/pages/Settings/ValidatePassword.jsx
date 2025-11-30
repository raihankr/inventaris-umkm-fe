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
    .min(6, "Password minimal 6 karakter"),

  validate_password: Yup.string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([Yup.ref("new_password")], "Password baru tidak sama"),
});