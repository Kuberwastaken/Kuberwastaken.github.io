import React from 'react';
import './ToS.css';

const ToS = () => {
  return (
    <div className="tos-container">
      <div className="tos-header">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="tos-content">
        <section className="tos-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this portfolio website ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="tos-section">
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
            <li>attempt to decompile or reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="tos-section">
          <h2>3. Disclaimer</h2>
          <p>
            The materials on this website are provided on an 'as is' basis. I make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="tos-section">
          <h2>4. Limitations</h2>
          <p>
            In no event shall Kuber Mehta or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
          </p>
        </section>

        <section className="tos-section">
          <h2>5. Privacy Policy</h2>
          <p>
            Your privacy is important to us. This website may collect basic analytics data to improve user experience. No personal information is stored or shared with third parties without your explicit consent.
          </p>
        </section>

        <section className="tos-section">
          <h2>6. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact me at: 
            <a href="mailto:kuberhob@gmail.com" className="tos-link"> kuberhob@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="tos-footer">
        <button onClick={() => window.history.back()} className="tos-back-btn">
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );
};

export default ToS; 