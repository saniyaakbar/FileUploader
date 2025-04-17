import React, { useState, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/api/progress');
    eventSource.onmessage = (e) => {
      setProgress(Number(e.data));
    };
    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="progress-bar">
      <div className="filler" style={{ width: `${progress}%` }}>{progress}%</div>
    </div>
  );
};

export default ProgressBar;
