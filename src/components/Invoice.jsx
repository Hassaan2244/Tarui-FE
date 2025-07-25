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
    color: "black",
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
    color: "black",
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "black",
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
    color: "black",
    textTransform: "uppercase",
  },

  // Invoice Info Section
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    paddingVertical: 15,
    marginBottom: 30,
  },
  infoColumn: {
    width: "33%",
  },
  infoTitle: {
    fontSize: 10,
    color: "black",
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    color: "black",
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
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
    backgroundColor: "black",
    color: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottom: "1px solid black",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
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
    color: "white",
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
    color: "black",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },

  // Notes Section
  notesSection: {
    marginTop: 30,
    borderTop: "1px solid black",
    paddingTop: 10,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  notesText: {
    fontSize: 9,
    color: "black",
  },

  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTop: "1px solid black",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "black",
  },
  signatureSection: {
    marginTop: 40,
    width: "30%",
  },
  signatureLine: {
    borderBottom: "1px solid black",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: "black",
    textAlign: "center",
  },

  // Words Amount
  wordsAmount: {
    fontSize: 9,
    marginTop: 10,
    color: "black",
  },
});

const Invoice = ({ ledgerDetail, data, setting }) => {
  const products = data?.selectedProducts || [];
  const isAmountType =
    data?.type === "Credit Amount" || data?.type === "Debit Amount";
  const amountInWords = numberToWords(parseFloat(data?.amount || 0));

  function formatWithCommas(number) {
    return Number(number).toLocaleString("en-US");
  }

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
            <Text style={styles.infoTitle}>Invoice To</Text>
            <Text style={styles.infoValue}>
              Customer Ledger No {data?.ledgerId}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Invoice Number:</Text>
              <Text style={styles.infoValue}>{data?.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Invoice Type:</Text>
              <Text style={styles.infoValue}>{data?.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoTitle}>Prepared By:</Text>
              <Text style={styles.infoValue}>{data?.preparedBy}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Date Issued</Text>
            <Text style={styles.infoValue}>{formatDate(data?.createdAt)}</Text>
          </View>
        </View>

        {/* Description */}
        {ledgerDetail?.description && (
          <View>
            <Text style={styles.infoTitle}>Customer Detail</Text>
            <Text style={{ ...styles.infoValue, marginBottom: 15 }}>
              {ledgerDetail?.description}
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
                <Text style={styles.infoTitle}>Amount In Words</Text>
                <Text style={styles.infoValue}>{amountInWords}</Text>
              </View>
              <View style={{ width: "40%", alignItems: "flex-end" }}>
                <Text style={styles.infoTitle}>Amount</Text>
                <Text
                  style={{
                    ...styles.infoValue,
                    fontSize: 20,
                    color: "black",
                  }}
                >
                  Rs {data?.amount}
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
                  Balance Details
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    width: "50%",
                    textAlign: "right",
                  }}
                >
                  Amount
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
                  Rs {data?.prevBalance}
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
                  {data?.type === "Credit Amount" ? "+" : "-"}Rs {data?.amount}
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
                  Rs {data?.runningBalance}
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
                  Product
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.descCell,
                  }}
                >
                  Description
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.qtyCell,
                  }}
                >
                  Qty
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.rateCell,
                  }}
                >
                  Rate
                </Text>
                <Text
                  style={{
                    ...styles.tableCell,
                    ...styles.headerText,
                    ...styles.totalCell,
                  }}
                >
                  Total
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
                    Rs {formatWithCommas(p.price)}
                  </Text>
                  <Text style={{ ...styles.tableCell, ...styles.totalCell }}>
                    Rs {formatWithCommas(p.total)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  Rs {formatWithCommas(data?.amount)}
                </Text>
              </View>
              <View
                style={{
                  ...styles.summaryRow,
                  marginTop: 5,
                  paddingTop: 5,
                  borderTop: "1px solid black",
                }}
              >
                <Text style={{ ...styles.summaryLabel, fontWeight: "bold" }}>
                  Total
                </Text>
                <Text style={styles.totalAmount}>
                  Rs {formatWithCommas(data?.amount)}
                </Text>
              </View>
              <Text style={styles.wordsAmount}>
                Amount in words: {amountInWords}
              </Text>
              {data.type == "Open Sell" ? (
                <></>
              ) : (
                <>
                  <View style={{ ...styles.summaryRow, marginTop: 15 }}>
                    <Text style={styles.summaryLabel}>Payment Status</Text>
                    <Text
                      style={{
                        ...styles.summaryValue,
                        color: "black",
                      }}
                    >
                      {data?.paid ? "Paid" : "Unpaid"}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Previous Balance</Text>
                    <Text style={styles.summaryValue}>
                      Rs {formatWithCommas(data?.prevBalance)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Current Balance</Text>
                    <Text
                      style={{ ...styles.summaryValue, fontWeight: "bold" }}
                    >
                      Rs {formatWithCommas(data?.runningBalance)}
                    </Text>
                  </View>
                </>
              )}
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
          <Text style={styles.notesTitle}>Thank You For Your Business</Text>
          <Text style={styles.notesText}>
            If you have any questions about this invoice, please contact us
            using the information provided at the top of this document.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {setting?.name} • Invoice # {data?.id}
          </Text>
          {/* <Text  style={styles.footerText}>Page 1 of 1</Text> */}
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
