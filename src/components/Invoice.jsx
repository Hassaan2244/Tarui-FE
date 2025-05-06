import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  table: { display: "table", width: "auto" },
  row: { flexDirection: "row" },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    padding: 4,
  },
  bold: { fontWeight: "bold" },
});

const Invoice = ({ data }) => {
  console.log(data);
  const products = data?.selectedProducts;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>KASHIF ZIA CO.</Text>
        <Text style={styles.section}>
          Date: {new Date(data?.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.section}>Customer: Ledger #{data?.ledgerId}</Text>
        <Text style={styles.section}>Type: {data?.type}</Text>
        <Text style={styles.section}>Description: {data?.description}</Text>

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
          <Text>Amount: {data?.amount}</Text>
          <Text>Paid: {data?.paid ? "Yes" : "No"}</Text>
          <Text>Running Balance: {data?.runningBalance}</Text>
        </View>

        <Text style={{ marginTop: 30 }}>Thanks for shopping!</Text>
      </Page>
    </Document>
  );
};

export default Invoice;
