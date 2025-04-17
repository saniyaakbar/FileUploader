import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './FolderTree.css';
import FolderAccordion from './Accordian';

const FolderTree = () => {
  const { setCurrentFolder } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async (folderId = null) => {
    setLoading(true);
    setError(null);
    try {
      const filesResponse = await fetch(
        `http://localhost:5000/api/files${folderId ? `?folderId=${folderId}` : ''}`
      );
      const filesData = await filesResponse.json();

      const foldersResponse = await fetch(
        `http://localhost:5000/api/folders${folderId ? `?parent=${folderId}` : ''}`
      );
      const foldersData = await foldersResponse.json();

      const combinedItems = [
        ...foldersData.items.map(folder => ({ ...folder, type: 'folder' })),
        ...filesData.items.map(file => ({ ...file, type: 'file' })),
      ];

      // Structure the data into a hierarchical format if needed for Accordion
      // For a simple flat list within the root level, we can just set the items.
      setItems(combinedItems);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message || 'Failed to fetch items');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch root level folders and files on component mount
    fetchItems(null);
  }, []);

  if (loading) {
    return <div>Loading file structure...</div>;
  }

  if (error) {
    return <div>Error loading file structure: {error}</div>;
  }

  return (
    <div className="folder-tree">
      <ul>
        {items
          ?.filter(item => item.type === 'folder') // Only display folders at the root level initially
          .map((folder) => (
            <FolderAccordion key={folder._id} folder={folder} fetchSubItems={fetchItems} />
          ))}
        {items
          ?.filter(item => item.type === 'file') // Display files at the root level
          .map((file) => (
            <li key={file._id} className="file-item">
              <InsertDriveFileIcon sx={{ mr: 1 }} />
              {file.fileName}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FolderTree;