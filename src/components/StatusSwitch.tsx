"use client";

interface StatusSwitchProps {
  status: "active" | "inactive";
  onToggle: (newStatus: "active" | "inactive") => void;
}

export default function StatusSwitch({ status, onToggle }: StatusSwitchProps) {
  const isActive = status === "active";

  return (
    <button
      onClick={() => onToggle(isActive ? "inactive" : "active")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isActive ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
