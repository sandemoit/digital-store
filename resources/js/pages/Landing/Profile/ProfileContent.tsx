import { User } from "@/types";

interface ProfileContentProps {
  user: User;
}

export const ProfileContent = ({ user }: ProfileContentProps) => (
  <div className="p-6">
    <h2 className="text-lg font-semibold mb-6">Profile</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-sm text-gray-500">Nama Lengkap</div>
        <div>{user.name}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Email</div>
        <div>{user.email}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Negara</div>
        <div>Indonesia</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Member Sejak</div>
        <div>{user.created_at}</div>
      </div>
    </div>
  </div>
);
