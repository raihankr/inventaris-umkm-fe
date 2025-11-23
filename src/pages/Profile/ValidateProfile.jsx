import * as Yup from "yup";

export const ValidateProfile = Yup.object().shape({
  name: Yup.string()
    .required("Nama wajib diisi")
    .min(3, "Nama minimal 3 karakter"),

  username: Yup.string()
    .required("Username wajib diisi")
    .min(3, "Username minimal 3 karakter"),

  email: Yup.string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),

  phone: Yup.string()
    .required("Nomor telepon wajib diisi")
    .matches(/^[0-9+\-\s]*$/, "Nomor telepon tidak valid"),

  address: Yup.string().nullable(),
});
