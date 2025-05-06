import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Amount in words utility
const numberToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    return (
      inWords(Math.floor(n / 100000)) +
      " Lakh" +
      (n % 100000 ? " " + inWords(n % 100000) : "")
    );
  };
  return inWords(Number(num)) + " Only";
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  table: { display: "table", width: "auto", marginTop: 10 },
  row: { flexDirection: "row" },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    padding: 4,
  },
  bold: { fontWeight: "bold" },
  underline: { textDecoration: "underline" },
  rightAlign: { textAlign: "right" },
  largeText: { fontSize: 18, marginBottom: 10 },
});

const Invoice = ({ data }) => {
  const products = data?.selectedProducts || [];
  const isAmountType =
    data?.type === "Credit Amount" || data?.type === "Debit Amount";
  const amountInWords = numberToWords(parseFloat(data?.amount || 0));

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={[styles.largeText, styles.bold]}>KASHIF ZIA CO.</Text>

        <Text style={styles.section}>
          Date: {new Date(data?.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.section}>Customer: Ledger #{data?.ledgerId}</Text>
        <Text style={styles.section}>Invoice #{data?.id}</Text>
        <Text style={styles.section}>Type: {data?.type}</Text>
        <Text style={styles.section}>Description: {data?.description}</Text>

        {isAmountType ? (
          <>
            <View style={[styles.section]}>
              <Text>Amount: {data?.amount}</Text>
            </View>
            <Text style={styles.section}>Amount in words: {amountInWords}</Text>
            <Text style={styles.section}>
              Previous Balance:{data?.prevBalance}
            </Text>
            <Text style={styles.section}>
              Ledger Current Balance: {data?.runningBalance}
            </Text>
          </>
        ) : (
          <>
            {/* Table Header */}
            <View style={[styles.table, styles.row, styles.bold]}>
              <Text style={styles.cell}>#</Text>
              <Text style={styles.cell}>Product</Text>
              <Text style={styles.cell}>Desc</Text>
              <Text style={styles.cell}>Qty</Text>
              <Text style={styles.cell}>Rate</Text>
              <Text style={styles.cell}>Total</Text>
            </View>

            {/* Table Rows */}
            {products.map((p, i) => (
              <View style={styles.row} key={i}>
                <Text style={styles.cell}>{i + 1}</Text>
                <Text style={styles.cell}>{p.name}</Text>
                <Text style={styles.cell}>{p.description}</Text>
                <Text style={styles.cell}>{p.quantity}</Text>
                <Text style={styles.cell}>{p.price}</Text>
                <Text style={styles.cell}>{p.total}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={{ marginTop: 20 }}>
              <Text>Net Total: {data?.amount}</Text>
              <Text>Amount in words: {amountInWords}</Text>
              <Text>Previous Balance: {data?.prevBalance}</Text>
              <Text>Running Balance: {data?.runningBalance}</Text>
            </View>
          </>
        )}

        <View style={{ marginTop: 40 }}>
          <Text>___________________________</Text>
          <Text>Signature</Text>
        </View>

        <Text style={{ marginTop: 20 }}>Thanks for Shopping</Text>
      </Page>
    </Document>
  );
};

export default Invoice;
