import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const { currentFolder } = useContext(AppContext);
  const folderPath = currentFolder.path || [{ name: 'Home', id: 'root' }];

  return (
    <nav className="breadcrumb">
      {folderPath.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <span className="breadcrumb-item">{folder.name}</span>
          {index < folderPath.length - 1 && <span className="breadcrumb-separator">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
