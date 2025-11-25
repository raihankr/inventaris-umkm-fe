import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ValidateProfile } from "./ValidateProfile";

export default function EditProfile({ user, onUpdate, onClose }) {
  // State buat handle semua logic form data
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.contact?.phone || "");
  const [address, setAddress] = useState(user.contact?.address || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");

  // State untuk error validasi (pake yup di validateprofile.jsx)
  const [errors, setErrors] = useState({});

  // Ref untuk input file
  const fileInputRef = useRef(null);

  // Handler untuk perubahan file avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handler untuk simpan data
  const handleSave = async () => {
    const updatedUser = {
      name,
      username,
      email,
      phone,
      address,
      avatar: avatarPreview,
    };

    try {
      // Reset error sebelum validasi ulang
      setErrors({});
      // Validasi form dengan Yup
      await ValidateProfile.validate(updatedUser, { abortEarly: false });
      // Jika valid, kirim data ke parent untuk disimpan / API call
      if (onUpdate) onUpdate(updatedUser);
    } catch (err) {
      if (err.inner?.length > 0) {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        // fallback async Yup error
        setErrors({ form: err.message });
      }
    }
  };

  return (
    // Container utama, ada scroll bar yg udah di hide
    <div className="max-h-[65vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="flex flex-col gap-4 mt-2 pr-2">
        {/* Section avatar */}
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarPreview || "https://ui.shadcn.com/avatars/01.png"}
              alt={name}
            />
            <AvatarFallback>{name?.[0]}</AvatarFallback>
          </Avatar>

          <button
            className="px-3 py-1 rounded border hover:bg-gray-100"
            onClick={() => fileInputRef.current.click()}
          >
            Choose File
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            id="avatar"
            name="avatar"
            className="hidden"
          />
        </div>

        {/* Input field nama */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Input field username */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username}</p>
          )}
        </div>

        {/* Input field email */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Input field nomor telepon */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="phone">Contact Number</Label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +62 812 3456 7890"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Input field alamat */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Footer Isinya Button */}
      <div className="flex justify-between mt-4 sticky bottom-0 bg-white py-2 border-t">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}