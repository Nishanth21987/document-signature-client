import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import API from '../utils/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignatureCanvas({ fileUrl, docId }) {
  const [numPages, setNumPages] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePlaceSignature = (e, pageNumber) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.bottom - e.clientY;
    setSignaturePosition({ x, y, pageNumber });
  };

  const handleSaveSignature = async () => {
    if (!signaturePosition) return alert('Place signature first');
    try {
      await API.post('/signatures/add', { docId, ...signaturePosition });
      alert('Signature position saved.');
    } catch (err) {
      console.error(err);
      alert('Error saving signature.');
    }
  };

  const handleFinalize = async () => {
    try {
      const signerIP = '127.0.0.1'; // Replace with actual IP capture logic if needed
      await API.post('/signatures/finalize', { docId, signerIP });
      alert('Document finalized with signatures.');
    } catch (err) {
      console.error(err);
      alert('Error finalizing document.');
    }
  };

  return (
    <div className="p-4">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className="relative border mb-4"
            onClick={(e) => handlePlaceSignature(e, index + 1)}
          >
            <Page pageNumber={index + 1} />
            {signaturePosition && signaturePosition.pageNumber === index + 1 && (
              <div
                className="absolute w-20 h-6 bg-blue-500 text-white text-xs flex items-center justify-center"
                style={{
                  left: signaturePosition.x,
                  bottom: signaturePosition.y,
                  transform: 'translate(-50%, 50%)',
                  pointerEvents: 'none',
                }}
              >
                Signature
              </div>
            )}
          </div>
        ))}
      </Document>
      <div className="flex space-x-4 mt-4">
        <button onClick={handleSaveSignature} className="bg-green-500 text-white px-4 py-2 rounded">
          Save Signature Position
        </button>
        <button onClick={handleFinalize} className="bg-blue-500 text-white px-4 py-2 rounded">
          Finalize Document
        </button>
      </div>
    </div>
  );
}

export default SignatureCanvas;
