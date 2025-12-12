import { useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";

interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  image?: string | null;
}

interface UseProfileReturn {
  loading: boolean;
  error: string | null;
  success: string | null;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  clearMessages: () => void;
}

export function useProfile(): UseProfileReturn {
  const { checkAuth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await axios.patch(
        "https://appointment-system-user-service.vercel.app/api/auth/profile",
        {
          name: data.name !== user?.name ? data.name : undefined,
          currentPassword: data.currentPassword || undefined,
          newPassword: data.newPassword || undefined,
          image: data.image !== user?.image ? data.image : undefined,
        },
        { withCredentials: true }
      );

      setSuccess("Profile updated successfully!");
      await checkAuth();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    updateProfile,
    clearMessages,
  };
}
