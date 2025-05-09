import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { formatDate, numberToWords } from "../config/helperFunctions";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333333",
  },

  // Header Styles
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

  // Invoice Title Section
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2563eb",
    textTransform: "uppercase",
  },

  // Invoice Info Section
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 15,
    marginBottom: 30,
  },
  infoColumn: {
    width: "33%",
  },
  infoTitle: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  // Table Styles
  table: {
    display: "table",
    width: "100%",
    marginVertical: 15,
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    paddingVertical: 2,
  },
  tableCell: {
    padding: 8,
  },
  indexCell: { width: "5%" },
  productCell: { width: "30%" },
  descCell: { width: "25%" },
  qtyCell: { width: "10%", textAlign: "center" },
  rateCell: { width: "15%", textAlign: "right" },
  totalCell: { width: "15%", textAlign: "right" },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4b5563",
  },

  // Summary Styles
  summary: {
    marginTop: 20,
    marginLeft: "auto",
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
  },

  // Notes Section
  notesSection: {
    marginTop: 30,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4b5563",
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
  },

  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTop: "1px solid #e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  signatureSection: {
    marginTop: 40,
    width: "30%",
  },
  signatureLine: {
    borderBottom: "1px solid #9ca3af",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },

  // Words Amount
  wordsAmount: {
    fontSize: 9,
    marginTop: 10,
    color: "#6b7280",
  },
});

const Invoice = ({ data, setting }) => {
  const products = data?.selectedProducts || [];
  const isAmountType =
    data?.type === "Credit Amount" || data?.type === "Debit Amount";
  const amountInWords = numberToWords(parseFloat(data?.amount || 0));

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
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

        {/* Invoice Title */}
        <Text style={styles.invoiceTitle}>Invoice</Text>

        {/* Invoice Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>INVOICE TO</Text>
            <Text style={styles.infoValue}>
              Customer Ledger #{data?.ledgerId}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>INVOICE NUMBER</Text>
            <Text style={styles.infoValue}>#{data?.id}</Text>
            <Text style={styles.infoTitle}>INVOICE TYPE</Text>
            <Text style={styles.infoValue}>{data?.type}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>DATE ISSUED</Text>
            <Text style={styles.infoValue}>{formatDate(data.createdAt)}</Text>
          </View>
        </View>

        {/* Description */}
        {data?.description && (
          <View>
            <Text style={styles.infoTitle}>DESCRIPTION</Text>
            <Text style={{ ...styles.infoValue, marginBottom: 15 }}>
              {data.description}
            </Text>
          </View>
        )}

        {isAmountType ? (
          <>
            {/* Amount Type Invoice */}
            <View
              style={{
                ...styles.infoContainer,
                marginTop: 10,
                paddingVertical: 20,
              }}
            >
              <View style={{ width: "60%" }}>
                <Text style={styles.infoTitle}>AMOUNT IN WORDS</Text>
                <Text style={styles.infoValue}>{amountInWords}</Text>
              </View>
              <View style={{ width: "40%", alignItems: "flex-end" }}>
                <Text style={styles.infoTitle}>AMOUNT</Text>
                <Text
                  style={{
                    ...styles.infoValue,
                    fontSize: 20,
                    color: "#2563eb",
                  }}
                >
                  rs {data?.amount}
                </Text>
              </View>
            </View>

            {/* Balance Information */}
            <View style={{ ...styles.table, marginTop: 30 }}>
              <View style={styles.tableHeader}>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    width: "50%",
                  }}
                >
                  BALANCE DETAILS
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    width: "50%",
                    textAlign: "right",
                  }}
                >
                  AMOUNT
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: "50%" }}>
                  Previous Balance
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    width: "50%",
                    textAlign: "right",
                  }}
                >
                  rs {data?.prevBalance}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, width: "50%" }}>
                  Current Transaction
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    width: "50%",
                    textAlign: "right",
                    color:
                      data?.type === "Credit Amount" ? "#10b981" : "#ef4444",
                  }}
                >
                  {data?.type === "Credit Amount" ? "+" : "-"}rs {data?.amount}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text
                  style={{
                    ...styles.tableCell,
                    width: "50%",
                    fontWeight: "bold",
                  }}
                >
                  Ledger Current Balance
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    width: "50%",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  rs {data?.runningBalance}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Products Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.indexCell,
                  }}
                >
                  #
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.productCell,
                  }}
                >
                  PRODUCT
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.descCell,
                  }}
                >
                  DESCRIPTION
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.qtyCell,
                  }}
                >
                  QTY
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.rateCell,
                  }}
                >
                  RATE
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.totalCell,
                  }}
                >
                  TOTAL
                </Text>
              </View>

              {/* Table Rows */}
              {products.map((p, i) => (
                <View style={styles.tableRow} key={i}>
                  <Text style={{ ...styles.tableCell, ...styles.indexCell }}>
                    {i + 1}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.productCell }}>
                    {p.name}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.descCell }}>
                    {p.description}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.qtyCell }}>
                    {p.quantity}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.rateCell }}>
                    rs {p.price}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.totalCell }}>
                    rs {p.total}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>SUBTOTAL</Text>
                <Text style={styles.summaryValue}>rs {data?.amount}</Text>
              </View>
              <View
                style={{
                  ...styles.summaryRow,
                  marginTop: 5,
                  paddingTop: 5,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Text style={{ ...styles.summaryLabel, fontWeight: "bold" }}>
                  TOTAL
                </Text>
                <Text style={styles.totalAmount}>rs {data?.amount}</Text>
              </View>
              <Text style={styles.wordsAmount}>
                Amount in words: {amountInWords}
              </Text>

              <View style={{ ...styles.summaryRow, marginTop: 15 }}>
                <Text style={styles.summaryLabel}>PAYMENT STATUS</Text>
                <Text
                  style={{
                    ...styles.summaryValue,
                    color: data?.paid ? "#10b981" : "#ef4444",
                  }}
                >
                  {data?.paid ? "PAID" : "UNPAID"}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>PREVIOUS BALANCE</Text>
                <Text style={styles.summaryValue}>rs {data?.prevBalance}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>CURRENT BALANCE</Text>
                <Text style={{ ...styles.summaryValue, fontWeight: "bold" }}>
                  rs {data?.runningBalance}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Authorized Signature</Text>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>THANK YOU FOR YOUR BUSINESS</Text>
          <Text style={styles.notesText}>
            If you have any questions about this invoice, please contact us
            using the information provided at the top of this document.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {setting?.name} • Invoice #{data?.id}
          </Text>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
