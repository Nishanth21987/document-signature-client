import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams, useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import API from '../utils/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ViewAndSign() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [docUrl, setDocUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({
    width: 600,
    height: 800,
    pdfWidth: 600,
    pdfHeight: 800,
  });
  const [signerName, setSignerName] = useState('');
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100, pageNumber: 1 });

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await API.get(`/documents/${docId}`);
        setDocUrl(`http://localhost:5000/${res.data.path}`);
      } catch (err) {
        console.error(err);
        alert('Error loading document');
        navigate('/dashboard');
      }
    };
    fetchDoc();
  }, [docId, navigate]);

  const handleSaveSignature = async () => {
    if (!signerName) {
      alert('Please enter your signature name first.');
      return;
    }
    try {
      const scaledX = (signaturePosition.x / pageDimensions.width) * pageDimensions.pdfWidth;
      const scaledY = pageDimensions.pdfHeight - (signaturePosition.y / pageDimensions.height) * pageDimensions.pdfHeight;

      console.log({
        docId,
        x: scaledX,
        y: scaledY,
        pageNumber: signaturePosition.pageNumber,
        signerName,
      });

      await API.post('/signatures/add', {
        docId,
        x: scaledX,
        y: scaledY,
        pageNumber: signaturePosition.pageNumber,
        signerName,
      });
      alert('Signature saved. Now finalize to embed.');
    } catch (err) {
      console.error(err);
      alert('Error saving signature');
    }
  };

  const handleFinalize = async () => {
    try {
      const signerIP = '127.0.0.1';
      const res = await API.post('/signatures/finalize', { docId, signerIP });
      alert('Document finalized! Downloading signed document.');
      window.open(`http://localhost:5000/${res.data.signedPath}`, '_blank');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error finalizing document');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">View and Sign Document</h1>
      <input
        type="text"
        placeholder="Type your signature name"
        value={signerName}
        onChange={(e) => setSignerName(e.target.value)}
        className="border p-2 mb-4 w-full max-w-sm"
      />
      <div className="flex flex-col items-center">
        {docUrl ? (
          <Document
            file={docUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="border"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={index} className="relative mb-4">
                <Page
                  pageNumber={index + 1}
                  width={600}
                  onLoadSuccess={({ originalWidth, originalHeight }) =>
                    setPageDimensions({
                      width: 600,
                      height: (originalHeight * 600) / originalWidth,
                      pdfWidth: originalWidth,
                      pdfHeight: originalHeight,
                    })
                  }
                />
                {signaturePosition.pageNumber === index + 1 && signerName && (
                  <Draggable
                    position={{ x: signaturePosition.x, y: signaturePosition.y }}
                    onStop={(_, data) =>
                      setSignaturePosition({
                        ...signaturePosition,
                        x: data.x,
                        y: data.y,
                        pageNumber: index + 1,
                      })
                    }
                  >
                    <div className="absolute cursor-move bg-white/80 text-lg font-serif text-black border px-2 rounded">
                      {signerName}
                    </div>
                  </Draggable>
                )}
              </div>
            ))}
          </Document>
        ) : (
          <p>Loading document...</p>
        )}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSaveSignature}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Signature Position
        </button>
        <button
          onClick={handleFinalize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Finalize Document
        </button>
      </div>
    </div>
  );
}

export default ViewAndSign;
