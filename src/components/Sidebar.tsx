// import { usePathname, useRouter } from "expo-router";
// import {
//   Banknote,
//   BarChart3,
//   BedDouble,
//   Bell,
//   BookOpen,
//   BookOpenCheck,
//   Boxes,
//   Bus,
//   CalendarCheck,
//   CalendarDays,
//   ClipboardList,
//   CreditCard,
//   GraduationCap,
//   LayoutDashboard,
//   MessageSquare,
//   PartyPopper,
//   ScrollText,
//   UserPlus,
//   Users,
//   Wallet,
//   X,
// } from "lucide-react-native";
// import React from "react";
// import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// const school = {
//   shortName: "School ERP",
//   session: String(new Date().getFullYear()),
// };

// type MenuItem = {
//   href: string;
//   icon: React.ComponentType<any>;
//   label: string;
// };

// type Group = {
//   label: string;
//   items: MenuItem[];
// };

// const groups: Group[] = [
//   {
//     label: "Overview",
//     items: [{ href: "/(drawer)", icon: LayoutDashboard, label: "Dashboard" }],
//   },
//   {
//     label: "Academics",
//     items: [
//       {
//         href: "/(drawer)/attendance",
//         icon: CalendarCheck,
//         label: "Attendance",
//       },
//       { href: "/(drawer)/timetable", icon: CalendarDays, label: "Timetable" },
//       { href: "/(drawer)/homework", icon: BookOpenCheck, label: "Homework" },
//       {
//         href: "/(drawer)/examination",
//         icon: ClipboardList,
//         label: "Examination",
//       },
//       { href: "/(drawer)/report-card", icon: ScrollText, label: "Report Card" },
//       {
//         href: "/(drawer)/library",
//         icon: BookOpen,
//         label: "Library Management",
//       },
//       { href: "/(drawer)/add-student", icon: UserPlus, label: "Add Student" },
//       { href: "/(drawer)/students", icon: Users, label: "Student Database" },
//     ],
//   },
//   {
//     label: "Admissions & Outreach",
//     items: [
//       {
//         href: "/(drawer)/admission-enquiry",
//         icon: UserPlus,
//         label: "Admission Enquiry",
//       },
//       {
//         href: "/(drawer)/communication",
//         icon: MessageSquare,
//         label: "Communication",
//       },
//       { href: "/(drawer)/notice-board", icon: Bell, label: "Notice Board" },
//       { href: "/(drawer)/events", icon: PartyPopper, label: "Events" },
//     ],
//   },
//   {
//     label: "Finance",
//     items: [
//       {
//         href: "/(drawer)/fees-collection",
//         icon: Wallet,
//         label: "Fees Collection",
//       },
//       {
//         href: "/(drawer)/online-payment",
//         icon: CreditCard,
//         label: "Online Fees Payment",
//       },
//     ],
//   },
//   {
//     label: "Operations",
//     items: [
//       {
//         href: "/(drawer)/inventory",
//         icon: Boxes,
//         label: "Inventory Management",
//       },
//       { href: "/(drawer)/bus-tracking", icon: Bus, label: "Bus Tracking" },
//       { href: "/(drawer)/hostel", icon: BedDouble, label: "Hostel Management" },
//     ],
//   },
//   {
//     label: "Human Resources",
//     items: [
//       {
//         href: "/(drawer)/leave",
//         icon: CalendarDays,
//         label: "Leave Management",
//       },
//       { href: "/(drawer)/payroll", icon: Banknote, label: "Payroll / Salary" },
//     ],
//   },
//   {
//     label: "Insights",
//     items: [{ href: "/(drawer)/reports", icon: BarChart3, label: "Reports" }],
//   },
// ];

// export default function Sidebar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const isActive = (href: string) => {
//     if (href === "/(drawer)") {
//       return (
//         pathname === "/" ||
//         pathname === "/(drawer)" ||
//         pathname === "/(drawer)/"
//       );
//     }
//     return pathname.includes(href.replace("/(drawer)", ""));
//   };

//   return (
//     <View className="flex-1 bg-ink">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-5 h-16 border-b border-white/10">
//         <View className="flex-row items-center gap-2.5">
//           <View className="w-9 h-9 rounded-lg bg-amber items-center justify-center">
//             <GraduationCap size={20} color="#16213E" strokeWidth={2.5} />
//           </View>
//           <View>
//             <Text className="font-bold text-[15px] text-white tracking-tight">
//               {school.shortName}
//             </Text>
//             <Text className="text-[11px] text-white/50">
//               ERP · {school.session}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity onPress={() => router.back()} className="p-1">
//           <X size={20} color="rgba(255,255,255,0.6)" />
//         </TouchableOpacity>
//       </View>

//       {/* Menu */}
//       <ScrollView
//         contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {groups.map((group) => (
//           <View key={group.label} className="mb-5">
//             <Text className="px-3 mb-1.5 text-[11px] font-semibold text-white/35 tracking-wide">
//               {group.label}
//             </Text>

//             <View className="gap-0.5">
//               {group.items.map((item) => {
//                 const active = isActive(item.href);
//                 const Icon = item.icon;

//                 return (
//                   <TouchableOpacity
//                     key={item.href}
//                     onPress={() => {
//                       router.push(item.href as any);
//                     }}
//                     className={`flex-row items-center gap-3 px-3 py-2.5 rounded-lg ${
//                       active ? "bg-amber" : ""
//                     }`}
//                     activeOpacity={0.7}
//                   >
//                     <Icon
//                       size={17}
//                       color={active ? "#16213E" : "rgba(255,255,255,0.7)"}
//                       strokeWidth={2}
//                     />
//                     <Text
//                       className={`text-[13.5px] font-medium ${
//                         active ? "text-ink" : "text-white/70"
//                       }`}
//                     >
//                       {item.label}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Footer */}
//       <View className="p-4 border-t border-white/10">
//         <View className="rounded-xl bg-white/5 p-3.5">
//           <Text className="text-[12.5px] font-semibold text-white/90">
//             Need help?
//           </Text>
//           <Text className="text-[11.5px] text-white/50 mt-0.5 leading-relaxed">
//             Visit the admin support desk or call the IT helpdesk at ext. 204.
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// }


// components/Sidebar.tsx
// ya app/(drawer)/_layout ke under jahan aap use kar rahe ho

import { usePathname, useRouter } from "expo-router";
import {
  Banknote,
  BarChart3,
  BedDouble,
  Bell,
  BookOpen,
  BookOpenCheck,
  Boxes,
  Bus,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  PartyPopper,
  ScrollText,
  UserPlus,
  Users,
  Wallet,
  X,
  Building2,
  UserRoundCog,
  UserCog,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const school = {
  shortName: "School ERP",
  session: String(new Date().getFullYear()),
};

type MenuItem = {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  end?: boolean;
};

type Group = {
  label: string;
  items: MenuItem[];
};

const groups: Group[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/(drawer)",
        icon: LayoutDashboard,
        label: "Dashboard",
        end: true,
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        href: "/(drawer)/platform",
        icon: LayoutDashboard,
        label: "Platform Dashboard",
      },
      {
        href: "/(drawer)/platform/onboarding",
        icon: UserPlus,
        label: "School Onboarding",
      },
      {
        href: "/(drawer)/platform/schools",
        icon: Building2,
        label: "Schools Management",
      },
      {
        href: "/(drawer)/platform/users",
        icon: UserRoundCog,
        label: "Users & Access",
      },
      {
        href: "/(drawer)/platform/plans",
        icon: Banknote,
        label: "Plans & Pricing",
      },
      {
        href: "/(drawer)/platform/subscriptions",
        icon: CreditCard,
        label: "Subscriptions",
      },
      {
        href: "/(drawer)/platform/reports",
        icon: BarChart3,
        label: "Reports",
      },
      {
        href: "/(drawer)/platform/settings",
        icon: UserCog,
        label: "Settings",
      },
    ],
  },
  {
    label: "Academics",
    items: [
      {
        href: "/(drawer)/attendance",
        icon: CalendarCheck,
        label: "Attendance",
      },
      {
        href: "/(drawer)/timetable",
        icon: CalendarDays,
        label: "Timetable",
      },
      {
        href: "/(drawer)/homework",
        icon: BookOpenCheck,
        label: "Homework",
      },
      {
        href: "/(drawer)/examination",
        icon: ClipboardList,
        label: "Examination",
      },
      {
        href: "/(drawer)/report-card",
        icon: ScrollText,
        label: "Report Card",
      },
      {
        href: "/(drawer)/library",
        icon: BookOpen,
        label: "Library Management",
      },
      {
        href: "/(drawer)/add-student",
        icon: UserPlus,
        label: "Add Student",
      },
      {
        href: "/(drawer)/students",
        icon: Users,
        label: "Student Database",
      },
    ],
  },
  {
    label: "Admissions & Outreach",
    items: [
      {
        href: "/(drawer)/admission-enquiry",
        icon: UserPlus,
        label: "Admission Enquiry",
      },
      {
        href: "/(drawer)/communication",
        icon: MessageSquare,
        label: "Communication",
      },
      {
        href: "/(drawer)/notice-board",
        icon: Bell,
        label: "Notice Board",
      },
      {
        href: "/(drawer)/events",
        icon: PartyPopper,
        label: "Events",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        href: "/(drawer)/fees-collection",
        icon: Wallet,
        label: "Fees Collection",
      },
      {
        href: "/(drawer)/online-payment",
        icon: CreditCard,
        label: "Online Fees Payment",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/(drawer)/inventory",
        icon: Boxes,
        label: "Inventory Management",
      },
      {
        href: "/(drawer)/bus-tracking",
        icon: Bus,
        label: "Bus Tracking",
      },
      {
        href: "/(drawer)/hostel",
        icon: BedDouble,
        label: "Hostel Management",
      },
    ],
  },
  {
    label: "Human Resources",
    items: [
      {
        href: "/(drawer)/leave",
        icon: CalendarDays,
        label: "Leave Management",
      },
      {
        href: "/(drawer)/payroll",
        icon: Banknote,
        label: "Payroll / Salary",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        href: "/(drawer)/reports",
        icon: BarChart3,
        label: "Reports",
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, end?: boolean) => {
    if (href === "/(drawer)" || end) {
      return (
        pathname === "/" ||
        pathname === "/(drawer)" ||
        pathname === "/(drawer)/"
      );
    }

    const cleanHref = href.replace("/(drawer)", "");
    return pathname.includes(cleanHref);
  };

  return (
    <View className="flex-1 bg-ink">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 h-16 border-b border-white/10">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-lg bg-amber items-center justify-center">
            <GraduationCap size={20} color="#16213E" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="font-bold text-[15px] text-white tracking-tight">
              {school.shortName}
            </Text>
            <Text className="text-[11px] text-white/50">
              ERP · {school.session}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <X size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <ScrollView
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <View key={group.label} className="mb-5">
            <Text className="px-3 mb-1.5 text-[11px] font-semibold text-white/35 tracking-wide">
              {group.label}
            </Text>

            <View className="gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.end);
                const Icon = item.icon;

                return (
                  <TouchableOpacity
                    key={item.href}
                    onPress={() => router.push(item.href as any)}
                    className={`flex-row items-center gap-3 px-3 py-2.5 rounded-lg ${
                      active ? "bg-amber" : ""
                    }`}
                    activeOpacity={0.7}
                  >
                    <Icon
                      size={17}
                      color={active ? "#16213E" : "rgba(255,255,255,0.7)"}
                      strokeWidth={2}
                    />
                    <Text
                      className={`text-[13.5px] font-medium ${
                        active ? "text-ink" : "text-white/70"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="p-4 border-t border-white/10">
        <View className="rounded-xl bg-white/5 p-3.5">
          <Text className="text-[12.5px] font-semibold text-white/90">
            Need help?
          </Text>
          <Text className="text-[11.5px] text-white/50 mt-0.5 leading-relaxed">
            Visit the admin support desk or call the IT helpdesk at ext. 204.
          </Text>
        </View>
      </View>
    </View>
  );
}