import { pdf } from "@react-pdf/renderer";

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

        const printWindow = window.open(url, "_blank");
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        }

        // Cleanup
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to generate and print invoice:", error);
    }
};
