import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Download,
  FileBarChart,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
  border: "rgba(0,0,0,0.06)",
};

const fmtValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return value.toLocaleDateString("en-IN");
  const date = new Date(value);
  if (
    !Number.isNaN(date.getTime()) &&
    typeof value === "string" &&
    value.includes("T")
  ) {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return String(value);
};

const toCsv = (rows: any[]) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: any) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
};

type CatalogItem = {
  id: string;
  title: string;
  category?: string;
};

type ReportData = {
  meta: {
    type?: string;
    title?: string;
    rowCount?: number;
    generatedAt?: string;
  };
  columns: string[];
  rows: any[];
};

export default function PlatformReports() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [maxRows, setMaxRows] = useState(100);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openMaxRows, setOpenMaxRows] = useState(false);

  useEffect(() => {
    api.platform.reports
      .catalog()
      .then(({ data }: any) => {
        setCatalog(data || []);
        if (data?.length) setType(data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const run = async (nextType = type) => {
    if (!nextType) return;
    setGenerating(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    try {
      const { data } = await api.platform.reports.generate(
        nextType,
        params.toString(),
      );
      setReport(data);
      setSortKey("");
      setSortDir(1);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const rows = useMemo(() => {
    let result = (report?.rows || []).slice();

    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(needle),
        ),
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (
          av instanceof Date ||
          (typeof av === "string" && !Number.isNaN(new Date(av).getTime()))
        ) {
          return (new Date(av).getTime() - new Date(bv).getTime()) * sortDir;
        }
        return String(av ?? "").localeCompare(String(bv ?? "")) * sortDir;
      });
    }

    return result;
  }, [report, query, sortKey, sortDir]);

  const limitedRows = rows.slice(0, maxRows);
  const columns = report?.columns || [];

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const download = async () => {
    const csv = toCsv(limitedRows);
    if (!csv) {
      Alert.alert("No data", "Nothing to export");
      return;
    }

    try {
      const fileName = `${report?.meta?.type || "report"}.csv`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Report CSV",
        });
      } else {
        Alert.alert("Saved", `CSV saved to ${fileUri}`);
      }
    } catch (e: any) {
      Alert.alert("Export failed", e.message || "Could not export CSV");
    }
  };

  const selectedTitle =
    catalog.find((c) => c.id === type)?.title || "Select report";

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
          eyebrow="Platform Owner · Insights"
          title="Reports"
          description="Generate reports on demand from live platform data. No fabricated figures — every row comes from schools, users, subscriptions or invoices."
        />

        {/* Catalog */}
        <Card
          title="Report catalog"
          style={styles.mb4}
          bodyStyle={{ padding: 8 }}
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.muted}>Loading catalog…</Text>
            </View>
          ) : (
            <View>
              {catalog.map((item) => {
                const active = type === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setType(item.id);
                      setReport(null);
                    }}
                    style={[
                      styles.catalogItem,
                      active && styles.catalogItemActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.catalogRow}>
                      <FileBarChart
                        size={14}
                        color={
                          active ? colors.amberDark : "rgba(71,84,103,0.6)"
                        }
                      />
                      <Text
                        style={[
                          styles.catalogTitle,
                          active && { color: colors.ink },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {item.category ? (
                      <Text style={styles.catalogCat}>{item.category}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Card>

        {/* Generate */}
        <Card title="Generate" style={styles.mb4}>
          {/* Type selector */}
          <Text style={styles.label}>Report type</Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setOpenCatalog(!openCatalog)}
          >
            <Text style={styles.selectText}>{selectedTitle}</Text>
          </TouchableOpacity>
          {openCatalog && (
            <View style={styles.dropdown}>
              {catalog.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setType(item.id);
                    setReport(null);
                    setOpenCatalog(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Date range */}
          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>From (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={from}
                onChangeText={setFrom}
                placeholder="2025-01-01"
                placeholderTextColor="rgba(71,84,103,0.45)"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>To (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={to}
                onChangeText={setTo}
                placeholder="2025-12-31"
                placeholderTextColor="rgba(71,84,103,0.45)"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.genBtn, (generating || !type) && { opacity: 0.6 }]}
              onPress={() => run()}
              disabled={generating || !type}
              activeOpacity={0.8}
            >
              {generating ? (
                <ActivityIndicator color={colors.ink} size="small" />
              ) : (
                <CalendarDays size={15} color={colors.ink} />
              )}
              <Text style={styles.genBtnText}>
                {generating ? "Generating…" : "Generate"}
              </Text>
            </TouchableOpacity>

            {report ? (
              <TouchableOpacity
                style={styles.csvBtn}
                onPress={download}
                activeOpacity={0.8}
              >
                <Download size={15} color={colors.ink} />
                <Text style={styles.csvBtnText}>CSV</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {report?.meta ? (
            <Text style={styles.metaText}>
              {report.meta.title} · {report.meta.rowCount} rows · generated{" "}
              {report.meta.generatedAt
                ? new Date(report.meta.generatedAt).toLocaleString("en-IN")
                : "—"}
            </Text>
          ) : null}
        </Card>

        {/* Results */}
        {report ? (
          <Card>
            {/* Filter + limit */}
            <View style={styles.resultTools}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Filter rows…"
                placeholderTextColor="rgba(71,84,103,0.45)"
                value={query}
                onChangeText={setQuery}
              />

              <TouchableOpacity
                style={[styles.selectBtn, { width: 100 }]}
                onPress={() => setOpenMaxRows(!openMaxRows)}
              >
                <Text style={styles.selectText}>{maxRows} rows</Text>
              </TouchableOpacity>
            </View>

            {openMaxRows && (
              <View style={[styles.dropdown, { marginBottom: 12 }]}>
                {[50, 100, 500, 100000].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMaxRows(n);
                      setOpenMaxRows(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>
                      {n === 100000 ? "All" : `${n} rows`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.showing}>
              showing {limitedRows.length} of {rows.length}
            </Text>

            {limitedRows.length === 0 ? (
              <Text
                style={[
                  styles.muted,
                  { textAlign: "center", paddingVertical: 24 },
                ]}
              >
                No rows to display.
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View>
                  {/* Header */}
                  <View style={styles.tableHeader}>
                    {columns.map((column) => (
                      <TouchableOpacity
                        key={column}
                        style={styles.th}
                        onPress={() => toggleSort(column)}
                      >
                        <Text style={styles.thText}>{column}</Text>
                        {sortKey === column ? (
                          sortDir === 1 ? (
                            <ArrowDown size={11} color={colors.slate} />
                          ) : (
                            <ArrowUp size={11} color={colors.slate} />
                          )
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Rows */}
                  {limitedRows.map((row, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && {
                          backgroundColor: "rgba(247,245,240,0.5)",
                        },
                      ]}
                    >
                      {columns.map((column) => (
                        <View key={column} style={styles.td}>
                          <Text style={styles.tdText} numberOfLines={2}>
                            {fmtValue(row[column])}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </Card>
        ) : (
          <Card>
            <Text style={styles.muted}>
              Choose a report from the catalog and press Generate. Results
              appear here and can be exported to CSV.
            </Text>
          </Card>
        )}
      </ScrollView>
      <PlatformTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  toggleRow: {
    backgroundColor: "#16213E",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  mb4: {
    marginBottom: 16,
  },
  center: {
    alignItems: "center",
    paddingVertical: 20,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 8,
  },
  catalogItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  catalogItemActive: {
    backgroundColor: "rgba(232,163,61,0.1)",
  },
  catalogRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate,
  },
  catalogCat: {
    fontSize: 11,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
    marginLeft: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(71,84,103,0.7)",
    marginBottom: 6,
    marginTop: 8,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  selectText: {
    fontSize: 13,
    color: colors.ink,
  },
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
  dropdownText: {
    fontSize: 13,
    color: colors.ink,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
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
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  genBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amber,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  genBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  csvBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  csvBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  metaText: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 12,
  },
  resultTools: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  showing: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    marginBottom: 12,
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  th: {
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  thText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.slate,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  td: {
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tdText: {
    fontSize: 12.5,
    color: colors.slate,
  },
});
