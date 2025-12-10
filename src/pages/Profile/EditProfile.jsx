import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ValidateProfile } from "./ValidateProfile";
import { apiPatch } from "@/lib/api";
import { UPDATE_USER } from "@/constants/api/user";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "../../lib/supabase.js";

export default function EditProfile({ onUpdate, onClose }) {
  const { userInfo: user, refetchAuthStatus } = useAuth();
  // State buat handle semua logic form data
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [contact, setcontact] = useState(user.contact ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.image || "");

  // State untuk error validasi (pake yup di validateprofile.jsx)
  const [errors, setErrors] = useState({});

  // Ref untuk input file avatar
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
      email,
      contact,
      address,
      image: user.image,
    };

    try {
      setErrors({}); // Reset error sebelum validasi ulang
      await ValidateProfile.validate(updatedUser, { abortEarly: false }); // Validasi form dengan Yup

      let payload; // payload adalah paket data berisi informasi user yang akan dikirim ke API
      if (avatarFile) {
        const { data } = await supabase.storage
          .from("fastock")
          .upload(`user/${user.id_user}`, avatarFile, {
            upsert: true,
            contentType: avatarFile.type,
          });

        payload = { ...updatedUser, image: data.path };
      } else {
        payload = updatedUser;
      }

      const res = await apiPatch(UPDATE_USER(user.id_user), payload);

      if (!res.error) {
        if (onUpdate) onUpdate(res.data); // kalau sukses, panggil callback parent
      } else {
        setErrors({ form: res.message }); // handle error dari API
      }
      refetchAuthStatus(); // Refresh data user di context setelah update
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
      console.error("Validation or Save Error:", err);
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
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Input field nomor telepon */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            name="contact"
            value={contact}
            onChange={(e) => setcontact(e.target.value)}
            placeholder="e.g. +62 812 3456 7890"
          />
          {errors.contact && (
            <p className="text-xs text-red-500">{errors.contact}</p>
          )}
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
      <div className="flex justify-between mt-4 sticky bottom-0 bg-background py-2 border-t">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
