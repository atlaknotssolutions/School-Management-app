// // // import { usePathname, useRouter } from "expo-router";
// // // import {
// // //   Banknote,
// // //   BarChart3,
// // //   Building2,
// // //   CreditCard,
// // //   GraduationCap,
// // //   LayoutDashboard,
// // //   ScrollText,
// // //   Settings,
// // //   UserRoundCog,
// // //   X,
// // // } from "lucide-react-native";
// // // import React from "react";
// // // import {
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // // } from "react-native";
// // // import { useSelector } from "react-redux";
// // // import { canSeeNavigation } from "../lib/scope";
// // // import { selectSchool, selectUser } from "../store/selectors";

// // // type MenuItem = {
// // //   href: string;
// // //   icon: React.ComponentType<any>;
// // //   label: string;
// // //   end?: boolean;
// // //   scope?: string;
// // //   roles?: string[];
// // //   perm?: string;
// // //   designation?: string;
// // // };

// // // type Group = {
// // //   label: string;
// // //   items: MenuItem[];
// // // };

// // // type SidebarProps = {
// // //   navigation?: {
// // //     closeDrawer: () => void;
// // //   };
// // // };

// // // const groups: Group[] = [
// // //   {
// // //     label: "Platform",
// // //     items: [
// // //       {
// // //         href: "/(drawer)/platform",
// // //         icon: LayoutDashboard,
// // //         label: "Dashboard",
// // //         end: true,
// // //         scope: "platform",
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     label: "Billing & Insights",
// // //     items: [
// // //       {
// // //         href: "/(drawer)/platform/plans",
// // //         icon: Banknote,
// // //         label: "Plans & Pricing",
// // //         scope: "platform",
// // //       },
// // //       {
// // //         href: "/(drawer)/platform/subscriptions",
// // //         icon: CreditCard,
// // //         label: "Subscriptions",
// // //         scope: "platform",
// // //       },
// // //       {
// // //         href: "/(drawer)/platform/reports",
// // //         icon: BarChart3,
// // //         label: "Reports",
// // //         scope: "platform",
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     label: "School Management",
// // //     items: [
// // //       {
// // //         href: "/(drawer)/platform/schools",
// // //         icon: Building2,
// // //         label: "Schools Management",
// // //         scope: "platform",
// // //       },
// // //       {
// // //         href: "/(drawer)/platform/users",
// // //         icon: UserRoundCog,
// // //         label: "Users & Access",
// // //         scope: "platform",
// // //       },
// // //       {
// // //         href: "/(drawer)/platform/audit",
// // //         icon: ScrollText,
// // //         label: "Audit Logs",
// // //         scope: "platform",
// // //       },
// // //       {
// // //         href: "/(drawer)/platform/settings",
// // //         icon: Settings,
// // //         label: "Settings",
// // //         scope: "platform",
// // //       },
// // //     ],
// // //   },
// // // ];

// // // export default function Sidebar(props: SidebarProps) {
// // //   const router = useRouter();
// // //   const pathname = usePathname();
// // //   const school = useSelector(selectSchool);
// // //   const user = useSelector(selectUser);
// // //   const role = user?.role || "school_admin";

// // //   const canSee = (item: MenuItem) => canSeeNavigation(item, user, role);

// // //   const brandName = school?.shortName || "School ERP";
// // //   const brandSession = school?.session
// // //     ? `ERP · ${school.session}`
// // //     : `ERP · ${new Date().getFullYear()}`;

// // //   const isActive = (href: string) => {
// // //     if (href === "/(drawer)") {
// // //       return (
// // //         pathname === "/" ||
// // //         pathname === "/(drawer)" ||
// // //         pathname === "/(drawer)/"
// // //       );
// // //     }
// // //     return pathname.includes(href.replace("/(drawer)", ""));
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <View style={styles.brandRow}>
// // //           <View style={styles.logoBox}>
// // //             <GraduationCap size={20} color="#16213E" strokeWidth={2.5} />
// // //           </View>
// // //           <View>
// // //             <Text style={styles.brandName}>{brandName}</Text>
// // //             <Text style={styles.brandSub}>
// // //               {role === "super_admin" ? "Platform Owner" : brandSession}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity
// // //           onPress={() => props.navigation?.closeDrawer()}
// // //           style={styles.closeBtn}
// // //         >
// // //           <X size={20} color="rgba(255,255,255,0.6)" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Menu */}
// // //       <ScrollView
// // //         contentContainerStyle={styles.scrollContent}
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {groups.map((group) => {
// // //           const items = group.items.filter(canSee);
// // //           if (items.length === 0) return null;

// // //           return (
// // //             <View key={group.label} style={styles.group}>
// // //               <Text style={styles.groupLabel}>{group.label}</Text>

// // //               {items.map((item) => {
// // //                 const active = isActive(item.href);
// // //                 const Icon = item.icon;

// // //                 return (
// // //                   <TouchableOpacity
// // //                     key={item.href}
// // //                     onPress={() => {
// // //                       router.push(item.href as any);
// // //                       props.navigation?.closeDrawer();
// // //                     }}
// // //                     style={[styles.menuItem, active && styles.menuItemActive]}
// // //                     activeOpacity={0.7}
// // //                   >
// // //                     <Icon
// // //                       size={17}
// // //                       color={active ? "#16213E" : "rgba(255,255,255,0.7)"}
// // //                       strokeWidth={2}
// // //                     />
// // //                     <Text
// // //                       style={[styles.menuText, active && styles.menuTextActive]}
// // //                     >
// // //                       {item.label}
// // //                     </Text>
// // //                   </TouchableOpacity>
// // //                 );
// // //               })}
// // //             </View>
// // //           );
// // //         })}
// // //       </ScrollView>

// // //       {/* Footer */}
// // //       <View style={styles.footer}>
// // //         {school ? (
// // //           <View style={styles.schoolCard}>
// // //             <Text style={styles.schoolName}>{school.name}</Text>
// // //             <Text style={styles.schoolMeta}>
// // //               {school.code} · {school.session}
// // //             </Text>
// // //           </View>
// // //         ) : null}

// // //         <View style={styles.helpCard}>
// // //           <Text style={styles.helpTitle}>Need help?</Text>
// // //           <Text style={styles.helpText}>
// // //             Visit the admin support desk or call the IT helpdesk at ext. 204.
// // //           </Text>
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: "#16213E",
// // //   },
// // //   header: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 20,
// // //     height: 64,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "rgba(255,255,255,0.1)",
// // //   },
// // //   brandRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 10,
// // //   },
// // //   logoBox: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 10,
// // //     backgroundColor: "#E8A33D",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   brandName: {
// // //     fontSize: 15,
// // //     fontWeight: "700",
// // //     color: "#fff",
// // //   },
// // //   brandSub: {
// // //     fontSize: 11,
// // //     color: "rgba(255,255,255,0.5)",
// // //     marginTop: 1,
// // //   },
// // //   closeBtn: {
// // //     padding: 4,
// // //   },
// // //   scrollContent: {
// // //     paddingVertical: 16,
// // //     paddingHorizontal: 12,
// // //   },
// // //   group: {
// // //     marginBottom: 20,
// // //   },
// // //   groupLabel: {
// // //     paddingHorizontal: 12,
// // //     marginBottom: 6,
// // //     fontSize: 11,
// // //     fontWeight: "600",
// // //     color: "rgba(255,255,255,0.35)",
// // //     letterSpacing: 0.5,
// // //   },
// // //   menuItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 10,
// // //     borderRadius: 10,
// // //     marginBottom: 2,
// // //   },
// // //   menuItemActive: {
// // //     backgroundColor: "#E8A33D",
// // //   },
// // //   menuText: {
// // //     fontSize: 13.5,
// // //     fontWeight: "500",
// // //     color: "rgba(255,255,255,0.7)",
// // //   },
// // //   menuTextActive: {
// // //     color: "#16213E",
// // //   },
// // //   footer: {
// // //     padding: 16,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "rgba(255,255,255,0.1)",
// // //   },
// // //   schoolCard: {
// // //     backgroundColor: "rgba(255,255,255,0.05)",
// // //     borderRadius: 12,
// // //     padding: 14,
// // //     marginBottom: 12,
// // //   },
// // //   schoolName: {
// // //     fontSize: 12,
// // //     fontWeight: "600",
// // //     color: "rgba(255,255,255,0.9)",
// // //   },
// // //   schoolMeta: {
// // //     fontSize: 11,
// // //     color: "rgba(255,255,255,0.5)",
// // //     marginTop: 2,
// // //   },
// // //   helpCard: {
// // //     backgroundColor: "rgba(255,255,255,0.05)",
// // //     borderRadius: 12,
// // //     padding: 14,
// // //   },
// // //   helpTitle: {
// // //     fontSize: 12.5,
// // //     fontWeight: "600",
// // //     color: "rgba(255,255,255,0.9)",
// // //   },
// // //   helpText: {
// // //     fontSize: 11.5,
// // //     color: "rgba(255,255,255,0.5)",
// // //     marginTop: 2,
// // //     lineHeight: 16,
// // //   },
// // // });

// // // components/Sidebar.tsx
// // import {
// //   DrawerContentScrollView,
// //   DrawerItem,
// //   DrawerContentComponentProps,
// // import { usePathname, useRouter } from "expo-router";
// // import { View, Text, StyleSheet } from "react-native";
// // ;

// // const PLATFORM_MENU = [
// //   { label: "Dashboard", href: "/(drawer)/platform", icon: "grid-outline" },
// //   { label: "Plans & Pricing", href: "/(drawer)/platform/plans", icon: "pricetag-outline" },
// //   { label: "Subscriptions", href: "/(drawer)/platform/subscriptions", icon: "card-outline" },
// //   { label: "Reports", href: "/(drawer)/platform/reports", icon: "bar-chart-outline" },
// // ];

// // export default function Sidebar(props: DrawerContentComponentProps) {
// //   const router = useRouter();
// //   const pathname = usePathname();

// //   return (
// //     <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Platform</Text>
// //       </View>

// //       {PLATFORM_MENU.map((item) => {
// //         const isFocused =
// //           pathname === item.href ||
// //           (item.href === "/(drawer)/platform" && pathname === "/(drawer)/platform/");

// //         return (
// //           <DrawerItem
// //             key={item.href}
// //             label={item.label}
// //             icon={({ color, size }) => (
// //               <Ionicons name={item.icon as any} size={size} color={color} />
// //             )}
// //             focused={isFocused}
// //             activeTintColor="#4F46E5"
// //             inactiveTintColor="#A1A1AA"
// //             onPress={() => {
// //               router.push(item.href as any);
// //               props.navigation.closeDrawer();
// //             }}
// //           />
// //         );
// //       })}
// //     </DrawerContentScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   header: {
// //     padding: 20,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#2A2A4A",
// //     marginBottom: 8,
// //   },
// //   headerTitle: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "700",
// //   },
// // });

// import {
//   DrawerContentComponentProps,
//   DrawerContentScrollView,
//   DrawerItem,
// import { usePathname, useRouter } from "expo-router";
// import { StyleSheet, Text, View } from "react-native";
// const PLATFORM_MENU = [
//   { label: "Dashboard", href: "/(drawer)/platform", icon: "grid-outline" },
//   {
//     label: "Plans & Pricing",
//     href: "/(drawer)/platform/plans",
//     icon: "pricetag-outline",
//   },
//   {
//     label: "Subscriptions",
//     href: "/(drawer)/platform/subscriptions",
//     icon: "card-outline",
//   },
//   {
//     label: "Reports",
//     href: "/(drawer)/platform/reports",
//     icon: "bar-chart-outline",
//   },
// ];

// export default function Sidebar(props: DrawerContentComponentProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Platform</Text>
//       </View>

//       {PLATFORM_MENU.map((item) => {
//         const isFocused =
//           pathname === item.href ||
//           (item.href === "/(drawer)/platform" &&
//             (pathname === "/(drawer)/platform" ||
//               pathname === "/(drawer)/platform/"));

//         return (
//           <DrawerItem
//             key={item.href}
//             label={item.label}
//             icon={({ color, size }) => (
//               <Ionicons name={item.icon as any} size={size} color={color} />
//             )}
//             focused={isFocused}
//             activeTintColor="#4F46E5"
//             inactiveTintColor="#A1A1AA"
//             onPress={() => {
//               router.push(item.href as any);
//               props.navigation.closeDrawer();
//             }}
//           />
//         );
//       })}
//     </DrawerContentScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A4A",
//     marginBottom: 8,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLATFORM_MENU = [
  { label: "Dashboard", href: "/(drawer)/platform", icon: "grid-outline" },
  {
    label: "Plans & Pricing",
    href: "/(drawer)/platform/plans",
    icon: "pricetag-outline",
  },
  {
    label: "Subscriptions",
    href: "/(drawer)/platform/subscriptions",
    icon: "card-outline",
  },
  {
    label: "Reports",
    href: "/(drawer)/platform/reports",
    icon: "bar-chart-outline",
  },
  {
    label: "Schools Management",
    href: "/(drawer)/platform/(tabs)/schools",
    icon: "school-outline",
  },
  {
    label: "Users & Access",
    href: "/(drawer)/platform/(tabs)/users",
    icon: "people-outline",
  },
  {
    label: "Audit Logs",
    href: "/(drawer)/platform/(tabs)/audit",
    icon: "document-text-outline",
  },
  {
    label: "Settings",
    href: "/(drawer)/platform/(tabs)/settings",
    icon: "settings-outline",
  },
];

type SidebarProps = {
  navigation?: {
    closeDrawer: () => void;
  };
};

export default function Sidebar({ navigation }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Platform</Text>
      </View>

      {PLATFORM_MENU.map((item) => {
        const isFocused =
          pathname === item.href ||
          (item.href === "/(drawer)/platform" &&
            (pathname === "/(drawer)/platform" ||
              pathname === "/(drawer)/platform/"));

        return (
          <Pressable
            key={item.href}
            onPress={() => {
              router.push(item.href as any);
              navigation?.closeDrawer();
            }}
            style={[styles.item, isFocused && styles.itemFocused]}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={isFocused ? "#4F46E5" : "#A1A1AA"}
              style={styles.icon}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213E",
  },
  content: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A4A",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  itemFocused: {
    backgroundColor: "rgba(79, 70, 229, 0.15)",
  },
  icon: {
    marginRight: 14,
  },
  label: {
    color: "#A1A1AA",
    fontSize: 15,
    fontWeight: "500",
  },
  labelFocused: {
    color: "#4F46E5",
    fontWeight: "600",
  },
});
