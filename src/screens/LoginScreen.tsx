import { useRouter } from "expo-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { api } from "../lib/api";
import { saveSession } from "../lib/storage";
import { setCredentials } from "../store/authSlice";

// Types
type Role = "parent" | "student" | "teacher" | "admin";
type Mode = "login" | "register";

interface SchoolInfo {
  name: string;
  shortName: string;
  tagline: string;
  affiliation: string;
  session: string;
}

const school: SchoolInfo = {
  name: "School Management ERP",
  shortName: "School ERP",
  tagline: "School operations, connected",
  affiliation: "School Administration",
  session: String(new Date().getFullYear()),
};

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setNotice("");

    const trimmedEmail = email.trim().toLowerCase();

    if (mode === "register") {
      if (!name.trim() || !trimmedEmail || !role) {
        setError("Name, email and role are required");
        return;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    } else {
      if (!trimmedEmail || !password.trim()) {
        setError("Email and password are required");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await api.register({
          name: name.trim(),
          email: trimmedEmail,
          password,
          role,
          phone: phone.trim(),
        });
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setNotice("Account created successfully. Sign in to continue.");
      } else {
        // ========== LOGIN SUCCESS ==========
        const { data } = await api.login({ email: trimmedEmail, password });

        await saveSession(data); // aapka existing function
        dispatch(setCredentials(data));

        router.replace(
          (data.user?.role === "super_admin" ? "/platform/(tabs)" : "/") as any,
        );
      }
    } catch (requestError: any) {
      setError(requestError?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setNotice("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <GraduationCap size={22} color="#1a1a1a" strokeWidth={2.5} />
            </View>
            <View>
              <Text style={styles.brandName}>{school.shortName}</Text>
              <Text style={styles.brandTagline}>{school.tagline}</Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </Text>
          <Text style={styles.title}>
            {mode === "login" ? "Sign in to your ERP" : "Join your school ERP"}
          </Text>
          <Text style={styles.subtitle}>
            {mode === "login"
              ? `Session ${school.session}`
              : "Register to access school operations."}
          </Text>

          {/* Register fields */}
          {mode === "register" && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputWrapper}>
                  <UserRound
                    size={16}
                    color="rgba(100,100,100,0.4)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your full name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Role</Text>
                  <View style={styles.selectWrapper}>
                    <View style={styles.roleButtons}>
                      {(
                        ["parent", "student", "teacher", "admin"] as Role[]
                      ).map((r) => (
                        <TouchableOpacity
                          key={r}
                          style={[
                            styles.roleBtn,
                            role === r && styles.roleBtnActive,
                          ]}
                          onPress={() => setRole(r)}
                        >
                          <Text
                            style={[
                              styles.roleBtnText,
                              role === r && styles.roleBtnTextActive,
                            ]}
                          >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Phone</Text>
                <View style={styles.inputWrapper}>
                  <Phone
                    size={16}
                    color="rgba(100,100,100,0.4)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Optional"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </>
          )}

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrapper}>
              <Mail
                size={16}
                color="rgba(100,100,100,0.4)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock
                size={16}
                color="rgba(100,100,100,0.4)"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={18} color="rgba(100,100,100,0.6)" />
                ) : (
                  <Eye size={18} color="rgba(100,100,100,0.6)" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          {mode === "register" ? (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.inputWrapper}>
                <Lock
                  size={16}
                  color="rgba(100,100,100,0.4)"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="rgba(100,100,100,0.6)" />
                  ) : (
                    <Eye size={18} color="rgba(100,100,100,0.6)" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.forgotRow}>
              <Text style={styles.keepSignedIn}>Keep me signed in</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <>
                <Text style={styles.submitText}>
                  {mode === "login" ? "Sign in" : "Create account"}
                </Text>
                <ArrowRight size={16} color="#1a1a1a" />
              </>
            )}
          </TouchableOpacity>

          {/* Toggle mode */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {mode === "login"
                ? "New to the school ERP?"
                : "Already have an account?"}{" "}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleLink}>
                {mode === "login" ? "Create account" : "Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  brandHeader: {
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f5c518",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  brandTagline: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b8860b",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 28,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#1a1a1a",
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  selectWrapper: {
    marginTop: 4,
  },
  roleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  roleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  roleBtnActive: {
    backgroundColor: "#f5c518",
    borderColor: "#f5c518",
  },
  roleBtnText: {
    fontSize: 13,
    color: "#64748b",
  },
  roleBtnTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  forgotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  keepSignedIn: {
    fontSize: 13,
    color: "#64748b",
  },
  forgotText: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: "500",
  },
  notice: {
    fontSize: 13,
    color: "#16a34a",
    marginBottom: 12,
  },
  error: {
    fontSize: 13,
    color: "#dc2626",
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#f5c518",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    flexWrap: "wrap",
  },
  toggleText: {
    fontSize: 12,
    color: "rgba(100,100,100,0.6)",
  },
  toggleLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
