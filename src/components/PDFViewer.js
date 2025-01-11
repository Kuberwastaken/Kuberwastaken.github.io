import React from 'react';

const PDFViewer = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <iframe
        src="https://kuberwastaken.github.io/Resume/Resume.pdf"
        title="Resume PDF"
        width="100%"
        height="800px"
        style={{
          border: 'none',
          maxWidth: '1000px'
        }}
      />
    </div>
  );
};

export default PDFViewer;