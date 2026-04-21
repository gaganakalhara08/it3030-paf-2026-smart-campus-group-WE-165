import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Copy } from "lucide-react";
import toast from "react-hot-toast";

const QRCodeDisplay = ({ bookingId, bookingUrl }) => {
  const qrRef = React.useRef();

  // Ensure bookingUrl is a string
  const finalUrl = typeof bookingUrl === "string" ? bookingUrl : `http://172.20.10.2:5173/user/bookings/${bookingId}`;

  // Convert localhost to IP address for mobile access
  const getAccessibleUrl = () => {
    if (finalUrl && finalUrl.includes("localhost")) {
      return finalUrl.replace("localhost:5173", "172.20.10.2:5173");
    }
    return finalUrl;
  };

  const accessibleUrl = getAccessibleUrl();

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector("svg");
    if (!svg) {
      toast.error("QR code not found");
      return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `booking-${bookingId}.png`;
      link.href = pngUrl;
      link.click();
      toast.success("QR Code downloaded!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyBookingUrl = () => {
    navigator.clipboard.writeText(accessibleUrl);
    toast.success("Booking URL copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">QR Code</h3>
      <p className="text-sm text-gray-600 mb-2">
        Scan this QR code with your mobile phone to view booking details
      </p>
      <p className="text-xs text-gray-500 mb-6">
        📱 Make sure your phone is connected to the same WiFi network (172.20.10.x)
      </p>

      <div className="flex flex-col items-center gap-6">
        {/* QR Code Display */}
        <div
          ref={qrRef}
          className="p-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center"
        >
          {accessibleUrl && typeof accessibleUrl === "string" ? (
            <QRCodeSVG
              value={accessibleUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          ) : (
            <p className="text-red-500">Error: Invalid QR code URL</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full flex-wrap justify-center">
          <button
            onClick={downloadQRCode}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            <Download size={18} />
            Download QR
          </button>
          <button
            onClick={copyBookingUrl}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            <Copy size={18} />
            Copy URL
          </button>
        </div>

        {/* Booking URL */}
        <div className="w-full bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <p className="text-xs text-gray-600 mb-1 font-semibold">📍 Mobile-Accessible URL:</p>
          <p className="text-sm text-blue-900 break-all font-mono bg-white p-2 rounded border border-blue-100">
            {accessibleUrl}
          </p>
          <p className="text-xs text-gray-600 mt-3">
            ✅ This URL works on your mobile phone over WiFi<br/>
            💡 Your WiFi network: <span className="font-semibold">172.20.10.x</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;