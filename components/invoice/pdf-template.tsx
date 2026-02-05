import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  invoiceInfo: {
    fontSize: 10,
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableColDesc: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export const InvoicePDF = ({ invoice, user, client }: { invoice: any, user: any, client: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>{user?.businessName || user?.name || 'My Business'}</Text>
            <Text style={styles.invoiceInfo}>{user?.email}</Text>
        </View>
        <View>
            <Text style={{fontSize: 18}}>INVOICE</Text>
            <Text style={styles.invoiceInfo}>Number: {invoice.number}</Text>
            <Text style={styles.invoiceInfo}>Date: {new Date(invoice.issueDate).toLocaleDateString()}</Text>
            <Text style={styles.invoiceInfo}>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <View>
              <Text style={{fontWeight: 'bold', fontSize: 12}}>Bill To:</Text>
              <Text style={styles.invoiceInfo}>{client.name}</Text>
              <Text style={styles.invoiceInfo}>{client.email}</Text>
              <Text style={styles.invoiceInfo}>{client.address || ''}</Text>
          </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColDesc}>
            <Text style={styles.tableCell}>Description</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Hours</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
        </View>
        
        {invoice.items && Array.isArray(invoice.items) && invoice.items.map((item: any, index: number) => (
             <View style={styles.tableRow} key={index}>
              <View style={styles.tableColDesc}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{Number(item.quantity).toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{invoice.currency} {Number(item.amount).toFixed(2)}</Text>
              </View>
            </View>
        ))}
      </View>

      <View style={styles.total}>
          <Text>Total: {invoice.currency} {Number(invoice.totalAmount).toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);
