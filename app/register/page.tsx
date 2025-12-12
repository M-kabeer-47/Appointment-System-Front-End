"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stethoscope,
  Mail,
  Lock,
  User,
  ArrowRight,
  UserRound,
  Briefcase,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const registerSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PATIENT", "DOCTOR"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    loading,
    error: authError,
    clearError,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PATIENT",
    },
  });

  useEffect(() => {
    return () => clearError();
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      router.push("/login");
    } catch {
      // error handled in hook
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <UserRound className="w-20 h-20 text-white/90" />
              <Briefcase className="w-20 h-20 text-white/90" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center">
            Join Our Community
          </h2>
          <p className="text-xl text-blue-100 text-center max-w-md">
            Connect with healthcare professionals or offer your medical
            expertise.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              MediBook
            </span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Get started with your healthcare journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Full Name
              </Label>
              <div className="relative">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className={cn(
                          "pl-10 h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary",
                          errors.name &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                        {...field}
                      />
                    </>
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className={cn(
                          "pl-10 h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary",
                          errors.email &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                        {...field}
                      />
                    </>
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "pl-10 h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary",
                          errors.password &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                        {...field}
                      />
                    </>
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                I am a
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => field.onChange("PATIENT")}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        field.value === "PATIENT"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <UserRound
                        className={cn(
                          "w-8 h-8 mx-auto mb-2",
                          field.value === "PATIENT"
                            ? "text-primary"
                            : "text-slate-400"
                        )}
                      />
                      <p
                        className={cn(
                          "font-semibold",
                          field.value === "PATIENT"
                            ? "text-primary"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        Patient
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Book appointments
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("DOCTOR")}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        field.value === "DOCTOR"
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <Briefcase
                        className={cn(
                          "w-8 h-8 mx-auto mb-2",
                          field.value === "DOCTOR"
                            ? "text-primary"
                            : "text-slate-400"
                        )}
                      />
                      <p
                        className={cn(
                          "font-semibold",
                          field.value === "DOCTOR"
                            ? "text-primary"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        Doctor
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Manage patients
                      </p>
                    </button>
                  </div>
                )}
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/90"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
