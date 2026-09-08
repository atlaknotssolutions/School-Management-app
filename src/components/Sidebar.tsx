import { usePathname, useRouter } from "expo-router";
import {
  Banknote,
  BarChart3,
  BedDouble,
  Bell,
  BookOpen,
  BookOpenCheck,
  Boxes,
  Building2,
  Bus,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  PartyPopper,
  ScrollText,
  UserCog,
  UserPlus,
  UserRoundCog,
  Users,
  Wallet,
  X,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { canSeeNavigation } from "../lib/scope";
import { selectSchool, selectUser } from "../store/selectors";

type MenuItem = {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  end?: boolean;
  scope?: string;
  roles?: string[];
  perm?: string;
  designation?: string;
};

type Group = {
  label: string;
  items: MenuItem[];
};

type SidebarProps = {
  navigation: {
    closeDrawer: () => void;
  };
};

const groups: Group[] = [
  {
    label: "Platform",
    items: [
      {
        href: "/(drawer)/platform",
        icon: LayoutDashboard,
        label: "Dashboard",
        end: true,
        scope: "platform",
      },
    ],
  },
  {
    label: "School Operations",
    items: [
      {
        href: "/(drawer)/platform/onboarding",
        icon: UserPlus,
        label: "School Onboarding",
        scope: "platform",
      },
      {
        href: "/(drawer)/platform/schools",
        icon: Building2,
        label: "Schools Management",
        scope: "platform",
      },
    ],
  },
  {
    label: "Access & Security",
    items: [
      {
        href: "/(drawer)/platform/users",
        icon: UserRoundCog,
        label: "Users & Access",
        scope: "platform",
      },
      {
        href: "/(drawer)/platform/audit",
        icon: ScrollText,
        label: "Audit Logs",
        scope: "platform",
      },
    ],
  },
  {
    label: "Billing & Monetization",
    items: [
      {
        href: "/(drawer)/platform/plans",
        icon: Banknote,
        label: "Plans & Pricing",
        scope: "platform",
      },
      {
        href: "/(drawer)/platform/subscriptions",
        icon: CreditCard,
        label: "Subscriptions",
        scope: "platform",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        href: "/(drawer)/platform/reports",
        icon: BarChart3,
        label: "Reports",
        scope: "platform",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/(drawer)/platform/settings",
        icon: UserCog,
        label: "Settings",
        scope: "platform",
      },
    ],
  },
  {
    label: "My Dashboards",
    items: [
      {
        href: "/(drawer)",
        icon: LayoutDashboard,
        label: "Admin Dashboard",
        end: true,
        roles: ["super_admin", "school_admin"],
      },
      {
        href: "/(drawer)/staff-dashboard",
        icon: LayoutDashboard,
        label: "My Dashboard",
        end: true,
        roles: ["staff"],
      },
      {
        href: "/(drawer)/admission-counsellor",
        icon: ClipboardList,
        label: "Counsellor Workspace",
        end: true,
        roles: ["staff"],
        designation: "admission_counsellor",
      },
      {
        href: "/(drawer)/teacher-dashboard",
        icon: UserCog,
        label: "Class Teacher",
        roles: ["school_admin", "class_teacher"],
      },
      {
        href: "/(drawer)/student-dashboard",
        icon: GraduationCap,
        label: "Student / Parent",
        roles: ["school_admin", "student"],
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
        perm: "attendance:read",
      },
      {
        href: "/(drawer)/timetable",
        icon: CalendarDays,
        label: "Timetable",
        perm: "timetable:read",
      },
      {
        href: "/(drawer)/homework",
        icon: BookOpenCheck,
        label: "Homework",
        perm: "homework:read",
      },
      {
        href: "/(drawer)/examination",
        icon: ClipboardList,
        label: "Examination",
        perm: "exams:read",
      },
      {
        href: "/(drawer)/report-card",
        icon: ScrollText,
        label: "Report Card",
        perm: "marks:read",
      },
      {
        href: "/(drawer)/library",
        icon: BookOpen,
        label: "Library Management",
        perm: "library:read",
      },
      {
        href: "/(drawer)/add-student",
        icon: UserPlus,
        label: "Add Student",
        perm: "students:write",
      },
      {
        href: "/(drawer)/students",
        icon: Users,
        label: "Student Database",
        perm: "students:read",
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
        perm: "admissions:read",
      },
      {
        href: "/(drawer)/communication",
        icon: MessageSquare,
        label: "Communication",
        roles: ["school_admin", "class_teacher", "staff"],
      },
      {
        href: "/(drawer)/notice-board",
        icon: Bell,
        label: "Notice Board",
        perm: "notices:read",
      },
      {
        href: "/(drawer)/events",
        icon: PartyPopper,
        label: "Events",
        perm: "events:read",
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
        perm: "fees:collect",
      },
      {
        href: "/(drawer)/online-payment",
        icon: CreditCard,
        label: "Online Fees Payment",
        perm: "fees:read",
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
        perm: "inventory:read",
      },
      {
        href: "/(drawer)/bus-tracking",
        icon: Bus,
        label: "Bus Tracking",
        perm: "transport:read",
      },
      {
        href: "/(drawer)/hostel",
        icon: BedDouble,
        label: "Hostel Management",
        perm: "hostel:read",
      },
    ],
  },
  {
    label: "Human Resources",
    items: [
      {
        href: "/(drawer)/leave",
        icon: FileBarChart2,
        label: "Leave Management",
        perm: "leaves:apply",
      },
      {
        href: "/(drawer)/payroll",
        icon: Banknote,
        label: "Payroll / Salary",
        perm: "payroll:view",
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
        perm: "reports:view",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        href: "/(drawer)/users",
        icon: UserRoundCog,
        label: "Users & Access",
        perm: "users:manage",
      },
    ],
  },
];

export default function Sidebar(props: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const school = useSelector(selectSchool);
  const user = useSelector(selectUser);
  const role = user?.role || "school_admin";

  const canSee = (item: MenuItem) => canSeeNavigation(item, user, role);

  const brandName = school?.shortName || "School ERP";
  const brandSession = school?.session
    ? `ERP · ${school.session}`
    : `ERP · ${new Date().getFullYear()}`;

  const isActive = (href: string) => {
    if (href === "/(drawer)") {
      return (
        pathname === "/" ||
        pathname === "/(drawer)" ||
        pathname === "/(drawer)/"
      );
    }
    return pathname.includes(href.replace("/(drawer)", ""));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <GraduationCap size={20} color="#16213E" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.brandName}>{brandName}</Text>
            <Text style={styles.brandSub}>
              {role === "super_admin" ? "Platform Owner" : brandSession}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          style={styles.closeBtn}
        >
          <X size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => {
          const items = group.items.filter(canSee);
          if (items.length === 0) return null;

          return (
            <View key={group.label} style={styles.group}>
              <Text style={styles.groupLabel}>{group.label}</Text>

              {items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <TouchableOpacity
                    key={item.href}
                    onPress={() => {
                      router.push(item.href as any);
                      props.navigation.closeDrawer();
                    }}
                    style={[styles.menuItem, active && styles.menuItemActive]}
                    activeOpacity={0.7}
                  >
                    <Icon
                      size={17}
                      color={active ? "#16213E" : "rgba(255,255,255,0.7)"}
                      strokeWidth={2}
                    />
                    <Text
                      style={[styles.menuText, active && styles.menuTextActive]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {school ? (
          <View style={styles.schoolCard}>
            <Text style={styles.schoolName}>{school.name}</Text>
            <Text style={styles.schoolMeta}>
              {school.code} · {school.session}
            </Text>
          </View>
        ) : null}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <Text style={styles.helpText}>
            Visit the admin support desk or call the IT helpdesk at ext. 204.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8A33D",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  brandSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    paddingHorizontal: 12,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: "#E8A33D",
  },
  menuText: {
    fontSize: 13.5,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
  },
  menuTextActive: {
    color: "#16213E",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  schoolCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  schoolName: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  schoolMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  helpCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
  },
  helpTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  helpText: {
    fontSize: 11.5,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    lineHeight: 16,
  },
});
