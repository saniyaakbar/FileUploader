import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './DocumentViewer.css';

const DocumentViewer = () => {
  const { selectedFile } = useContext(AppContext);

  if (!selectedFile) {
    return <div>Please select a file to view.</div>;
  }

  // Adjust the URL if needed (e.g., serving from your server)
  const fileUrl = `http://localhost:5000/${selectedFile.filePath}`;

  return (
    <div className="document-viewer">
      <iframe src={fileUrl} title="Document Viewer" width="100%" height="600px"></iframe>
    </div>
  );
};

export default DocumentViewer;
