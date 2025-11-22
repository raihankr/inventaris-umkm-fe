// src/pages/Profile/Profile.jsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Profile({ user, onEdit }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar */}
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>

      {/* Nama, Email & Role */}
      <div className="text-center">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground mt-1">{user.role || 'Karyawan'}</p>
      </div>

      {/* Button Edit Profile */}
      <button
        onClick={onEdit}
        className="w-full mt-3 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 text-sm text-center"
      >
        Edit Profile
      </button>
    </div>
  );
}
