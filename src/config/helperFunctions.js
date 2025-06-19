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

export const printReceiptViaQZ = async (data, setting) => {
  try {
    if (!window.qz) {
      alert("QZ Tray is not loaded. Please install and start QZ Tray.");
      return;
    }

    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
    }

    const printers = await qz.printers.find();
    const printerName = printers[0];
    const config = qz.configs.create(printerName, { encoding: "UTF-8" });

    const RECEIPT_WIDTH = 46;
    const DOUBLE_WIDTH = Math.floor(RECEIPT_WIDTH / 2);

    const center = (text, width = RECEIPT_WIDTH) => {
      const trimmed = text.length > width ? text.slice(0, width - 1) + "…" : text;
      const pad = Math.floor((width - trimmed.length) / 2);
      return " ".repeat(Math.max(0, pad)) + trimmed;
    };

    const centerDouble = (text) => {
      const trimmed = text.length > DOUBLE_WIDTH ? text.slice(0, DOUBLE_WIDTH - 1) + "…" : text;
      const pad = Math.floor((DOUBLE_WIDTH - trimmed.length) / 2);
      return " ".repeat(Math.max(0, pad)) + trimmed;
    };

    const formatAmount = (num) => {
      return Number(num).toLocaleString("en-PK", { maximumFractionDigits: 0 });
    };

    const headerRow = () => {
      const nameHeader = "Name".padEnd(22);
      const qtyHeader = "Qty".padStart(6);
      const priceHeader = "Price".padStart(18);
      return `${nameHeader}${qtyHeader}${priceHeader}`;
    };

    const formatLine = (name, qty, total) => {
      const nameColWidth = 22;
      const qtyColWidth = 6;
      const priceColWidth = 18;

      const nameTrimmed = name.length > nameColWidth
        ? name.slice(0, nameColWidth - 1) + "…"
        : name;

      const qtyStr = qty ? `${qty}` : "";
      const priceStr = `Rs ${formatAmount(total)}`;

      const namePadded = nameTrimmed.padEnd(nameColWidth, " ");
      const qtyPadded = qtyStr.padStart(qtyColWidth, " ");
      const pricePadded = priceStr.padStart(priceColWidth, " ");

      return `${namePadded}${qtyPadded}${pricePadded}`;
    };

    const formatTotalLine = (label, amount) => {
      const labelStr = label.padEnd(RECEIPT_WIDTH - 14, " ");
      const priceStr = `Rs ${formatAmount(amount)}`.padStart(14, " ");
      return `${labelStr}${priceStr}`;
    };

    const receiptData = [
      "\x1B\x40", // Initialize
      "\x1B\x21\x30", // Double width + height + bold
      centerDouble(setting.name.toUpperCase()) + "\n",
      "\x1B\x21\x00", // Reset to normal
      "\n",
      "\n",
      center(setting.address) + "\n",
      center(`Phone: ${setting.phone}`) + "\n",
      "\n",
      center("-".repeat(RECEIPT_WIDTH)) + "\n",
      "\n",
      center(`Invoice Type: ${data.type}`) + "\n",
      center(`Date: ${new Date(data.createdAt).toLocaleString()}`) + "\n",
      "\n",
      center("-".repeat(RECEIPT_WIDTH)) + "\n",
      "\n",
      headerRow() + "\n",
      "\n",
      ...data.selectedProducts.map(
        (item) => formatLine(item.name, item.quantity, item.total) + "\n"
      ),
      "\n",
      center("-".repeat(RECEIPT_WIDTH)) + "\n",
      "\n",
      formatTotalLine("Total Paid", data.amount) + "\n",
      "\n",
      center("Thank you for your purchase!") + "\n",
      "\n",
      "\x1B\x64\x05", // Feed 5 lines
      "\x1D\x56\x00", // Cut paper
    ];

    const printablePreview = receiptData
      .filter(line => typeof line === 'string' && !line.startsWith('\x1B') && !line.startsWith('\x1D'))
      .join("");

    console.log("🧾 Receipt Preview:\n\n" + printablePreview);

    await qz.print(config, receiptData);

    toast.success("✅ Receipt sent to printer!");
  } catch (err) {
    console.error("❌ Print error:", err);
    toast.error("❌ Print error: " + err.message || err);
  }
};

  
  