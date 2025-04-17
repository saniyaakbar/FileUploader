import React, { createContext, useCallback, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentFolder, setCurrentFolder] = useState({ id: null , path: [{ name: 'Home', id: null }] });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [shouldRefetchFolders, setShouldRefetchFolders] = useState(false);
  const [currentParentFolderId, setCurrentParentFolderId] = useState(null);
  const triggerFolderRefetch = useCallback(() => {
    setShouldRefetchFolders((prev) => !prev); // Toggle to trigger useEffect
  }, []);
  
  const value = {
    currentFolder,
    setCurrentFolder,
    selectedFile,
    setSelectedFile,
    showUploadModal,
    setShowUploadModal,
    showFolderModal,
    setShowFolderModal,
    triggerFolderRefetch,
    shouldRefetchFolders,
    currentParentFolderId,
    setCurrentParentFolderId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
