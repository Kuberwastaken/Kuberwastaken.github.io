import React from 'react';
import { getAsciiArt } from '../../constants/asciiSelfie';

const systemFields = [
  ['operator', 'kuber@portfolio'],
  ['os', 'Arch Linux (obviously)'],
  ['host', 'Kuber Studio TUI'],
  ['kernel', 'sidequest-2.0.0'],
  ['uptime', 'forever'],
  ['shell', 'kuber-cli'],
  ['editor', 'Neovim'],
  ['terminal', 'custom Claude harness'],
  ['runtime', 'React · browser-native'],
  ['location', 'New Delhi, India']
];

export const SystemProfile = () => (
  <section className="tui-tool system-profile">
    <div className="tui-tool-titlebar">
      <strong>/neofetch</strong>
      <span>system profile · definitely accurate</span>
    </div>
    <div className="system-profile-grid">
      <pre className="system-profile-mark" aria-hidden="true">{`       /\\
      /  \\
     /\\   \\
    /      \\
   /   ,,   \\
  /   |  |  -\\
 /_-''    ''-_\\`}</pre>
      <div className="system-profile-data">
        <p className="system-profile-host">kuber@portfolio</p>
        <dl>
          {systemFields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="system-palette" aria-label="Kuber Studio color palette">
          {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
        </div>
      </div>
    </div>
  </section>
);

export const AsciiSelfie = () => (
  <section className="tui-tool ascii-selfie-view">
    <div className="tui-tool-titlebar">
      <strong>/ascii-selfie</strong>
      <span>original render · scrollable</span>
    </div>
    <div className="ascii-selfie-frame">
      <pre>{getAsciiArt()}</pre>
    </div>
  </section>
);
