import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function AccountSettings({ user }) { // <-- tambahkan props user
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // State untuk loading dan pesan status
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [username, setUsername] = useState(user?.username || "")
  const [usernameMsg, setUsernameMsg] = useState("")

  // State untuk menampilkan/menyembunyikan password
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Handler untuk perubahan field password
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Handler untuk update username
  const handleChangeUsername = async () => {
    setUsernameMsg("")

    if (!username.trim()) {
      return setUsernameMsg("Username tidak boleh kosong.")
    }

    try {
      setLoading(true)

      // Contoh API:
      // await api.patch("/users/me", { username })

      setTimeout(() => {
        setLoading(false)
        setUsernameMsg("Username berhasil diupdate! (mock)")
      }, 700)

    } catch (err) {
      setLoading(false)
      setUsernameMsg("Gagal update username.")
    }
  }

  // Handler untuk update password
  const handleChangePassword = async () => {
    setMessage("")

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return setMessage("Semua field harus diisi.")
    }

    if (form.newPassword !== form.confirmPassword) {
      return setMessage("Password baru tidak sama.")
    }

    try {
      setLoading(true)

      // API call seharusnya ditaruh di sini
      // const res = await api.patch("/users/change-password", form)

      // Mock success
      setTimeout(() => {
        setLoading(false)
        setMessage("Password berhasil diupdate! (mock)")
      }, 800)

    } catch (error) {
      setLoading(false)
      setMessage("Gagal update password.")
    }
  }

  return (
    <div className="flex flex-col gap-4" autoComplete="off">

      {/* Bagian untuk mengganti username */}
      <div className="flex flex-col gap-2 mb-3">
        <h3 className="text-lg font-medium">Username</h3>
        <div className="flex items-center gap-4">
          <Label htmlFor="currentPassword" className="w-48">Current Password</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Username Baru"
            className="flex-1"
          />
          <Button
            disabled={loading}
            onClick={handleChangeUsername}
          >
            {loading ? "Saving..." : "Update"}
          </Button>
        </div>
        {usernameMsg && <p className="text-xs text-muted-foreground">{usernameMsg}</p>}
      </div>

      {/* Section Password */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-medium">Password</h3>

        {/* Current Password */}
        <div className="flex items-center gap-4">
          <Label htmlFor="currentPassword" className="w-48">Current Password</Label>
          <div className="relative flex-1">
            <Input
              id="currentPassword"
              type={showPass.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Masukkan Password Saat Ini"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, current: !showPass.current })
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

        {/* New Password */}
        <div className="flex items-center gap-4">
          <Label htmlFor="newPassword" className="w-48">New Password</Label>
          <div className="relative flex-1">
            <Input
              id="newPassword"
              type={showPass.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Masukkan Password Baru"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, new: !showPass.new })
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

        {/* Confirm New Password */}
        <div className="flex items-center gap-4">
          <Label htmlFor="confirmPassword" className="w-48">Confirm New Password</Label>
          <div className="relative flex-1">
            <Input
              id="confirmPassword"
              type={showPass.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi Password Baru"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() =>
                setShowPass({ ...showPass, confirm: !showPass.confirm })
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

        {/* Pesan status setelah update password */}
        {message && (
          <p className="text-xs text-muted-foreground">{message}</p>
        )}

        {/* Tombol submit update password */}
        <Button
          className="w-fit mt-3"
          disabled={loading}
          onClick={handleChangePassword}
        >
          {loading ? "Saving..." : "Update Password"}
        </Button>
      </div>
    </div>
  )
}