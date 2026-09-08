import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react-native";
import { selectRole, selectUser } from "../store/selectors";
import { logout, clearAuthStorage } from "../store/authSlice";

type TopbarProps = {
  onMenuClick: () => void;
  title: string;
};

const roleLabel = (role?: string | null, designation?: string) => {
  if (role === "super_admin") return "Platform Owner";
  if (role === "school_admin" || role === "admin") return "School Admin";
  if (role === "class_teacher" || role === "teacher") return "Class Teacher";
  if (role === "staff")
    return designation ? `Staff · ${designation}` : "Staff";
  if (role === "student" || role === "parent") return "Student / Parent";
  return "User";
};

function InitialsAvatar({ name }: { name?: string }) {
  const initials = (name || "U")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View className="w-9 h-9 rounded-full bg-ink items-center justify-center">
      <Text className="text-amber font-semibold text-[13px]">{initials}</Text>
    </View>
  );
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const handleLogout = async () => {
    await clearAuthStorage();
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <View className="h-16 bg-white border-b border-black/5 flex-row items-center justify-between px-4">
      {/* Left side */}
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onMenuClick} className="p-1 -ml-1">
          <Menu size={22} color="#16213E" />
        </TouchableOpacity>

        <Text className="font-semibold text-lg text-ink tracking-tight">
          {title}
        </Text>
      </View>

      {/* Right side */}
      <View className="flex-row items-center gap-3">
        {/* Search (optional - mobile pe hide kar sakte ho) */}
        <View className="hidden md:flex flex-row items-center gap-2 bg-paper rounded-full px-4 py-2 w-64 border border-black/5">
          <Search size={16} color="rgba(71,84,103,0.6)" />
          <TextInput
            placeholder="Search students, staff..."
            placeholderTextColor="rgba(71,84,103,0.5)"
            className="flex-1 text-[13px] text-ink"
          />
        </View>

        {/* Notification */}
        <TouchableOpacity className="relative w-9 h-9 rounded-full bg-paper border border-black/5 items-center justify-center">
          <Bell size={17} color="#16213E" />
          <View className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-alert" />
        </TouchableOpacity>

        {/* User Info */}
        <View className="flex-row items-center gap-2 pl-2">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <InitialsAvatar name={user?.name} />
          )}

          <View className="hidden sm:flex">
            <Text className="text-[13px] font-semibold text-ink">
              {user?.name || "User"}
            </Text>
            <Text className="text-[11px] text-slate-text/70 capitalize">
              {roleLabel(role, user?.designation)}
            </Text>
          </View>

          <ChevronDown size={15} color="rgba(71,84,103,0.5)" />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-9 h-9 rounded-full bg-paper border border-black/5 items-center justify-center"
        >
          <LogOut size={16} color="#16213E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}