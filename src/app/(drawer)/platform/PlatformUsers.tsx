// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   StyleSheet,
//   Modal,
//   Alert,
//   FlatList,
//   Switch,
// } from "react-native";
// import {
//   Plus,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Trash2,
//   RotateCcw,
//   Ban,
//   CheckCircle2,
//   Eye,
//   FilterX,
//   Building2,
// } from "lucide-react-native";
// import { api } from "@/lib/api";
// import { Card, PageIntro, Pill } from "@/components/UI";
// import * as Clipboard from "expo-clipboard";

// const colors = {
//   ink: "#16213E",
//   amber: "#E8A33D",
//   amberDark: "#C9832A",
//   paper: "#F7F5F0",
//   slate: "#475467",
//   info: "#3B6FA0",
//   alert: "#D65A4A",
//   success: "#3F8F5F",
//   border: "rgba(0,0,0,0.06)",
// };

// const ROLE_LABELS: Record<string, string> = {
//   super_admin: "Platform Owner",
//   school_admin: "School Admin",
//   class_teacher: "Class Teacher",
//   staff: "Staff",
//   student: "Student",
// };

// const DESIGNATION_OPTIONS = [
//   "admission_counsellor",
//   "accountant",
//   "librarian",
//   "receptionist",
//   "transport",
// ];

// const DESIGNATION_LABELS: Record<string, string> = {
//   admission_counsellor: "Admission Counsellor",
//   accountant: "Accountant",
//   librarian: "Librarian",
//   receptionist: "Receptionist",
//   transport: "Transport Coordinator",
// };

// const REF_ID_FIELDS: Record<
//   string,
//   { label: string; placeholder: string; required?: boolean; disabled?: boolean } | null
// > = {
//   student: {
//     label: "Admission ID",
//     placeholder: "Enter Admission ID",
//     required: true,
//   },
//   staff: { label: "Staff ID", placeholder: "Enter Staff ID", required: false },
//   class_teacher: {
//     label: "Staff ID",
//     placeholder: "Enter Staff ID",
//     required: false,
//   },
//   school_admin: {
//     label: "Ref ID",
//     disabled: true,
//     placeholder: "Not required for this role",
//   },
//   super_admin: null,
// };

// const fmtDate = (value?: string) =>
//   value
//     ? new Date(value).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const initials = (name = "U") =>
//   name
//     .split(" ")
//     .map((p) => p[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

// type FormState = {
//   schoolId: string;
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   designation: string;
//   className: string;
//   section: string;
//   refId: string;
// };

// const emptyForm = (): FormState => ({
//   schoolId: "",
//   name: "",
//   email: "",
//   password: "",
//   role: "school_admin",
//   designation: "",
//   className: "",
//   section: "",
//   refId: "",
// });

// export default function PlatformUsers() {
//   const [rows, setRows] = useState<any[]>([]);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(0);
//   const [page, setPage] = useState(1);
//   const [q, setQ] = useState("");
//   const [debouncedQ, setDebouncedQ] = useState("");
//   const [role, setRole] = useState("");
//   const [schoolId, setSchoolId] = useState("");
//   const [includeDeleted, setIncludeDeleted] = useState(false);
//   const [schools, setSchools] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [selected, setSelected] = useState<any>(null);
//   const [creating, setCreating] = useState(false);
//   const [form, setForm] = useState<FormState>(emptyForm());
//   const [busy, setBusy] = useState(false);
//   const [createdCredential, setCreatedCredential] = useState<any>(null);

//   // dropdown open states
//   const [openRole, setOpenRole] = useState(false);
//   const [openSchool, setOpenSchool] = useState(false);
//   const [openFormRole, setOpenFormRole] = useState(false);
//   const [openFormSchool, setOpenFormSchool] = useState(false);
//   const [openDesignation, setOpenDesignation] = useState(false);

//   useEffect(() => {
//     api.schools
//       .list()
//       .then(({ data }: any) => setSchools(data || []))
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedQ(q), 350);
//     return () => clearTimeout(timer);
//   }, [q]);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
//     if (role) params.set("role", role);
//     if (schoolId) params.set("schoolId", schoolId);
//     if (includeDeleted) params.set("includeDeleted", "true");
//     params.set("page", String(page));
//     params.set("limit", "20");

//     setLoading(true);
//     api.platform.users
//       .list(params.toString())
//       .then((result: any) => {
//         setRows(result.data || []);
//         setTotal(result.total || 0);
//         setPages(result.pages || 0);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [debouncedQ, role, schoolId, includeDeleted, page, refreshKey]);

//   const schoolNameOf = (id?: string) =>
//     schools.find((s) => String(s._id || s.id) === String(id))?.name || "—";

//   const refresh = () => setRefreshKey((k) => k + 1);
//   const resetForm = () => setForm(emptyForm());

//   const open360 = async (userId: string) => {
//     setBusy(true);
//     try {
//       const { data } = await api.platform.users.get360(userId);
//       setSelected(data);
//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setBusy(false);
//     }
//   };

//   const toggleActive = (user: any) => {
//     Alert.alert(
//       user.isActive ? "Deactivate" : "Activate",
//       `${user.isActive ? "Deactivate" : "Activate"} ${user.name}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Confirm",
//           onPress: async () => {
//             try {
//               await api.platform.users.setStatus(user._id, !user.isActive);
//               Alert.alert(
//                 "Done",
//                 user.isActive ? "User deactivated" : "User activated"
//               );
//               refresh();
//               if (selected?.user?._id === user._id) open360(user._id);
//             } catch (err: any) {
//               Alert.alert("Error", err.message);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const removeUser = (user: any) => {
//     Alert.alert(
//       "Remove user",
//       `Remove ${user.name} (${user.email})? Access is revoked and history is preserved.`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await api.platform.users.remove(user._id);
//               Alert.alert("Done", "User removed");
//               refresh();
//               if (selected?.user?._id === user._id) setSelected(null);
//             } catch (err: any) {
//               Alert.alert("Error", err.message);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const restoreUser = async (user: any) => {
//     try {
//       await api.platform.users.restore(user._id);
//       Alert.alert("Done", "User restored");
//       refresh();
//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     }
//   };

//   const createUser = async () => {
//     if (!form.schoolId && form.role !== "super_admin") {
//       Alert.alert("Error", "Pick a school for school-scoped roles");
//       return;
//     }
//     if (form.role === "student" && !form.refId.trim()) {
//       Alert.alert("Error", "Admission ID is required for student accounts");
//       return;
//     }
//     if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
//       Alert.alert("Error", "Name, email and password (min 6) are required");
//       return;
//     }

//     setBusy(true);
//     try {
//       await api.users.create({
//         schoolId: form.role === "super_admin" ? undefined : form.schoolId,
//         name: form.name.trim(),
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//         role: form.role,
//         designation:
//           form.role === "staff" ? form.designation || undefined : undefined,
//         class:
//           form.role === "class_teacher" ? form.className || undefined : undefined,
//         section: form.section || undefined,
//         refId: form.refId.trim() || undefined,
//       });

//       setCreatedCredential({
//         name: form.name.trim(),
//         email: form.email.trim().toLowerCase(),
//         role: form.role,
//         admissionId: form.role === "student" ? form.refId.trim() : null,
//         password: form.password,
//       });
//       setCreating(false);
//       resetForm();
//       refresh();
//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setBusy(false);
//     }
//   };

//   const copyText = async (text: string, label: string) => {
//     await Clipboard.setStringAsync(text);
//     Alert.alert("Copied", `${label} copied`);
//   };

//   const refField = REF_ID_FIELDS[form.role] || null;

//   const renderUser = ({ item: user }: { item: any }) => (
//     <View style={[styles.userCard, user.deletedAt && { opacity: 0.55 }]}>
//       <View style={styles.userTop}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>{initials(user.name)}</Text>
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.userName} numberOfLines={1}>
//             {user.name}
//           </Text>
//           <Text style={styles.userEmail} numberOfLines={1}>
//             {user.email}
//           </Text>
//         </View>
//         {user.deletedAt ? (
//           <Pill tone="alert">removed</Pill>
//         ) : user.isActive ? (
//           <Pill tone="success">active</Pill>
//         ) : (
//           <Pill tone="amber">inactive</Pill>
//         )}
//       </View>

//       <View style={styles.userMeta}>
//         <Pill tone="info">{ROLE_LABELS[user.role] || user.role}</Pill>
//         <Text style={styles.metaText}>
//           {user.schoolId ? schoolNameOf(user.schoolId) : "—"}
//         </Text>
//         <Text style={styles.metaText}>Login: {fmtDate(user.lastLogin)}</Text>
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity
//           style={styles.actionBtnInfo}
//           onPress={() => open360(user._id)}
//           disabled={busy}
//         >
//           <Eye size={13} color={colors.info} />
//           <Text style={styles.actionBtnInfoText}>360°</Text>
//         </TouchableOpacity>

//         {user.deletedAt ? (
//           <TouchableOpacity
//             style={styles.actionBtn}
//             onPress={() => restoreUser(user)}
//           >
//             <RotateCcw size={13} color={colors.ink} />
//             <Text style={styles.actionBtnText}>Restore</Text>
//           </TouchableOpacity>
//         ) : (
//           <>
//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => toggleActive(user)}
//             >
//               {user.isActive ? (
//                 <Ban size={13} color={colors.ink} />
//               ) : (
//                 <CheckCircle2 size={13} color={colors.ink} />
//               )}
//               <Text style={styles.actionBtnText}>
//                 {user.isActive ? "Deactivate" : "Activate"}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.actionBtnDanger}
//               onPress={() => removeUser(user)}
//             >
//               <Trash2 size={13} color={colors.alert} />
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <PageIntro
//           eyebrow="Platform Owner · Access & Security"
//           title="Users & Access"
//           description={`${total} user${
//             total === 1 ? "" : "s"
//           } platform-wide. Create accounts, manage status, inspect a User 360°, and restore removed users.`}
//           right={
//             <TouchableOpacity
//               style={styles.newBtn}
//               onPress={() => {
//                 setCreating(true);
//                 resetForm();
//               }}
//             >
//               <Plus size={15} color={colors.ink} />
//               <Text style={styles.newBtnText}>New user</Text>
//             </TouchableOpacity>
//           }
//         />

//         {/* Create Form */}
//         {creating && (
//           <Card
//             title="Create a platform user"
//             style={styles.mb4}
//             action={
//               <TouchableOpacity onPress={() => setCreating(false)}>
//                 <X size={16} color="rgba(71,84,103,0.6)" />
//               </TouchableOpacity>
//             }
//           >
//             <View style={styles.formGrid}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Full name"
//                 value={form.name}
//                 onChangeText={(v) => setForm({ ...form, name: v })}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email (login)"
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 value={form.email}
//                 onChangeText={(v) => setForm({ ...form, email: v })}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password (min 6)"
//                 secureTextEntry
//                 value={form.password}
//                 onChangeText={(v) => setForm({ ...form, password: v })}
//               />

//               {/* Role select */}
//               <TouchableOpacity
//                 style={styles.selectBtn}
//                 onPress={() => setOpenFormRole(!openFormRole)}
//               >
//                 <Text style={styles.selectText}>
//                   {ROLE_LABELS[form.role] || form.role}
//                 </Text>
//               </TouchableOpacity>
//               {openFormRole && (
//                 <View style={styles.dropdown}>
//                   {Object.entries(ROLE_LABELS).map(([value, label]) => (
//                     <TouchableOpacity
//                       key={value}
//                       style={styles.dropdownItem}
//                       onPress={() => {
//                         setForm({ ...form, role: value });
//                         setOpenFormRole(false);
//                       }}
//                     >
//                       <Text style={styles.dropdownText}>{label}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}

//               {/* School select */}
//               {form.role !== "super_admin" ? (
//                 <>
//                   <TouchableOpacity
//                     style={styles.selectBtn}
//                     onPress={() => setOpenFormSchool(!openFormSchool)}
//                   >
//                     <Text style={styles.selectText}>
//                       {form.schoolId
//                         ? schoolNameOf(form.schoolId)
//                         : "Select school…"}
//                     </Text>
//                   </TouchableOpacity>
//                   {openFormSchool && (
//                     <View style={styles.dropdown}>
//                       {schools.map((s) => (
//                         <TouchableOpacity
//                           key={s._id || s.id}
//                           style={styles.dropdownItem}
//                           onPress={() => {
//                             setForm({
//                               ...form,
//                               schoolId: String(s._id || s.id),
//                             });
//                             setOpenFormSchool(false);
//                           }}
//                         >
//                           <Text style={styles.dropdownText}>
//                             {s.name} ({s.code})
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 </>
//               ) : (
//                 <TextInput
//                   style={[styles.input, { backgroundColor: colors.paper }]}
//                   editable={false}
//                   value="Platform-owner has no school"
//                 />
//               )}

//               {form.role === "staff" && (
//                 <>
//                   <TouchableOpacity
//                     style={styles.selectBtn}
//                     onPress={() => setOpenDesignation(!openDesignation)}
//                   >
//                     <Text style={styles.selectText}>
//                       {form.designation
//                         ? DESIGNATION_LABELS[form.designation]
//                         : "Select designation…"}
//                     </Text>
//                   </TouchableOpacity>
//                   {openDesignation && (
//                     <View style={styles.dropdown}>
//                       {DESIGNATION_OPTIONS.map((d) => (
//                         <TouchableOpacity
//                           key={d}
//                           style={styles.dropdownItem}
//                           onPress={() => {
//                             setForm({ ...form, designation: d });
//                             setOpenDesignation(false);
//                           }}
//                         >
//                           <Text style={styles.dropdownText}>
//                             {DESIGNATION_LABELS[d]}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   )}
//                 </>
//               )}

//               {form.role === "class_teacher" && (
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Class"
//                   value={form.className}
//                   onChangeText={(v) => setForm({ ...form, className: v })}
//                 />
//               )}

//               {refField && !refField.disabled && (
//                 <TextInput
//                   style={styles.input}
//                   placeholder={refField.placeholder}
//                   value={form.refId}
//                   onChangeText={(v) => setForm({ ...form, refId: v })}
//                 />
//               )}
//             </View>

//             <View style={styles.formActions}>
//               <TouchableOpacity
//                 style={styles.cancelBtn}
//                 onPress={() => setCreating(false)}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, busy && { opacity: 0.6 }]}
//                 onPress={createUser}
//                 disabled={busy}
//               >
//                 <Text style={styles.submitBtnText}>
//                   {busy ? "Creating…" : "Create user"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </Card>
//         )}

//         {/* Filters */}
//         <Card style={styles.mb4} bodyStyle={{ padding: 14 }}>
//           <View style={styles.searchWrap}>
//             <Search size={15} color="rgba(71,84,103,0.5)" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search name or email"
//               value={q}
//               onChangeText={(v) => {
//                 setQ(v);
//                 setPage(1);
//               }}
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.filterRow}>
//             <TouchableOpacity
//               style={[styles.selectBtn, { flex: 1 }]}
//               onPress={() => setOpenRole(!openRole)}
//             >
//               <Text style={styles.selectText}>
//                 {role ? ROLE_LABELS[role] : "All roles"}
//               </Text>
//             </TouchableOpacity>
//             {openRole && (
//               <View style={[styles.dropdown, { top: 48 }]}>
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     setRole("");
//                     setPage(1);
//                     setOpenRole(false);
//                   }}
//                 >
//                   <Text style={styles.dropdownText}>All roles</Text>
//                 </TouchableOpacity>
//                 {Object.entries(ROLE_LABELS).map(([value, label]) => (
//                   <TouchableOpacity
//                     key={value}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setRole(value);
//                       setPage(1);
//                       setOpenRole(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownText}>{label}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>

//           <View style={styles.filterRow}>
//             <TouchableOpacity
//               style={[styles.selectBtn, { flex: 1 }]}
//               onPress={() => setOpenSchool(!openSchool)}
//             >
//               <Building2 size={14} color="rgba(71,84,103,0.5)" />
//               <Text style={[styles.selectText, { marginLeft: 6 }]}>
//                 {schoolId ? schoolNameOf(schoolId) : "All schools"}
//               </Text>
//             </TouchableOpacity>
//             {openSchool && (
//               <View style={[styles.dropdown, { top: 48 }]}>
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     setSchoolId("");
//                     setPage(1);
//                     setOpenSchool(false);
//                   }}
//                 >
//                   <Text style={styles.dropdownText}>All schools</Text>
//                 </TouchableOpacity>
//                 {schools.map((s) => (
//                   <TouchableOpacity
//                     key={s._id || s.id}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setSchoolId(String(s._id || s.id));
//                       setPage(1);
//                       setOpenSchool(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownText}>{s.name}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>

//           <View style={styles.switchRow}>
//             <Text style={styles.switchLabel}>Include removed users</Text>
//             <Switch
//               value={includeDeleted}
//               onValueChange={(v) => {
//                 setIncludeDeleted(v);
//                 setPage(1);
//               }}
//               trackColor={{ false: "#ccc", true: colors.amber }}
//               thumbColor="#fff"
//             />
//           </View>

//           {(q.trim() || role || schoolId || includeDeleted) && (
//             <TouchableOpacity
//               style={styles.resetFilters}
//               onPress={() => {
//                 setQ("");
//                 setRole("");
//                 setSchoolId("");
//                 setIncludeDeleted(false);
//                 setPage(1);
//               }}
//             >
//               <FilterX size={13} color={colors.ink} />
//               <Text style={styles.resetFiltersText}>Reset filters</Text>
//             </TouchableOpacity>
//           )}
//         </Card>

//         {/* List */}
//         <Card bodyStyle={{ padding: 0 }}>
//           {!loading && (
//             <Text style={styles.showing}>
//               Showing {rows.length} of {total} user{total === 1 ? "" : "s"}
//             </Text>
//           )}

//           {loading ? (
//             <View style={styles.center}>
//               <ActivityIndicator color={colors.amber} />
//               <Text style={styles.muted}>Loading users…</Text>
//             </View>
//           ) : rows.length === 0 ? (
//             <Text style={[styles.muted, { textAlign: "center", padding: 24 }]}>
//               No users match.
//             </Text>
//           ) : (
//             <FlatList
//               data={rows}
//               keyExtractor={(item) => item._id}
//               renderItem={renderUser}
//               scrollEnabled={false}
//               ItemSeparatorComponent={() => <View style={styles.sep} />}
//             />
//           )}

//           {pages > 1 && (
//             <View style={styles.pagination}>
//               <Text style={styles.pageInfo}>
//                 Page {page} of {pages}
//               </Text>
//               <View style={styles.pageBtns}>
//                 <TouchableOpacity
//                   style={[styles.pageBtn, page <= 1 && { opacity: 0.4 }]}
//                   disabled={page <= 1}
//                   onPress={() => setPage((p) => Math.max(1, p - 1))}
//                 >
//                   <ChevronLeft size={15} color={colors.ink} />
//                   <Text style={styles.pageBtnText}>Prev</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.pageBtn, page >= pages && { opacity: 0.4 }]}
//                   disabled={page >= pages}
//                   onPress={() => setPage((p) => p + 1)}
//                 >
//                   <Text style={styles.pageBtnText}>Next</Text>
//                   <ChevronRight size={15} color={colors.ink} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </Card>
//       </ScrollView>

//       {/* Credential Modal */}
//       <Modal visible={!!createdCredential} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.credentialModal}>
//             <Text style={styles.modalTitle}>Account created</Text>
//             <Text style={styles.modalDesc}>
//               Share these sign-in details with {createdCredential?.name} now.
//               Password is shown only once.
//             </Text>

//             {[
//               { label: "Email", value: createdCredential?.email },
//               createdCredential?.admissionId
//                 ? {
//                     label: "Admission ID",
//                     value: createdCredential.admissionId,
//                   }
//                 : null,
//               { label: "Password", value: createdCredential?.password },
//             ]
//               .filter(Boolean)
//               .map((item: any) => (
//                 <View key={item.label} style={styles.credRow}>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.credLabel}>{item.label}</Text>
//                     <Text style={styles.credValue}>{item.value}</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.copyBtn}
//                     onPress={() => copyText(item.value, item.label)}
//                   >
//                     <Text style={styles.copyBtnText}>Copy</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}

//             <TouchableOpacity
//               style={styles.doneBtn}
//               onPress={() => setCreatedCredential(null)}
//             >
//               <Text style={styles.doneBtnText}>Done</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* User 360 Modal */}
//       <Modal visible={!!selected} transparent animationType="slide">
//         <View style={styles.sheetOverlay}>
//           <View style={styles.sheet}>
//             <View style={styles.sheetHeader}>
//               <Text style={styles.sheetTitle}>User 360°</Text>
//               <TouchableOpacity onPress={() => setSelected(null)}>
//                 <X size={18} color="rgba(71,84,103,0.6)" />
//               </TouchableOpacity>
//             </View>

//             {selected && (
//               <ScrollView showsVerticalScrollIndicator={false}>
//                 <View style={styles.sheetUser}>
//                   <View style={[styles.avatar, { width: 48, height: 48 }]}>
//                     <Text style={[styles.avatarText, { fontSize: 16 }]}>
//                       {initials(selected.user?.name)}
//                     </Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.userName}>{selected.user?.name}</Text>
//                     <Text style={styles.userEmail}>{selected.user?.email}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.pillRow}>
//                   <Pill tone="info">
//                     {ROLE_LABELS[selected.user?.role] || selected.user?.role}
//                   </Pill>
//                   {selected.user?.deletedAt ? (
//                     <Pill tone="alert">
//                       removed {fmtDate(selected.user.deletedAt)}
//                     </Pill>
//                   ) : selected.user?.isActive ? (
//                     <Pill tone="success">active</Pill>
//                   ) : (
//                     <Pill tone="amber">inactive</Pill>
//                   )}
//                 </View>

//                 <View style={styles.infoGrid}>
//                   <View style={styles.infoItem}>
//                     <Text style={styles.infoLabel}>School</Text>
//                     <Text style={styles.infoValue}>
//                       {schoolNameOf(selected.user?.schoolId)}
//                     </Text>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Text style={styles.infoLabel}>Last login</Text>
//                     <Text style={styles.infoValue}>
//                       {fmtDate(selected.user?.lastLogin)}
//                     </Text>
//                   </View>
//                   <View style={styles.infoItem}>
//                     <Text style={styles.infoLabel}>Created</Text>
//                     <Text style={styles.infoValue}>
//                       {fmtDate(selected.user?.createdAt)}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.sheetActions}>
//                   {selected.user?.deletedAt ? (
//                     <TouchableOpacity
//                       style={styles.submitBtn}
//                       onPress={() =>
//                         restoreUser(selected.user).then(() => {
//                           setSelected(null);
//                           refresh();
//                         })
//                       }
//                     >
//                       <RotateCcw size={15} color={colors.ink} />
//                       <Text style={styles.submitBtnText}>Restore</Text>
//                     </TouchableOpacity>
//                   ) : (
//                     <>
//                       <TouchableOpacity
//                         style={styles.cancelBtn}
//                         onPress={() => toggleActive(selected.user)}
//                       >
//                         {selected.user?.isActive ? (
//                           <Ban size={15} color={colors.ink} />
//                         ) : (
//                           <CheckCircle2 size={15} color={colors.ink} />
//                         )}
//                         <Text style={styles.cancelBtnText}>
//                           {selected.user?.isActive ? "Deactivate" : "Activate"}
//                         </Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.dangerBtn}
//                         onPress={() => removeUser(selected.user)}
//                       >
//                         <Trash2 size={15} color={colors.alert} />
//                         <Text style={styles.dangerBtnText}>Remove</Text>
//                       </TouchableOpacity>
//                     </>
//                   )}
//                 </View>

//                 {/* Subscription */}
//                 <Text style={styles.sectionLabel}>Current subscription</Text>
//                 {selected.subscription ? (
//                   <View style={styles.subCard}>
//                     <Text style={styles.subTitle}>
//                       {selected.subscription.plan?.name || "—"}
//                     </Text>
//                     <Text style={styles.subMeta}>
//                       {selected.subscription.status} · renews{" "}
//                       {fmtDate(selected.subscription.nextBillingDate)}
//                     </Text>
//                   </View>
//                 ) : (
//                   <Text style={styles.muted}>
//                     No current subscription for this school.
//                   </Text>
//                 )}

//                 {/* Recent activity */}
//                 <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
//                   Recent activity
//                 </Text>
//                 {selected.recentAudits?.length ? (
//                   selected.recentAudits.slice(0, 6).map((entry: any) => (
//                     <View key={entry._id} style={{ marginBottom: 10 }}>
//                       <Text style={styles.activityMsg}>
//                         {entry.message || entry.action}
//                       </Text>
//                       <Text style={styles.activityMeta}>
//                         {entry.action?.replace(".", " · ")} —{" "}
//                         {fmtDate(entry.createdAt)}
//                       </Text>
//                     </View>
//                   ))
//                 ) : (
//                   <Text style={styles.muted}>No activity recorded.</Text>
//                 )}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.paper },
//   content: { padding: 16, paddingBottom: 40 },
//   mb4: { marginBottom: 16 },
//   center: { alignItems: "center", paddingVertical: 28 },
//   muted: { fontSize: 13, color: "rgba(71,84,103,0.7)", marginTop: 8 },
//   newBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: colors.amber,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   newBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
//   formGrid: { gap: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//     fontSize: 13,
//     color: colors.ink,
//   },
//   selectBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//   },
//   selectText: { fontSize: 13, color: colors.ink, flex: 1 },
//   dropdown: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     marginTop: 4,
//     overflow: "hidden",
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   dropdownText: { fontSize: 13, color: colors.ink },
//   formActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 16,
//   },
//   cancelBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     backgroundColor: "#fff",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   cancelBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
//   submitBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: colors.amber,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   submitBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 11,
//     fontSize: 13,
//     color: colors.ink,
//   },
//   filterRow: { marginBottom: 10, position: "relative", zIndex: 5 },
//   switchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   switchLabel: { fontSize: 13, color: colors.slate },
//   resetFilters: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     alignSelf: "flex-start",
//     backgroundColor: colors.paper,
//     borderWidth: 1,
//     borderColor: colors.border,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   resetFiltersText: { fontSize: 12, fontWeight: "600", color: colors.ink },
//   showing: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//     paddingHorizontal: 14,
//     paddingTop: 12,
//     paddingBottom: 4,
//   },
//   userCard: { padding: 14 },
//   userTop: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: colors.ink,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: { color: colors.amber, fontWeight: "600", fontSize: 12 },
//   userName: { fontSize: 14, fontWeight: "600", color: colors.ink },
//   userEmail: { fontSize: 12, color: "rgba(71,84,103,0.65)", marginTop: 1 },
//   userMeta: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 10,
//   },
//   metaText: { fontSize: 12, color: "rgba(71,84,103,0.7)" },
//   actionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 12,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: colors.paper,
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 8,
//   },
//   actionBtnText: { fontSize: 12, fontWeight: "600", color: colors.ink },
//   actionBtnInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "rgba(59,111,160,0.1)",
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 8,
//   },
//   actionBtnInfoText: { fontSize: 12, fontWeight: "600", color: colors.info },
//   actionBtnDanger: {
//     backgroundColor: colors.paper,
//     paddingHorizontal: 10,
//     paddingVertical: 7,
//     borderRadius: 8,
//   },
//   sep: { height: 1, backgroundColor: "rgba(0,0,0,0.05)" },
//   pagination: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 14,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   pageInfo: { fontSize: 12, color: "rgba(71,84,103,0.6)" },
//   pageBtns: { flexDirection: "row", gap: 8 },
//   pageBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   pageBtnText: { fontSize: 12.5, fontWeight: "600", color: colors.ink },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   credentialModal: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
//   modalDesc: {
//     fontSize: 12.5,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 6,
//     marginBottom: 16,
//   },
//   credRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 10,
//   },
//   credLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "rgba(71,84,103,0.6)",
//     textTransform: "uppercase",
//   },
//   credValue: { fontSize: 13, fontWeight: "500", color: colors.ink, marginTop: 2 },
//   copyBtn: {
//     backgroundColor: "rgba(59,111,160,0.1)",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   copyBtnText: { fontSize: 12, fontWeight: "600", color: colors.info },
//   doneBtn: {
//     backgroundColor: colors.amber,
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   doneBtnText: { fontSize: 14, fontWeight: "600", color: colors.ink },
//   sheetOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: "88%",
//     padding: 20,
//   },
//   sheetHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   sheetTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
//   sheetUser: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 14,
//   },
//   pillRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginBottom: 16,
//   },
//   infoGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//     marginBottom: 16,
//   },
//   infoItem: { width: "47%" },
//   infoLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "rgba(71,84,103,0.6)",
//     textTransform: "uppercase",
//   },
//   infoValue: { fontSize: 13, color: colors.ink, marginTop: 2 },
//   sheetActions: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//     marginBottom: 20,
//   },
//   dangerBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     borderWidth: 1,
//     borderColor: "rgba(214,90,74,0.3)",
//     backgroundColor: "rgba(214,90,74,0.08)",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   dangerBtnText: { fontSize: 13, fontWeight: "600", color: colors.alert },
//   sectionLabel: {
//     fontSize: 11.5,
//     fontWeight: "600",
//     color: "rgba(71,84,103,0.6)",
//     textTransform: "uppercase",
//     marginBottom: 8,
//   },
//   subCard: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 12,
//     padding: 12,
//   },
//   subTitle: { fontSize: 13.5, fontWeight: "600", color: colors.ink },
//   subMeta: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 2,
//     textTransform: "capitalize",
//   },
//   activityMsg: { fontSize: 12.5, color: colors.ink },
//   activityMeta: {
//     fontSize: 11,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 2,
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  FlatList,
  Switch,
} from "react-native";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  RotateCcw,
  Ban,
  CheckCircle2,
  Eye,
  FilterX,
  Building2,
} from "lucide-react-native";
import { DrawerToggle } from "@/components/PlatformSidebar";
import { api } from "@/lib/api";
import { Card, PageIntro, Pill } from "@/components/UI";
import * as Clipboard from "expo-clipboard";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
  info: "#3B6FA0",
  alert: "#D65A4A",
  success: "#3F8F5F",
  border: "rgba(0,0,0,0.06)",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Platform Owner",
  school_admin: "School Admin",
  class_teacher: "Class Teacher",
  staff: "Staff",
  student: "Student",
};

const DESIGNATION_OPTIONS = [
  "admission_counsellor",
  "accountant",
  "librarian",
  "receptionist",
  "transport",
];

const DESIGNATION_LABELS: Record<string, string> = {
  admission_counsellor: "Admission Counsellor",
  accountant: "Accountant",
  librarian: "Librarian",
  receptionist: "Receptionist",
  transport: "Transport Coordinator",
};

const REF_ID_FIELDS: Record<
  string,
  { label: string; placeholder: string; required?: boolean; disabled?: boolean } | null
> = {
  student: {
    label: "Admission ID",
    placeholder: "Enter Admission ID",
    required: true,
  },
  staff: { label: "Staff ID", placeholder: "Enter Staff ID", required: false },
  class_teacher: {
    label: "Staff ID",
    placeholder: "Enter Staff ID",
    required: false,
  },
  school_admin: {
    label: "Ref ID",
    disabled: true,
    placeholder: "Not required for this role",
  },
  super_admin: null,
};

const fmtDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const initials = (name = "U") =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

type FormState = {
  schoolId: string;
  name: string;
  email: string;
  password: string;
  role: string;
  designation: string;
  className: string;
  section: string;
  refId: string;
};

const emptyForm = (): FormState => ({
  schoolId: "",
  name: "",
  email: "",
  password: "",
  role: "school_admin",
  designation: "",
  className: "",
  section: "",
  refId: "",
});

export default function PlatformUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [role, setRole] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [busy, setBusy] = useState(false);
  const [createdCredential, setCreatedCredential] = useState<any>(null);

  // dropdown open states
  const [openRole, setOpenRole] = useState(false);
  const [openSchool, setOpenSchool] = useState(false);
  const [openFormRole, setOpenFormRole] = useState(false);
  const [openFormSchool, setOpenFormSchool] = useState(false);
  const [openDesignation, setOpenDesignation] = useState(false);

  useEffect(() => {
    api.schools
      .list()
      .then(({ data }: any) => setSchools(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
    if (role) params.set("role", role);
    if (schoolId) params.set("schoolId", schoolId);
    if (includeDeleted) params.set("includeDeleted", "true");
    params.set("page", String(page));
    params.set("limit", "20");

    setLoading(true);
    api.platform.users
      .list(params.toString())
      .then((result: any) => {
        setRows(result.data || []);
        setTotal(result.total || 0);
        setPages(result.pages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQ, role, schoolId, includeDeleted, page, refreshKey]);

  const schoolNameOf = (id?: string) =>
    schools.find((s) => String(s._id || s.id) === String(id))?.name || "—";

  const refresh = () => setRefreshKey((k) => k + 1);
  const resetForm = () => setForm(emptyForm());

  const open360 = async (userId: string) => {
    setBusy(true);
    try {
      const { data } = await api.platform.users.get360(userId);
      setSelected(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = (user: any) => {
    Alert.alert(
      user.isActive ? "Deactivate" : "Activate",
      `${user.isActive ? "Deactivate" : "Activate"} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await api.platform.users.setStatus(user._id, !user.isActive);
              Alert.alert(
                "Done",
                user.isActive ? "User deactivated" : "User activated"
              );
              refresh();
              if (selected?.user?._id === user._id) open360(user._id);
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const removeUser = (user: any) => {
    Alert.alert(
      "Remove user",
      `Remove ${user.name} (${user.email})? Access is revoked and history is preserved.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await api.platform.users.remove(user._id);
              Alert.alert("Done", "User removed");
              refresh();
              if (selected?.user?._id === user._id) setSelected(null);
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const restoreUser = async (user: any) => {
    try {
      await api.platform.users.restore(user._id);
      Alert.alert("Done", "User restored");
      refresh();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const createUser = async () => {
    if (!form.schoolId && form.role !== "super_admin") {
      Alert.alert("Error", "Pick a school for school-scoped roles");
      return;
    }
    if (form.role === "student" && !form.refId.trim()) {
      Alert.alert("Error", "Admission ID is required for student accounts");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      Alert.alert("Error", "Name, email and password (min 6) are required");
      return;
    }

    setBusy(true);
    try {
      await api.users.create({
        schoolId: form.role === "super_admin" ? undefined : form.schoolId,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        designation:
          form.role === "staff" ? form.designation || undefined : undefined,
        class:
          form.role === "class_teacher" ? form.className || undefined : undefined,
        section: form.section || undefined,
        refId: form.refId.trim() || undefined,
      });

      setCreatedCredential({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        admissionId: form.role === "student" ? form.refId.trim() : null,
        password: form.password,
      });
      setCreating(false);
      resetForm();
      refresh();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const copyText = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", `${label} copied`);
  };

  const refField = REF_ID_FIELDS[form.role] || null;

  const renderUser = ({ item: user }: { item: any }) => (
    <View style={[styles.userCard, user.deletedAt && { opacity: 0.55 }]}>
      <View style={styles.userTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user.name)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email}
          </Text>
        </View>
        {user.deletedAt ? (
          <Pill tone="alert">removed</Pill>
        ) : user.isActive ? (
          <Pill tone="success">active</Pill>
        ) : (
          <Pill tone="amber">inactive</Pill>
        )}
      </View>

      <View style={styles.userMeta}>
        <Pill tone="info">{ROLE_LABELS[user.role] || user.role}</Pill>
        <Text style={styles.metaText}>
          {user.schoolId ? schoolNameOf(user.schoolId) : "—"}
        </Text>
        <Text style={styles.metaText}>Login: {fmtDate(user.lastLogin)}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtnInfo}
          onPress={() => open360(user._id)}
          disabled={busy}
        >
          <Eye size={13} color={colors.info} />
          <Text style={styles.actionBtnInfoText}>360°</Text>
        </TouchableOpacity>

        {user.deletedAt ? (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => restoreUser(user)}
          >
            <RotateCcw size={13} color={colors.ink} />
            <Text style={styles.actionBtnText}>Restore</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => toggleActive(user)}
            >
              {user.isActive ? (
                <Ban size={13} color={colors.ink} />
              ) : (
                <CheckCircle2 size={13} color={colors.ink} />
              )}
              <Text style={styles.actionBtnText}>
                {user.isActive ? "Deactivate" : "Activate"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtnDanger}
              onPress={() => removeUser(user)}
            >
              <Trash2 size={13} color={colors.alert} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <DrawerToggle />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageIntro
          eyebrow="Platform Owner · Access & Security"
          title="Users & Access"
          description={`${total} user${
            total === 1 ? "" : "s"
          } platform-wide. Create accounts, manage status, inspect a User 360°, and restore removed users.`}
          right={
            <TouchableOpacity
              style={styles.newBtn}
              onPress={() => {
                setCreating(true);
                resetForm();
              }}
            >
              <Plus size={15} color={colors.ink} />
              <Text style={styles.newBtnText}>New user</Text>
            </TouchableOpacity>
          }
        />

        {/* Create Form */}
        {creating && (
          <Card
            title="Create a platform user"
            style={styles.mb4}
            action={
              <TouchableOpacity onPress={() => setCreating(false)}>
                <X size={16} color="rgba(71,84,103,0.6)" />
              </TouchableOpacity>
            }
          >
            <View style={styles.formGrid}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email (login)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password (min 6)"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => setForm({ ...form, password: v })}
              />

              {/* Role select */}
              <TouchableOpacity
                style={styles.selectBtn}
                onPress={() => setOpenFormRole(!openFormRole)}
              >
                <Text style={styles.selectText}>
                  {ROLE_LABELS[form.role] || form.role}
                </Text>
              </TouchableOpacity>
              {openFormRole && (
                <View style={styles.dropdown}>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm({ ...form, role: value });
                        setOpenFormRole(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* School select */}
              {form.role !== "super_admin" ? (
                <>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => setOpenFormSchool(!openFormSchool)}
                  >
                    <Text style={styles.selectText}>
                      {form.schoolId
                        ? schoolNameOf(form.schoolId)
                        : "Select school…"}
                    </Text>
                  </TouchableOpacity>
                  {openFormSchool && (
                    <View style={styles.dropdown}>
                      {schools.map((s) => (
                        <TouchableOpacity
                          key={s._id || s.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setForm({
                              ...form,
                              schoolId: String(s._id || s.id),
                            });
                            setOpenFormSchool(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>
                            {s.name} ({s.code})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.paper }]}
                  editable={false}
                  value="Platform-owner has no school"
                />
              )}

              {form.role === "staff" && (
                <>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => setOpenDesignation(!openDesignation)}
                  >
                    <Text style={styles.selectText}>
                      {form.designation
                        ? DESIGNATION_LABELS[form.designation]
                        : "Select designation…"}
                    </Text>
                  </TouchableOpacity>
                  {openDesignation && (
                    <View style={styles.dropdown}>
                      {DESIGNATION_OPTIONS.map((d) => (
                        <TouchableOpacity
                          key={d}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setForm({ ...form, designation: d });
                            setOpenDesignation(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>
                            {DESIGNATION_LABELS[d]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}

              {form.role === "class_teacher" && (
                <TextInput
                  style={styles.input}
                  placeholder="Class"
                  value={form.className}
                  onChangeText={(v) => setForm({ ...form, className: v })}
                />
              )}

              {refField && !refField.disabled && (
                <TextInput
                  style={styles.input}
                  placeholder={refField.placeholder}
                  value={form.refId}
                  onChangeText={(v) => setForm({ ...form, refId: v })}
                />
              )}
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCreating(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, busy && { opacity: 0.6 }]}
                onPress={createUser}
                disabled={busy}
              >
                <Text style={styles.submitBtnText}>
                  {busy ? "Creating…" : "Create user"}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Filters */}
        <Card style={styles.mb4} bodyStyle={{ padding: 14 }}>
          <View style={styles.searchWrap}>
            <Search size={15} color="rgba(71,84,103,0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name or email"
              value={q}
              onChangeText={(v) => {
                setQ(v);
                setPage(1);
              }}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.selectBtn, { flex: 1 }]}
              onPress={() => setOpenRole(!openRole)}
            >
              <Text style={styles.selectText}>
                {role ? ROLE_LABELS[role] : "All roles"}
              </Text>
            </TouchableOpacity>
            {openRole && (
              <View style={[styles.dropdown, { top: 48 }]}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRole("");
                    setPage(1);
                    setOpenRole(false);
                  }}
                >
                  <Text style={styles.dropdownText}>All roles</Text>
                </TouchableOpacity>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRole(value);
                      setPage(1);
                      setOpenRole(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.selectBtn, { flex: 1 }]}
              onPress={() => setOpenSchool(!openSchool)}
            >
              <Building2 size={14} color="rgba(71,84,103,0.5)" />
              <Text style={[styles.selectText, { marginLeft: 6 }]}>
                {schoolId ? schoolNameOf(schoolId) : "All schools"}
              </Text>
            </TouchableOpacity>
            {openSchool && (
              <View style={[styles.dropdown, { top: 48 }]}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSchoolId("");
                    setPage(1);
                    setOpenSchool(false);
                  }}
                >
                  <Text style={styles.dropdownText}>All schools</Text>
                </TouchableOpacity>
                {schools.map((s) => (
                  <TouchableOpacity
                    key={s._id || s.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSchoolId(String(s._id || s.id));
                      setPage(1);
                      setOpenSchool(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Include removed users</Text>
            <Switch
              value={includeDeleted}
              onValueChange={(v) => {
                setIncludeDeleted(v);
                setPage(1);
              }}
              trackColor={{ false: "#ccc", true: colors.amber }}
              thumbColor="#fff"
            />
          </View>

          {(q.trim() || role || schoolId || includeDeleted) && (
            <TouchableOpacity
              style={styles.resetFilters}
              onPress={() => {
                setQ("");
                setRole("");
                setSchoolId("");
                setIncludeDeleted(false);
                setPage(1);
              }}
            >
              <FilterX size={13} color={colors.ink} />
              <Text style={styles.resetFiltersText}>Reset filters</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* List */}
        <Card bodyStyle={{ padding: 0 }}>
          {!loading && (
            <Text style={styles.showing}>
              Showing {rows.length} of {total} user{total === 1 ? "" : "s"}
            </Text>
          )}

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.muted}>Loading users…</Text>
            </View>
          ) : rows.length === 0 ? (
            <Text style={[styles.muted, { textAlign: "center", padding: 24 }]}>
              No users match.
            </Text>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(item) => item._id}
              renderItem={renderUser}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}

          {pages > 1 && (
            <View style={styles.pagination}>
              <Text style={styles.pageInfo}>
                Page {page} of {pages}
              </Text>
              <View style={styles.pageBtns}>
                <TouchableOpacity
                  style={[styles.pageBtn, page <= 1 && { opacity: 0.4 }]}
                  disabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={15} color={colors.ink} />
                  <Text style={styles.pageBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pageBtn, page >= pages && { opacity: 0.4 }]}
                  disabled={page >= pages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <Text style={styles.pageBtnText}>Next</Text>
                  <ChevronRight size={15} color={colors.ink} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Credential Modal */}
      <Modal visible={!!createdCredential} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.credentialModal}>
            <Text style={styles.modalTitle}>Account created</Text>
            <Text style={styles.modalDesc}>
              Share these sign-in details with {createdCredential?.name} now.
              Password is shown only once.
            </Text>

            {[
              { label: "Email", value: createdCredential?.email },
              createdCredential?.admissionId
                ? {
                    label: "Admission ID",
                    value: createdCredential.admissionId,
                  }
                : null,
              { label: "Password", value: createdCredential?.password },
            ]
              .filter(Boolean)
              .map((item: any) => (
                <View key={item.label} style={styles.credRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.credLabel}>{item.label}</Text>
                    <Text style={styles.credValue}>{item.value}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => copyText(item.value, item.label)}
                  >
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              ))}

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setCreatedCredential(null)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User 360 Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>User 360°</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <X size={18} color="rgba(71,84,103,0.6)" />
              </TouchableOpacity>
            </View>

            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sheetUser}>
                  <View style={[styles.avatar, { width: 48, height: 48 }]}>
                    <Text style={[styles.avatarText, { fontSize: 16 }]}>
                      {initials(selected.user?.name)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{selected.user?.name}</Text>
                    <Text style={styles.userEmail}>{selected.user?.email}</Text>
                  </View>
                </View>

                <View style={styles.pillRow}>
                  <Pill tone="info">
                    {ROLE_LABELS[selected.user?.role] || selected.user?.role}
                  </Pill>
                  {selected.user?.deletedAt ? (
                    <Pill tone="alert">
                      removed {fmtDate(selected.user.deletedAt)}
                    </Pill>
                  ) : selected.user?.isActive ? (
                    <Pill tone="success">active</Pill>
                  ) : (
                    <Pill tone="amber">inactive</Pill>
                  )}
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>School</Text>
                    <Text style={styles.infoValue}>
                      {schoolNameOf(selected.user?.schoolId)}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Last login</Text>
                    <Text style={styles.infoValue}>
                      {fmtDate(selected.user?.lastLogin)}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Created</Text>
                    <Text style={styles.infoValue}>
                      {fmtDate(selected.user?.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.sheetActions}>
                  {selected.user?.deletedAt ? (
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={() =>
                        restoreUser(selected.user).then(() => {
                          setSelected(null);
                          refresh();
                        })
                      }
                    >
                      <RotateCcw size={15} color={colors.ink} />
                      <Text style={styles.submitBtnText}>Restore</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => toggleActive(selected.user)}
                      >
                        {selected.user?.isActive ? (
                          <Ban size={15} color={colors.ink} />
                        ) : (
                          <CheckCircle2 size={15} color={colors.ink} />
                        )}
                        <Text style={styles.cancelBtnText}>
                          {selected.user?.isActive ? "Deactivate" : "Activate"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dangerBtn}
                        onPress={() => removeUser(selected.user)}
                      >
                        <Trash2 size={15} color={colors.alert} />
                        <Text style={styles.dangerBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {/* Subscription */}
                <Text style={styles.sectionLabel}>Current subscription</Text>
                {selected.subscription ? (
                  <View style={styles.subCard}>
                    <Text style={styles.subTitle}>
                      {selected.subscription.plan?.name || "—"}
                    </Text>
                    <Text style={styles.subMeta}>
                      {selected.subscription.status} · renews{" "}
                      {fmtDate(selected.subscription.nextBillingDate)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.muted}>
                    No current subscription for this school.
                  </Text>
                )}

                {/* Recent activity */}
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                  Recent activity
                </Text>
                {selected.recentAudits?.length ? (
                  selected.recentAudits.slice(0, 6).map((entry: any) => (
                    <View key={entry._id} style={{ marginBottom: 10 }}>
                      <Text style={styles.activityMsg}>
                        {entry.message || entry.action}
                      </Text>
                      <Text style={styles.activityMeta}>
                        {entry.action?.replace(".", " · ")} —{" "}
                        {fmtDate(entry.createdAt)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.muted}>No activity recorded.</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  toggleRow: {
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  content: { padding: 16, paddingBottom: 40 },
  mb4: { marginBottom: 16 },
  center: { alignItems: "center", paddingVertical: 28 },
  muted: { fontSize: 13, color: "rgba(71,84,103,0.7)", marginTop: 8 },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.amber,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  newBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
  formGrid: { gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.ink,
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  selectText: { fontSize: 13, color: colors.ink, flex: 1 },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  dropdownText: { fontSize: 13, color: colors.ink },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.amber,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitBtnText: { fontSize: 13, fontWeight: "600", color: colors.ink },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.ink,
  },
  filterRow: { marginBottom: 10, position: "relative", zIndex: 5 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  switchLabel: { fontSize: 13, color: colors.slate },
  resetFilters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  resetFiltersText: { fontSize: 12, fontWeight: "600", color: colors.ink },
  showing: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  userCard: { padding: 14 },
  userTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.amber, fontWeight: "600", fontSize: 12 },
  userName: { fontSize: 14, fontWeight: "600", color: colors.ink },
  userEmail: { fontSize: 12, color: "rgba(71,84,103,0.65)", marginTop: 1 },
  userMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  metaText: { fontSize: 12, color: "rgba(71,84,103,0.7)" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.paper,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionBtnText: { fontSize: 12, fontWeight: "600", color: colors.ink },
  actionBtnInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,111,160,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionBtnInfoText: { fontSize: 12, fontWeight: "600", color: colors.info },
  actionBtnDanger: {
    backgroundColor: colors.paper,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sep: { height: 1, backgroundColor: "rgba(0,0,0,0.05)" },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pageInfo: { fontSize: 12, color: "rgba(71,84,103,0.6)" },
  pageBtns: { flexDirection: "row", gap: 8 },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageBtnText: { fontSize: 12.5, fontWeight: "600", color: colors.ink },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  credentialModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  modalDesc: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.7)",
    marginTop: 6,
    marginBottom: 16,
  },
  credRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  credLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(71,84,103,0.6)",
    textTransform: "uppercase",
  },
  credValue: { fontSize: 13, fontWeight: "500", color: colors.ink, marginTop: 2 },
  copyBtn: {
    backgroundColor: "rgba(59,111,160,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: { fontSize: 12, fontWeight: "600", color: colors.info },
  doneBtn: {
    backgroundColor: colors.amber,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  doneBtnText: { fontSize: 14, fontWeight: "600", color: colors.ink },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "88%",
    padding: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  sheetUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  infoItem: { width: "47%" },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(71,84,103,0.6)",
    textTransform: "uppercase",
  },
  infoValue: { fontSize: 13, color: colors.ink, marginTop: 2 },
  sheetActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(214,90,74,0.3)",
    backgroundColor: "rgba(214,90,74,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dangerBtnText: { fontSize: 13, fontWeight: "600", color: colors.alert },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "rgba(71,84,103,0.6)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subCard: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 12,
  },
  subTitle: { fontSize: 13.5, fontWeight: "600", color: colors.ink },
  subMeta: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
    textTransform: "capitalize",
  },
  activityMsg: { fontSize: 12.5, color: colors.ink },
  activityMeta: {
    fontSize: 11,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
  },
});