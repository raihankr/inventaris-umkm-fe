import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Empty } from "@/components/ui/empty";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/reusable/button";

export default function EditProfile({ user, onUpdate, onClose }) {
  // State untuk menyimpan input user
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.contact?.phone || '');
  const [address, setAddress] = useState(user.contact?.address || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const fileInputRef = useRef(null); // Untuk mengakses input file secara langsung

  // Menghandle perubahan file avatar dan membuat preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Menyimpan perubahan profil
  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      email,
      contact: {
        ...user.contact,
        phone,
        address,
      },
      avatar: avatarPreview,
    };
    if (onUpdate) onUpdate(updatedUser);
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        {avatarPreview ? (
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarPreview} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Empty className="h-20 w-20 text-center">Please upload your photo</Empty>
        )}
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
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <Label>Contact Number</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1">
        <Label>Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {/* Buttons: Tutup left, Save right */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
