import { CheckCircle } from "lucide-react";

interface FormMessagesProps {
  error: string | null;
  success: string | null;
}

export function FormMessages({ error, success }: FormMessagesProps) {
  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}
    </>
  );
}
