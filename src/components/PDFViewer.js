import React from 'react';
// CSS styling removed for CSS Naked Day: https://css-naked-day.github.io/

const PDFViewer = () => {
  return (
    <div align="center">
      <iframe
        src="https://kuberwastaken.github.io/Resume/Resume.pdf"
        title="Resume PDF"
        width="100%"
        height="800"
        frameBorder="0"
      />
    </div>
  );
};

export default PDFViewer;