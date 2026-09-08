import React from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { Menu, Search, Bell, ChevronDown } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TopbarProps = {
  title: string;
  onMenuClick: () => void;
};

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const [currentUser, setCurrentUser] = React.useState({
    name: "Administrator",
    role: "admin",
    avatar: "",
  });

  React.useEffect(() => {
    AsyncStorage.getItem("erp_user").then((raw) => {
      if (raw) {
        try {
          setCurrentUser(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  return (
    <View className="h-16 bg-white border-b border-black/5 flex-row items-center justify-between px-4">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onMenuClick} className="p-1 -ml-1">
          <Menu size={22} color="#16213E" />
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-ink tracking-tight">
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        {/* Search - optional on mobile */}
        <View className="hidden md:flex flex-row items-center gap-2 bg-paper rounded-full px-4 py-2 w-64 border border-black/5">
          <Search size={16} color="rgba(71,84,103,0.6)" />
          <TextInput
            placeholder="Search students, staff..."
            placeholderTextColor="rgba(71,84,103,0.5)"
            className="flex-1 text-[13px] text-ink"
          />
        </View>

        <TouchableOpacity className="relative w-9 h-9 rounded-full bg-paper border border-black/5 items-center justify-center">
          <Bell size={17} color="#16213E" />
          <View className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-alert" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 pl-2">
          {currentUser.avatar ? (
            <Image
              source={{ uri: currentUser.avatar }}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <View className="w-9 h-9 rounded-full bg-amber items-center justify-center">
              <Text className="font-bold text-ink">
                {currentUser.name.charAt(0)}
              </Text>
            </View>
          )}
          <View className="hidden sm:flex">
            <Text className="text-[13px] font-semibold text-ink">
              {currentUser.name}
            </Text>
            <Text className="text-[11px] text-slate-text/70">
              {currentUser.role}
            </Text>
          </View>
          <ChevronDown size={15} color="rgba(71,84,103,0.5)" />
        </View>
      </View>
    </View>
  );
}