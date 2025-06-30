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
  const RECEIPT_WIDTH = 300;

  const formatAmount = (num) =>
    Number(num).toLocaleString("en-PK", { maximumFractionDigits: 0 });

  const formatLine = (sr, name, qty, price, total) => `
    <tr>
      <td style="width:10%;text-align:left;">${sr}</td>
      <td style="width:32%;text-align:left;word-wrap:break-word;white-space:normal;">${name}</td>
      <td style="width:10%;text-align:center;">${qty}</td>
      <td style="width:24%;text-align:center;">${formatAmount(price)}</td>
      <td style="width:24%;text-align:right;">${formatAmount(total)}</td>
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
            display: inline-block;
            margin: 0;
            padding: 0;
          }
          .receipt {
            width: ${RECEIPT_WIDTH}px;
          }
          h2, p {
            text-align: center;
            margin: 4px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th, td {
            padding: 4px 2px;
            word-wrap: break-word;
          }
          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h2>${setting.name}</h2>
          <p>${setting.address}</p>
          <p>Phone: ${setting.phone}</p>
          <hr>
          <p>Invoice Type: ${data.type}</p>
          <p>Date: ${new Date(data.createdAt).toLocaleString()}</p>
          <hr>
          <table>
            <thead>
              <tr>
                <th style="width:10%;text-align:left;">SN</th>
                <th style="width:32%;text-align:left;">Name</th>
                <th style="width:10%;text-align:center;">Qty</th>
                <th style="width:24%;text-align:center;">Price</th>
                <th style="width:24%;text-align:right;">Total</th>
              </tr>
              <tr>
                <td colspan="5"><hr></td>
              </tr>
            </thead>
            <tbody>
              ${data.selectedProducts.map((item, index) =>
                formatLine(index + 1, item.name, item.quantity, item.price, item.total)
              ).join("")}
            </tbody>
          </table>
          <hr>
          <table>
            <tr>
              <td colspan="3" style="text-align:left;"><strong>Total Paid</strong></td>
              <td colspan="2" style="text-align:right; white-space:nowrap;">
                <strong>Rs ${formatAmount(data.amount)}</strong>
              </td>
            </tr>
          </table>
          <hr>
          <p>Thank you for your purchase!</p>
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


  
  