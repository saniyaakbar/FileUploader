import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from './components/Breadcrumb';
import FolderTree from './components/FolderTree';
import FileList from './components/FileList';
import DocumentViewer from './components/DocumentViewer';
import FileUploadModal from './components/FileUploadModal';
import FolderCreationModal from './components/FolderCreationModal';
import { AppContext } from './context/AppContext';
import './App.css';
import Actions from './components/Actions'; // Import the Actions component

const App = () => {
  const { setShowUploadModal, showUploadModal, showFolderModal, setShowFolderModal, shouldRefetchFolders } = useContext(AppContext);
  const [files, setfiles] = useState(null);
  const [folders, setfolders] = useState([]);
  const [filters, setFilters] = useState({}); // State to hold the filter values

  useEffect(() => {
    fetchFiles();
    fetchFoldersWithFilters(filters); // Fetch with initial filters (empty)
    return () => {};
  }, [shouldRefetchFolders, filters]); // Re-fetch when filters change

  const fetchFiles = (page = 1) => {
    fetch(`http://localhost:5000/api/folders-files`)
      .then((res) => res.json())
      .then((data) => setfiles(data.total))
      .catch((err) => console.error(err));
  };

  const fetchFolders = (page = 1) => {
    fetch(`http://localhost:5000/api/parent-folders`)
      .then((res) => res.json())
      .then((data) => setfolders(data))
      .catch((err) => console.error(err));
  };

  const fetchFoldersWithFilters = async (filters) => {
    const queryParams = new URLSearchParams();
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.description) queryParams.append('description', filters.description);
    if (filters.date) queryParams.append('date', filters.date);

    try {
      const response = await fetch(`http://localhost:5000/api/filtered-data?${queryParams.toString()}`);
      const data = await response.json();
      setfolders(data); // Assuming your new route returns the filtered folders
    } catch (error) {
      console.error('Error fetching filtered folders:', error);
    }
  };

  const handleCreateFolderClick = () => {
    setShowFolderModal(true);
  };

  const handleUploadDocumentClick = () => {
    setShowUploadModal(true);
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      {/* Top Section */}
      <header className="top-section">
        <Breadcrumb />
        <div className="actions">
          <Actions
            handleCreateFolderClick={handleCreateFolderClick}
            handleUploadDocumentClick={handleUploadDocumentClick}
            onApplyFilter={handleApplyFilter}
          />
        </div>
      </header>

      <div className="content">
        {/* Left Section */}
        <aside className="left-section">
          <div className="container">
            <h5>Folders & Documents</h5>
            <div className="item-wrapper">
              <div className="item">
                <img src="/icons/Folder.svg" alt="Folder Icon" className="icon" />
                <p className="label">Folders</p>
                <h3>{folders.length}</h3>
              </div>
              <div className="separator" />
              <div className="item">
                <img src="/icons/file.svg" alt="File Icon" className="icon" />
                <p className="label">Documents</p>
                <h3>{files}</h3>
              </div>
            </div>
          </div>
          <FolderTree folders={folders} />
          {/* <div className="upload-progress">
            <h4>Upload Progress</h4>
            <ProgressBar />
          </div> */}
        </aside>

        {/* Middle Section */}
        <main className="middle-section">
          <FileList folders={folders} />
        </main>

        {/* Right Section
        <aside className="right-section">
          <DocumentViewer />
        </aside> */}
      </div>

      {/* Modals */}
      {showUploadModal && <FileUploadModal />}
      {showFolderModal && <FolderCreationModal />}
    </div>
  );
};

export default App;