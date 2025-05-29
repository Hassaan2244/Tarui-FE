import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { DownloadIcon, XIcon } from "lucide-react";
import api from "../config/api";
import LedgerPDFDocument from "./LedgerPDFDocument";
import { useSelector } from "react-redux";

const LedgerDownloadModal = ({ ledgerId }) => {
  const { setting } = useSelector((state) => state.billSetting);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/ledger/${ledgerId}/transactions?startDate=${startDate}&endDate=${endDate}`
      );
      const { transactions, ledger } = response.data;

      const blob = await pdf(
        <LedgerPDFDocument
          setting={setting}
          ledger={ledger}
          dateRange={`${startDate} to ${endDate}`}
          transactions={transactions}
        />
      ).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ledger-${ledgerId}.pdf`;
      link.click();
      setShowModal(false);
    } catch (err) {
      console.error("PDF download failed", err);
      alert("Failed to download PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        <span>Download Ledger</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Select Date Range
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Start Date */}
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-300 font-medium">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/30 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            {/* End Date */}
            <div className="mb-6">
              <label className="block mb-1 text-sm text-gray-300 font-medium">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/30 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LedgerDownloadModal;
