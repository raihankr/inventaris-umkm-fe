import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { apiPatch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext"
import { UPDATE_USER_PASSWORD, UPDATE_USER } from "@/constants/api/user";
import { ValidatePassword, ValidateUsername } from "./ValidatePassword";

export default function AccountSettings() {
  const { userInfo: user } = useAuth()
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    validate_password: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  const [username, setUsername] = useState(user?.username ?? "")
  const [usernameMsg, setUsernameMsg] = useState("")

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Handler untuk update username - MENGIKUTI PATTERN EditProfile
  const handleChangeUsername = async () => {
    setUsernameMsg("") // reset pesan

    try {
      // Validasi username dengan Yup
      await ValidateUsername.validate({ username }, { abortEarly: false });

      setLoading(true) // mulai loading

      // Payload - hanya kirim username yang diubah (seperti pattern EditProfile)
      const payload = {
        username: username
        // Tidak perlu kirim field lain yang tidak diubah
      };

      // Gunakan user.id_user seperti di EditProfile
      const userId = user?.id_user;

      if (!userId) {
        throw new Error('User ID tidak ditemukan');
      }

      // Panggil API sama persis seperti di EditProfile
      const res = await apiPatch(UPDATE_USER(userId), payload);

      if (!res.error) {
        setLoading(false);
        setUsernameMsg("Username berhasil diupdate!");
        return;
      }

      setLoading(false);
      setUsernameMsg(res.message || "Gagal update username.");

    } catch (err) {
      setLoading(false)

      // Error dari Yup untuk username
      if (err.path === 'username') {
        setUsernameMsg(err.message);
      } else {
        setUsernameMsg(err.message || "Gagal update username.");
      }
    }
  }

  // Handler untuk update password 
  const handleChangePassword = async () => {
    setMessage("") // reset pesan
    setErrors({}) // reset error (penting untuk Yup)

    try {
      await ValidatePassword.validate(form, { abortEarly: false })

      setLoading(true)

      const payload = {
        current_password: form.current_password,
        new_password: form.new_password,
        validate_password: form.validate_password,
      };

      // Deklarasi userId - pakai id_user
      const userId = user?.id_user;

      if (!userId) {
        throw new Error('User ID tidak ditemukan');
      }

      let endpoint;
      if (typeof UPDATE_USER_PASSWORD === 'function') {
        endpoint = UPDATE_USER_PASSWORD(userId);
      } else {
        endpoint = UPDATE_USER_PASSWORD;
      }

      const res = await apiPatch(endpoint, payload); // panggil API

      if (!res.error) {
        setLoading(false);
        setMessage("Password berhasil diupdate!");
        // Reset form setelah sukses
        setForm({
          current_password: "",
          new_password: "",
          validate_password: "",
        });
        return;
      }

      setLoading(false);

      // Validasi current password salah
      if (res.message?.toLowerCase().includes('current password') ||
        res.message?.toLowerCase().includes('password saat ini') ||
        res.message?.toLowerCase().includes('salah') ||
        res.error === 'INVALID_CURRENT_PASSWORD' ||
        res.status === 401) {
        setErrors({
          current_password: "Password saat ini tidak sesuai. Silakan cek kembali."
        });
      } else {
        setMessage(res.message || "Gagal update password.");
      }

    } catch (error) {
      setLoading(false)

      if (error.inner?.length > 0) { // jika error dari Yup
        const fieldErrors = {} // tampung error per-field
        error.inner.forEach((e) => {
          fieldErrors[e.path] = e.message
        })
        setErrors(fieldErrors) // tampilkan error ke UI
        return
      }

      // Validasi current password salah dari catch umum
      if (error.message?.toLowerCase().includes('current password') ||
        error.message?.toLowerCase().includes('password saat ini') ||
        error.message?.toLowerCase().includes('salah')) {
        setErrors({
          current_password: "Password saat ini tidak sesuai"
        });
      } else {
        setMessage(error.message || "Gagal update password.");
      }
    }
  }

  return (
    <div className="flex flex-col gap-4" autoComplete="off">

      {/* Section untuk update username user */}
      <div className="flex flex-col gap-2 mb-3">
        <h3 className="text-lg font-medium">Username</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="username" className="sm:w-48 w-full">New Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // update username state
            placeholder="Username Baru"
            className="flex-1"
          />
          <Button
            disabled={loading} // disable ketika proses berlangsung
            onClick={handleChangeUsername} // handler update
          >
            {loading ? "Saving..." : "Update"}
          </Button>
        </div>
        {usernameMsg && (
          <p className={`text-xs ${usernameMsg.includes('berhasil') ? 'text-green-500' : 'text-red-500'}`}>
            {usernameMsg}
          </p>
        )}
      </div>

      {/* Section Password */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-medium">Password</h3>

        {/* Current Password */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="current_password" className="sm:w-48 w-full">Current Password</Label>
          <div className="relative flex-1">
            <Input
              id="current_password"
              type={showPass.current ? "text" : "password"} // toggle lihat/sembunyikan password
              name="current_password"
              value={form.current_password}
              onChange={handleChange} // handler input
              placeholder="Password Saat Ini"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, current: !showPass.current }) // toggle icon eye
              }
            >
              {showPass.current ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {errors.current_password && <p className="text-xs text-red-500">{errors.current_password}</p>} {/* error dari Yup */}

        {/* New Password */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="new_password" className="sm:w-48 w-full">New Password</Label>
          <div className="relative flex-1">
            <Input
              id="new_password"
              type={showPass.new ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="Password Baru"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, new: !showPass.new }) // toggle lihat/sembunyi
              }
            >
              {showPass.new ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {errors.new_password && <p className="text-xs text-red-500">{errors.new_password}</p>} {/* error dari Yup */}

        {/* Confirm New Password */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="validate_password" className="sm:w-48 w-full">Confirm New Password</Label>
          <div className="relative flex-1">
            <Input
              id="validate_password"
              type={showPass.confirm ? "text" : "password"}
              name="validate_password"
              value={form.validate_password}
              onChange={handleChange}
              placeholder="Konfirmasi Password Baru"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, confirm: !showPass.confirm }) // toggle icon
              }
            >
              {showPass.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {errors.validate_password && <p className="text-xs text-red-500">{errors.validate_password}</p>} {/* error dari Yup */}

        {/* Pesan status setelah update password */}
        {message && (
          <p className={`text-xs ${message.includes('berhasil') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        {/* Tombol submit update password */}
        <Button
          className="w-fit mt-3"
          disabled={loading}
          onClick={handleChangePassword} // trigger validate + update
        >
          {loading ? "Saving..." : "Update Password"}
        </Button>
      </div>
    </div>
  )
}