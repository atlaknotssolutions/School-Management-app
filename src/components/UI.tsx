import React from "react";
import { View, Text, Image } from "react-native";
import { LucideIcon } from "lucide-react-native";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  accent?: "amber" | "success" | "info" | "alert";
};

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "amber",
}: StatCardProps) {
  const accentMap = {
    amber: "bg-amber/15 text-amber",
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    alert: "bg-red-100 text-red-600",
  };

  return (
    <View className="bg-white rounded-2xl p-4 border border-black/5">
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mb-3 ${accentMap[accent]}`}
      >
        <Icon size={20} />
      </View>
      <Text className="text-[12px] text-slate-text/70 mb-1">{label}</Text>
      <Text className="text-xl font-bold text-ink">{value}</Text>
      <Text className="text-[11px] text-slate-text/60 mt-1">{sub}</Text>
    </View>
  );
}

type CardProps = {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, action, children, className = "" }: CardProps) {
  return (
    <View className={`bg-white rounded-2xl p-4 border border-black/5 ${className}`}>
      {(title || action) && (
        <View className="flex-row items-center justify-between mb-4">
          {title ? (
            <Text className="text-[15px] font-semibold text-ink">{title}</Text>
          ) : (
            <View />
          )}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

type PillProps = {
  children: React.ReactNode;
  tone?: string;
};

export function Pill({ children, tone = "amber" }: PillProps) {
  const tones: Record<string, string> = {
    amber: "bg-amber/15 text-amber",
    success: "bg-green-100 text-green-700",
    alert: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <View className={`px-2 py-0.5 rounded-full ${tones[tone] || tones.default}`}>
      <Text className="text-[11px] font-medium">{children}</Text>
    </View>
  );
}

export function statusTone(status: string) {
  const map: Record<string, string> = {
    New: "info",
    Pending: "amber",
    Approved: "success",
    Rejected: "alert",
    Live: "success",
    "Not tracking": "alert",
  };
  return map[status] || "default";
}

type AvatarProps = {
  src?: string;
  name: string;
  size?: number;
};

export function Avatar({ src, name, size = 30 }: AvatarProps) {
  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="bg-amber items-center justify-center"
    >
      <Text className="font-bold text-ink text-xs">{name.charAt(0)}</Text>
    </View>
  );
}