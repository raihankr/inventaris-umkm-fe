import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Profile({ user, onEdit }) {
  // Mengamankan akses properti yang mungkin tidak ada
  // Misalnya, kalo user.contact atau user.address tidak ada
  const phone = user.contact || user.phone || '';
  const address = user.address || '';


  return (
    <div className="flex flex-col items-center gap-3">


      {/* Avatar */}
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.avatar || ""} alt={user.username || user.name || "user"} />
        <AvatarFallback>
          {(user.username?.[0] || user.name?.[0] || '?').toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Nama dan Username*/}
      <div className="w-full px-2 text-center">
        <p className="text-xl font-bold">{user.name || '-'}</p>
        <p className="text-sm font-semibold text-muted-foreground">{user.username || '-'}</p>
      </div>

      {/* Email, Role, Contact, Address */}
      <div className="w-full px-2">
        <div className="bg-muted/20 rounded-md p-3">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-muted-foreground">{user.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-semibold text-muted-foreground">{user.role || 'Karyawan'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="block text-sm font-semibold break-words hover:underline"
                >
                  {phone}
                </a>
              ) : (
                <p className="text-sm font-semibold text-muted-foreground">-</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              {address ? (
                <p className="text-sm font-semibold text-muted-foreground whitespace-pre-line break-words">
                  {address}
                </p>
              ) : (
                <p className="text-sm font-semibold text-muted-foreground">-</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Button Edit Profile */}
      <button
        onClick={onEdit}
        className="w-full px-3 py-2 rounded-md bg-accent hover:bg-accent/80 text-sm text-center font-medium"
      >
        Edit Profile
      </button>
    </div>
  );
}
