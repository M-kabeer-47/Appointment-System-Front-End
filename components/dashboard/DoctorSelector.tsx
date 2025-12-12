import { User, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function DoctorSelector({
  doctors,
  selectedId,
  onSelect,
  loading,
}: DoctorSelectorProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => {
        const isSelected = selectedId === doctor.id;
        return (
          <div
            key={doctor.id}
            onClick={() => onSelect(doctor.id)}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
              isSelected
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-100 bg-white hover:border-blue-200"
            )}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/doctor.png"
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800">Dr. {doctor.name}</p>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">
                {doctor.email}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
