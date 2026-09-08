// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   ViewStyle,
//   TextStyle,
// } from "react-native";
// import { LucideIcon } from "lucide-react-native";

// // ========== StatCard ==========
// type StatCardProps = {
//   icon?: LucideIcon;
//   label: string;
//   value: string | number;
//   sub?: string;
//   accent?: "amber" | "success" | "info" | "alert";
// };

// export function StatCard({
//   icon: Icon,
//   label,
//   value,
//   sub,
//   accent = "amber",
// }: StatCardProps) {
//   const accents: Record<string, string> = {
//     amber: "border-l-amber bg-amber/10",
//     success: "border-l-success bg-success/10",
//     info: "border-l-info bg-info/10",
//     alert: "border-l-alert bg-alert/10",
//   };

//   const iconTones: Record<string, string> = {
//     amber: "bg-amber/15 text-amber",
//     success: "bg-success/15 text-success",
//     info: "bg-info/15 text-info",
//     alert: "bg-alert/15 text-alert",
//   };

//   return (
//     <View
//       className={`bg-white rounded-2xl p-4 border-l-4 shadow-sm ${accents[accent]}`}
//     >
//       <View className="flex-row items-start justify-between">
//         <View className="flex-1">
//           <Text className="text-[12.5px] text-slate-text/80 font-medium">
//             {label}
//           </Text>
//           <Text className="text-[24px] font-bold text-ink mt-1 leading-none">
//             {value}
//           </Text>
//           {sub ? (
//             <Text className="text-[11.5px] text-slate-text/60 mt-2">{sub}</Text>
//           ) : null}
//         </View>

//         {Icon ? (
//           <View
//             className={`w-10 h-10 rounded-xl items-center justify-center ${iconTones[accent]}`}
//           >
//             <Icon size={19} />
//           </View>
//         ) : null}
//       </View>
//     </View>
//   );
// }

// // ========== Card ==========
// type CardProps = {
//   title?: string;
//   action?: React.ReactNode;
//   children: React.ReactNode;
//   className?: string;
//   bodyClassName?: string;
// };

// export function Card({
//   title,
//   action,
//   children,
//   className = "",
//   bodyClassName = "p-4",
// }: CardProps) {
//   return (
//     <View
//       className={`bg-white rounded-2xl border border-black/5 shadow-sm ${className}`}
//     >
//       {title ? (
//         <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-black/5">
//           <Text className="font-semibold text-ink text-[15px]">{title}</Text>
//           {action}
//         </View>
//       ) : null}
//       <View className={bodyClassName}>{children}</View>
//     </View>
//   );
// }

// // ========== Pill ==========
// type PillProps = {
//   children: React.ReactNode;
//   tone?: "neutral" | "success" | "alert" | "amber" | "info";
// };

// export function Pill({ children, tone = "neutral" }: PillProps) {
//   const tones: Record<string, string> = {
//     neutral: "bg-slate-100",
//     success: "bg-success/10",
//     alert: "bg-alert/10",
//     amber: "bg-amber/15",
//     info: "bg-info/10",
//   };

//   const textTones: Record<string, string> = {
//     neutral: "text-slate-600",
//     success: "text-success",
//     alert: "text-alert",
//     amber: "text-amber-dark",
//     info: "text-info",
//   };

//   return (
//     <View className={`px-2.5 py-1 rounded-full ${tones[tone]}`}>
//       <Text className={`text-[11.5px] font-semibold ${textTones[tone]}`}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// // ========== statusTone ==========
// export function statusTone(status?: string): PillProps["tone"] {
//   const map: Record<string, PillProps["tone"]> = {
//     Paid: "success",
//     Success: "success",
//     Submitted: "success",
//     Graded: "success",
//     "Admission Confirmed": "success",
//     "On Route": "success",
//     Present: "success",
//     Pending: "amber",
//     "Partially Paid": "amber",
//     "Pending Clearance": "amber",
//     New: "info",
//     Contacted: "info",
//     "Campus Visit Scheduled": "info",
//     "Not Started": "info",
//     Overdue: "alert",
//     Declined: "alert",
//     Absent: "alert",
//     Delayed: "alert",
//   };
//   return map[status || ""] || "neutral";
// }

// // ========== Avatar ==========
// type AvatarProps = {
//   src?: string;
//   name?: string;
//   size?: number;
// };

// export function Avatar({ src, name, size = 32 }: AvatarProps) {
//   if (src) {
//     return (
//       <Image
//         source={{ uri: src }}
//         style={{ width: size, height: size, borderRadius: size / 2 }}
//       />
//     );
//   }

//   const initials = (name || "U")
//     .split(" ")
//     .map((p) => p[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <View
//       style={{ width: size, height: size, borderRadius: size / 2 }}
//       className="bg-ink items-center justify-center"
//     >
//       <Text className="text-amber font-semibold text-xs">{initials}</Text>
//     </View>
//   );
// }

// // ========== PageIntro ==========
// type PageIntroProps = {
//   eyebrow?: string;
//   title: string;
//   description?: string;
//   right?: React.ReactNode;
// };

// export function PageIntro({
//   eyebrow,
//   title,
//   description,
//   right,
// }: PageIntroProps) {
//   return (
//     <View className="mb-5">
//       <View className="flex-row items-end justify-between gap-4">
//         <View className="flex-1">
//           {eyebrow ? (
//             <Text className="text-[12.5px] font-semibold text-amber-dark mb-1">
//               {eyebrow}
//             </Text>
//           ) : null}
//           <Text className="text-2xl font-bold text-ink">{title}</Text>
//           {description ? (
//             <Text className="text-slate-text text-[13.5px] mt-1">
//               {description}
//             </Text>
//           ) : null}
//         </View>
//         {right}
//       </View>
//     </View>
//   );
// }

// // ========== Button ==========
// type ButtonProps = {
//   children: React.ReactNode;
//   variant?: "primary" | "amber" | "outline" | "ghost";
//   className?: string;
//   onPress?: () => void;
//   disabled?: boolean;
// };

// export function Button({
//   children,
//   variant = "primary",
//   className = "",
//   onPress,
//   disabled,
// }: ButtonProps) {
//   const variants: Record<string, string> = {
//     primary: "bg-ink",
//     amber: "bg-amber",
//     outline: "bg-white border border-black/10",
//     ghost: "bg-transparent",
//   };

//   const textVariants: Record<string, string> = {
//     primary: "text-white",
//     amber: "text-ink",
//     outline: "text-ink",
//     ghost: "text-ink",
//   };

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       disabled={disabled}
//       activeOpacity={0.8}
//       className={`flex-row items-center justify-center gap-2 px-4 py-2.5 rounded-lg ${variants[variant]} ${className} ${
//         disabled ? "opacity-60" : ""
//       }`}
//     >
//       <Text className={`text-[13px] font-semibold ${textVariants[variant]}`}>
//         {children}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// // ========== Input ==========
// type InputProps = {
//   className?: string;
//   [key: string]: any;
// };

// export function Input({ className = "", ...props }: InputProps) {
//   return (
//     <TextInput
//       className={`px-3.5 py-2.5 rounded-lg border border-black/10 text-[13px] bg-white text-ink ${className}`}
//       placeholderTextColor="rgba(71,84,103,0.5)"
//       {...props}
//     />
//   );
// }

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LucideIcon } from "lucide-react-native";

// Colors
const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  success: "#3F8F5F",
  info: "#3B6FA0",
  alert: "#D65A4A",
  paper: "#F7F5F0",
  slate: "#475467",
  white: "#FFFFFF",
  border: "rgba(0,0,0,0.06)",
};

// ========== StatCard ==========
type StatCardProps = {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
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
    amber: { border: colors.amber, bg: "rgba(232,163,61,0.1)", iconBg: "rgba(232,163,61,0.15)" },
    success: { border: colors.success, bg: "rgba(63,143,95,0.1)", iconBg: "rgba(63,143,95,0.15)" },
    info: { border: colors.info, bg: "rgba(59,111,160,0.1)", iconBg: "rgba(59,111,160,0.15)" },
    alert: { border: colors.alert, bg: "rgba(214,90,74,0.1)", iconBg: "rgba(214,90,74,0.15)" },
  };
  const a = accentMap[accent];

  return (
    <View style={[styles.statCard, { borderLeftColor: a.border }]}>
      <View style={styles.statRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
        </View>
        {Icon ? (
          <View style={[styles.statIcon, { backgroundColor: a.iconBg }]}>
            <Icon size={19} color={a.border} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ========== Card ==========
type CardProps = {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
};

export function Card({ title, action, children, style, bodyStyle }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          {action}
        </View>
      ) : null}
      <View style={[styles.cardBody, bodyStyle]}>{children}</View>
    </View>
  );
}

// ========== Pill ==========
type PillProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "alert" | "amber" | "info";
};

export function Pill({ children, tone = "neutral" }: PillProps) {
  const tones = {
    neutral: { bg: "#F1F5F9", text: "#475569" },
    success: { bg: "rgba(63,143,95,0.1)", text: colors.success },
    alert: { bg: "rgba(214,90,74,0.1)", text: colors.alert },
    amber: { bg: "rgba(232,163,61,0.15)", text: colors.amberDark },
    info: { bg: "rgba(59,111,160,0.1)", text: colors.info },
  };
  const t = tones[tone];

  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.text }]}>{children}</Text>
    </View>
  );
}

// ========== PageIntro ==========
type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
};

export function PageIntro({ eyebrow, title, description, right }: PageIntroProps) {
  return (
    <View style={styles.pageIntro}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.pageTitle}>{title}</Text>
        {description ? <Text style={styles.pageDesc}>{description}</Text> : null}
      </View>
      {right}
    </View>
  );
}

// ========== Avatar ==========
type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
};

export function Avatar({ src, name, size = 32 }: AvatarProps) {
  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  const initials = (name || "U")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: colors.amber, fontWeight: "600", fontSize: 12 }}>
        {initials}
      </Text>
    </View>
  );
}

// ========== Button ==========
type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "amber" | "outline" | "ghost";
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  children,
  variant = "primary",
  onPress,
  disabled,
  style,
}: ButtonProps) {
  const variants = {
    primary: { bg: colors.ink, text: "#fff" },
    amber: { bg: colors.amber, text: colors.ink },
    outline: { bg: "#fff", text: colors.ink, border: true },
    ghost: { bg: "transparent", text: colors.ink },
  };
  const v = variants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: v.bg, opacity: disabled ? 0.6 : 1 },
        v.border ? { borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" } : null,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: v.text }]}>{children}</Text>
    </TouchableOpacity>
  );
}

// ========== Styles ==========
const styles = StyleSheet.create({
  // StatCard
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.8)",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 4,
  },
  statSub: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  cardBody: {
    padding: 16,
  },

  // Pill
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: "600",
  },

  // PageIntro
  pageIntro: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.amberDark,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
  },
  pageDesc: {
    fontSize: 13.5,
    color: colors.slate,
    marginTop: 4,
    lineHeight: 20,
  },

  // Button
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});