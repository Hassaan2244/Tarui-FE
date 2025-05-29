import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyDetails: {
    maxWidth: "60%",
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2563eb",
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "#555555",
  },
  logoContainer: {
    alignItems: "flex-end",
  },
  logo: {
    height: 70,
    objectFit: "contain",
  },
  page: { padding: 30, fontSize: 10 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottom: "1 solid #ccc",
    paddingVertical: 4,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#eee",
    fontWeight: "bold",
    paddingVertical: 5,
  },
  cell: { flex: 1, paddingRight: 5 },
});

// Helper to format date and time
const formatDateTime = (iso) => {
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Define types for credit and debit
const creditTypes = ["Credit Amount", "Sell", "Open Sell", "Return-Out"];
const debitTypes = ["Debit Amount", "Buy", "Return-In"];

// PDF Component
const LedgerPDFDocument = ({ ledger, dateRange, transactions, setting }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Ledger Transactions Report</Text>
      <View style={styles.headerContainer}>
        <View style={styles.companyDetails}>
          <Text style={styles.companyName}>{setting?.name}</Text>
          <Text style={styles.companyInfo}>{setting?.address}</Text>
          <Text style={styles.companyInfo}>Phone: {setting?.phone}</Text>
          <Text style={styles.companyInfo}>Email: {setting?.email}</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={setting?.icon} />
        </View>
      </View>
      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Name:</Text> {ledger.name}
        </Text>
        <Text>
          <Text style={styles.label}>Description:</Text> {ledger.description}
        </Text>
        <Text>
          <Text style={styles.label}>Latest Balance:</Text> Rs.{" "}
          {Number(ledger.latestBalance).toLocaleString()}
        </Text>
        <Text>
          <Text style={styles.label}>Date Range:</Text> {dateRange}
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={styles.headerRow}>
          <Text style={styles.cell}>Date</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Type</Text>
          <Text style={styles.cell}>Credit</Text>
          <Text style={styles.cell}>Debit</Text>
          <Text style={styles.cell}>Paid</Text>
          <Text style={styles.cell}>Running Balance</Text>
        </View>

        {transactions.map((tx) => {
          const isCredit = creditTypes.includes(tx.type);
          const isDebit = debitTypes.includes(tx.type);
          const creditAmount = isCredit
            ? `Rs. ${Number(tx.amount).toLocaleString()}`
            : "-";
          const debitAmount = isDebit
            ? `Rs. ${Number(tx.amount).toLocaleString()}`
            : "-";

          return (
            <View style={styles.row} key={tx.id}>
              <Text style={styles.cell}>{formatDateTime(tx.createdAt)}</Text>
              <Text style={styles.cell}>{tx.description || "N/A"}</Text>
              <Text style={styles.cell}>{tx.type}</Text>
              <Text style={styles.cell}>{creditAmount}</Text>
              <Text style={styles.cell}>{debitAmount}</Text>
              <Text style={styles.cell}>{tx.paid ? "Yes" : "No"}</Text>
              <Text style={styles.cell}>
                Rs. {Number(tx.runningBalance).toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default LedgerPDFDocument;
