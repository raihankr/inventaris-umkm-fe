import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/reusable/button";
import { ValidateProfile } from "./ValidateProfile";

export default function EditProfile({ user, onUpdate, onClose }) {
  // Menyimpan data form
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.contact?.phone || "");
  const [address, setAddress] = useState(user.contact?.address || "");

  // Untuk preview & upload avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  // Menyimpan error validasi Yup
  const [errors, setErrors] = useState({});

  // Referensi input file agar bisa di-trigger manual
  const fileInputRef = useRef(null);

  // Handler ketika user pilih file
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Jika ada file, simpan dan tampilkan preview
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Logic tombol Save: validasi Yup → kirim data ke parent component
  const handleSave = async () => {
    const updatedUser = {
      name,
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
      if (err.inner && err.inner.length > 0) {
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
    <div className="flex flex-col gap-4 mt-2">

      {/* Upload avatar & preview */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={avatarPreview || "https://ui.shadcn.com/avatars/01.png"}
            alt={name}
          />
          <AvatarFallback>{name?.[0]}</AvatarFallback>
        </Avatar>

        {/* Tombol trigger input file */}
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
          className="hidden"
          id="avatar"
          name="avatar"
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Contact Number</Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +62 812 3456 7890"
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
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

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
