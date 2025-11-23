import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Profile({ user, onEdit }) {
  // Mengamankan akses properti yang mungkin tidak ada
  // Misalnya, kalo user.contact atau user.address tidak ada
  const phone = user.phone || user.contact?.phone || ''; 
  const address = user.address || user.contact?.address || '';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar */}
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name?.[0] ?? '?'}</AvatarFallback>
      </Avatar>

      {/* Nama, Email & Role */}
      <div className="text-center">
        <p className="font-semibold text-lg">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-xs text-muted-foreground mt-1">{user.role || 'Karyawan'}</p>
      </div>

      {/* Contact & Address */}
      <div className="w-full px-2">
        <div className="bg-muted/20 rounded-md p-3">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              {phone ? (
                <a href={`tel:${phone}`} className="block text-sm break-words hover:underline">
                  {phone}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              {address ? (
                <p className="text-sm text-muted-foreground whitespace-pre-line break-words">{address}</p>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
          </div>
        </div>
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
