import type { User } from "../store/authSlice";

type NavItem = {
  to?: string;
  href?: string;
  scope?: string;
  roles?: string[];
  perm?: string;
  designation?: string;
  [key: string]: any;
};

export function canSeeNavigation(
  item: NavItem,
  user: User | null,
  role: string | null
): boolean {
  if (!user || !role) return false;

  // Platform only
  if (item.scope === "platform") {
    return role === "super_admin";
  }

  // Role based
  if (item.roles && item.roles.length > 0) {
    if (!item.roles.includes(role)) return false;
  }

  // Designation based (for staff)
  if (item.designation) {
    if (user.designation !== item.designation) return false;
  }

  // Permission based (simple check – aap apne permission system ke hisaab se expand kar sakte ho)
  if (item.perm) {
    // Agar aapke user object mein permissions array hai
    const perms: string[] = (user as any).permissions || [];
    if (perms.length > 0 && !perms.includes(item.perm)) {
      return false;
    }
  }

  return true;
}