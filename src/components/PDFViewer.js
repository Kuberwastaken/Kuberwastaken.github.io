import React from 'react';

const PDFViewer = () => {
  return (
    <section className="tui-tool resume-viewer">
      <div className="tui-tool-titlebar">
        <strong>/resume</strong>
        <span>pdf · remote document</span>
      </div>
      <div className="resume-actions">
        <span>Resume.pdf</span>
        <a href="https://resume.kuber.studio/Resume.pdf" target="_blank" rel="noopener noreferrer">
          open in new tab ↗
        </a>
      </div>
      <iframe
        src="https://resume.kuber.studio/Resume.pdf"
        title="Resume PDF"
        className="resume-frame"
      />
    </section>
  );
};

export default PDFViewer;
