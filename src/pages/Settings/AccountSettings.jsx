import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function AccountSettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // State untuk handle show/hide password
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // onChange handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Handler untuk ganti password (nanti tinggal nyambung API)
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

      // API CALL DI SIMPEN SINI 
      // const res = await api.patch("/users/change-password", form)

      // sementara:
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
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>

        <div className="relative">
          <Input
            id="currentPassword"
            type={showPass.current ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>

        <div className="relative">
          <Input
            id="newPassword"
            type={showPass.new ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPass.confirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
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

      {message && (
        <p className="text-xs text-muted-foreground">{message}</p>
      )}

      <Button
        className="w-fit mt-3"
        disabled={loading}
        onClick={handleChangePassword}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
