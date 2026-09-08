import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Info, Lock, RotateCcw, Save } from "lucide-react-native";
import { api } from "@/lib/api";
import { Card, PageIntro } from "@/components/UI";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
  border: "rgba(0,0,0,0.06)",
};

const SECTION_ORDER = [
  {
    id: "general",
    title: "General",
    blurb: "Public-facing identity of the platform.",
  },
  {
    id: "security",
    title: "Security",
    blurb: "Login and account hardening.",
  },
  {
    id: "billing",
    title: "Billing",
    blurb: "Currency and invoice behaviour.",
  },
  {
    id: "notifications",
    title: "Notifications",
    blurb: "Automated reminders and alerts.",
  },
];

type Setting = {
  key: string;
  label: string;
  help?: string;
  section: string;
  type: "boolean" | "number" | "string" | string;
  value: any;
  default: any;
  options?: string[];
  min?: number;
  max?: number;
};

// ========== Toggle ==========
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange(!checked)}
      style={[
        styles.toggleTrack,
        { backgroundColor: checked ? colors.amber : "rgba(0,0,0,0.15)" },
      ]}
    >
      <View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX: checked ? 18 : 2 }] },
        ]}
      />
    </TouchableOpacity>
  );
}

// ========== Setting Row ==========
function SettingRow({
  setting,
  value,
  onChange,
  onReset,
}: {
  setting: Setting;
  value: any;
  onChange: (value: any) => void;
  onReset: () => void;
}) {
  const isChanged = setting.value !== setting.default;
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>{setting.label}</Text>
          {isChanged ? (
            <View style={styles.changedBadge}>
              <Text style={styles.changedText}>changed</Text>
            </View>
          ) : null}
        </View>
        {setting.help ? (
          <Text style={styles.settingHelp}>{setting.help}</Text>
        ) : null}
      </View>

      <View style={styles.settingRight}>
        {setting.type === "boolean" ? (
          <Toggle checked={Boolean(value)} onChange={onChange} />
        ) : setting.options ? (
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => setOpenOptions(!openOptions)}
            >
              <Text style={styles.selectText} numberOfLines={1}>
                {String(value)}
              </Text>
            </TouchableOpacity>
            {openOptions && (
              <View style={styles.dropdown}>
                {setting.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      onChange(option);
                      setOpenOptions(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={String(value ?? "")}
            keyboardType={setting.type === "number" ? "numeric" : "default"}
            onChangeText={(text) =>
              onChange(setting.type === "number" ? Number(text) : text)
            }
          />
        )}

        <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
          <RotateCcw size={14} color="rgba(71,84,103,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========== Main Screen ==========
export default function PlatformSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.platform.settings
      .get()
      .then(({ data }: any) => setSettings(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const byKey = (key: string) => settings.find((s) => s.key === key);

  const change = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setDirty((prev) => new Set(prev).add(key));
  };

  const reset = (key: string) => {
    const setting = byKey(key);
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: s.default } : s))
    );
    setDirty((prev) => {
      const next = new Set(prev);
      if (setting && setting.value === setting.default) {
        next.delete(key);
      } else {
        // after reset, if it matches default remove from dirty
        next.delete(key);
      }
      return next;
    });
  };

  const save = async () => {
    if (dirty.size === 0) return;
    setSaving(true);

    const payload: Record<string, any> = {};
    for (const key of dirty) {
      const setting = byKey(key);
      if (!setting) continue;
      if (setting.type === "number") {
        const n = Number(setting.value);
        if (Number.isFinite(n)) payload[key] = n;
      } else {
        payload[key] = setting.value;
      }
    }

    try {
      const { data } = await api.platform.settings.update(payload);
      if (data) setSettings(data);
      setDirty(new Set());
      Alert.alert(
        "Saved",
        `Saved ${Object.keys(payload).length} setting${
          Object.keys(payload).length > 1 ? "s" : ""
        }`
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <PageIntro
        eyebrow="Platform Owner · System"
        title="Platform Settings"
        description="Secrets-free configuration for the whole platform. Environment credentials (database URI, JWT secret, provider keys) are intentionally never exposed here."
        right={
          <TouchableOpacity
            style={[
              styles.saveBtn,
              (saving || dirty.size === 0) && { opacity: 0.55 },
            ]}
            onPress={save}
            disabled={saving || dirty.size === 0}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.ink} />
            ) : (
              <Save size={15} color={colors.ink} />
            )}
            <Text style={styles.saveBtnText}>
              {saving
                ? "Saving…"
                : dirty.size
                ? `Save ${dirty.size} change${dirty.size > 1 ? "s" : ""}`
                : "No changes"}
            </Text>
          </TouchableOpacity>
        }
      />

      {loading ? (
        <Card>
          <View style={styles.center}>
            <ActivityIndicator color={colors.amber} />
            <Text style={styles.muted}>Loading settings…</Text>
          </View>
        </Card>
      ) : (
        <View style={styles.sections}>
          {SECTION_ORDER.map((section) => {
            const items = settings.filter((s) => s.section === section.id);
            if (items.length === 0) return null;

            return (
              <Card key={section.id} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBlurb}>{section.blurb}</Text>

                {items.map((setting) => (
                  <SettingRow
                    key={setting.key}
                    setting={setting}
                    value={byKey(setting.key)?.value}
                    onChange={(value) => change(setting.key, value)}
                    onReset={() => reset(setting.key)}
                  />
                ))}
              </Card>
            );
          })}

          {/* Lock note */}
          <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
            <Lock size={15} color="rgba(71,84,103,0.5)" />
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>
                Why can't I change keys, URIs or secrets here?
              </Text>
              <Text style={styles.noteText}>
                JWT signing keys, MongoDB connection strings and third-party
                provider credentials are environment configuration, not runtime
                settings. They live in gitignored environment files and fail
                closed when absent, so they can never leak through the admin UI,
                API responses, or exported reports.
              </Text>
            </View>
          </Card>

          {/* Info note */}
          <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
            <Info size={15} color="rgba(71,84,103,0.5)" />
            <View style={{ flex: 1 }}>
              <Text style={styles.noteText}>
                Every saved change is written to the immutable audit trail
                (settings.changed) with the acting admin's identity, so the
                audit log answers exactly who changed what platform-wide.
              </Text>
            </View>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    alignItems: "center",
    paddingVertical: 24,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amber,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  sections: {
    gap: 16,
  },
  sectionCard: {
    // Card already has padding via bodyStyle default
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 2,
  },
  sectionBlurb: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    marginBottom: 8,
  },
  settingRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  settingLeft: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  changedBadge: {
    backgroundColor: "rgba(232,163,61,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changedText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.amberDark,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  settingHelp: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 3,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  selectBtn: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectText: {
    fontSize: 13,
    color: colors.ink,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    minWidth: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    zIndex: 50,
    elevation: 6,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  dropdownText: {
    fontSize: 13,
    color: colors.ink,
  },
  input: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.ink,
  },
  resetBtn: {
    padding: 6,
  },
  noteCard: {
    backgroundColor: "rgba(247,245,240,0.7)",
  },
  noteBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  noteTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.slate,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    lineHeight: 18,
  },
});