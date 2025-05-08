import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { numberToWords } from "../config/helperFunctions";

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

const Invoice = ({ data, setting }) => {
  const products = data?.selectedProducts || [];
  const isAmountType =
    data?.type === "Credit Amount" || data?.type === "Debit Amount";
  const amountInWords = numberToWords(parseFloat(data?.amount || 0));

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={[styles.largeText, styles.bold]}>{setting?.name}</Text>
        <Text style={[styles.largeText, styles.bold]}>{setting?.address}</Text>
        <Text style={[styles.largeText, styles.bold]}>{setting?.phone}</Text>
        <Text style={[styles.largeText, styles.bold]}>{setting?.email}</Text>
        {setting?.icon && (
          <Image style={{ width: 100, height: 100 }} source={setting.icon} />
        )}
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
              <Text style={styles.section}>
                Paid: {data?.paid ? "Yes" : "No"}
              </Text>
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
