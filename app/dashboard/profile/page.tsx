"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  ProfileAvatar,
  PasswordInput,
  FormMessages,
} from "@/components/profile";

// Zod schema for profile form
const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If new password is provided, current password is required
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to change password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // If current password is provided, new password is required
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // New password must be at least 6 characters
      if (data.newPassword && data.newPassword.length < 6) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be at least 6 characters",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // Passwords must match
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { loading, error, success, updateProfile, clearMessages } =
    useProfile();
  const [image, setImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setImage(user.image || null);
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    const success = await updateProfile({
      name: data.name,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      image,
    });

    if (success) {
      // Reset password fields on success
      reset({
        name: data.name,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <ProfileAvatar image={image} onImageChange={setImage} />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Your name" />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="rounded-xl bg-slate-50"
              />
              <p className="text-xs text-slate-400">Email cannot be changed</p>
            </div>

            {/* Password Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Change Password
              </h3>

              <div className="space-y-6">
                <PasswordInput
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                  control={control}
                  error={errors.currentPassword?.message}
                />

                <PasswordInput
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  control={control}
                  error={errors.newPassword?.message}
                />

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            <FormMessages error={error} success={success} />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 rounded-xl h-12"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
