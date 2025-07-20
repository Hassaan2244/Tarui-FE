import { pdf } from "@react-pdf/renderer";
import qz from "qz-tray";
import { toast } from "react-toastify";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export const numberToWords = (num) => {
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


export const printInvoice = async (invoiceComponent, filenamePrefix = "invoice") => {
  try {
    const blob = await pdf(invoiceComponent).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filenamePrefix}-${Date.now()}.pdf`;
    link.click();
    link.remove();

    setTimeout(() => {
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    }, 500);

    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);

  } catch (error) {
    console.error("Failed to generate and print invoice:", error);
  }
};

export const printReceiptViaQZ = (data, setting) => {
  const RECEIPT_WIDTH = 280; // Narrow width

  const formatAmount = (num) =>
    Number(num).toLocaleString("en-PK", { maximumFractionDigits: 0 });

  const formatLine = (sr, name, qty, price, total) => `
    <tr>
      <td class="cell sr">${sr}</td>
      <td class="cell name">${name}</td>
      <td class="cell qty">${qty}</td>
      <td class="cell price">${formatAmount(price)}</td>
      <td class="cell total">${formatAmount(total)}</td>
    </tr>
  `;

  const receiptHTML = `
    <html>
      <head>
        <style>
          @media print {
            @page {
              size: auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }

          body {
            font-family: monospace;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .receipt {
            width: ${RECEIPT_WIDTH}px;
            margin: 0 auto;
            padding: 6px 8px;
            box-sizing: border-box;
          }

          h2, p {
            text-align: center;
            margin: 2px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 10px;
          }

          th, td {
            padding: 2px 0;
            word-wrap: break-word;
            box-sizing: border-box;
          }

          .cell {
            padding: 2px 4px;
            vertical-align: top;
          }

          .sr { width: 8%; text-align: left; }
          .name { width: 36%; text-align: left; word-wrap: break-word; white-space: normal; }
          .qty { width: 10%; text-align: center; }
          .price { width: 23%; text-align: center; }
          .total { width: 23%; text-align: right; }

          .totals td {
            font-weight: bold;
            padding: 3px 4px;
          }

          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 6px 0;
          }

          .thankyou {
            text-align: center;
            padding: 10px 0 5px;
            font-weight: bold;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h2>${setting.name}</h2>
          <p>${setting.address}</p>
          <p>Ph No.: ${setting.phone}</p>
          ${setting.email ? `<p>Email: ${setting.email}</p>` : ""}
          <hr>
          <p style="text-align:center;">Cash Sale</p>
          <table>
            <tr>
              <td>Date:</td>
              <td>${new Date(data.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Invoice Type:</td>
              <td>${data.type}</td>
            </tr>
            <tr>
              <td>Prepared By:</td>
              <td>${data.preparedBy}</td>
            </tr>
          </table>
          <hr>
          <table>
            <thead>
              <tr>
                <th class="sr">#</th>
                <th class="name">Name</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
                <th class="total">Amount</th>
              </tr>
              <tr><td colspan="5"><hr></td></tr>
            </thead>
            <tbody>
              ${data.selectedProducts.map((item, index) =>
                formatLine(index + 1, item.name, item.quantity, item.price, item.total)
              ).join("")}
            </tbody>
          </table>
          <hr>
          <table class="totals">
            <tr>
              <td colspan="3">Total</td>
              <td colspan="2" style="text-align:right;">${formatAmount(data.amount)}</td>
            </tr>
            <tr>
              <td colspan="3">Received</td>
              <td colspan="2" style="text-align:right;">${formatAmount(data.amount)}</td>
            </tr>
            <tr>
              <td colspan="3">Balance</td>
              <td colspan="2" style="text-align:right;">0.00</td>
            </tr>
          </table>
          <hr>
          <p class="thankyou">Thank you for your purchase!</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  } else {
    alert("Popup blocked! Please allow popups for this site.");
  }
};
 

