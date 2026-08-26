import React, { useEffect, useState } from 'react';
import { rickrollFrames } from '../constants/rickroll';

const RickrollAnimation = () => {
    const [frameIndex, setFrameIndex] = useState(0);
    const [frames, setFrames] = useState([]);

    const LINES_PER_FRAME = 36;
    const FRAME_DELAY = 115; // ms

    useEffect(() => {
        // Split the raw string into lines
        // The raw string comes from a Python triple-quoted string, so it preserves newlines.
        const allLines = rickrollFrames.split('\n');
        const parsedFrames = [];

        // Chunk lines into frames
        for (let i = 0; i < allLines.length; i += LINES_PER_FRAME) {
            const frameLines = allLines.slice(i, i + LINES_PER_FRAME);
            // Only add if we have lines (skip empty chunks at the end)
            if (frameLines.length > 0) {
                parsedFrames.push(frameLines);
            }
        }
        setFrames(parsedFrames);
    }, []);

    useEffect(() => {
        if (frames.length === 0) return;

        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % frames.length);
        }, FRAME_DELAY);

        return () => clearInterval(interval);
    }, [frames]);

    const currentFrame = frames[frameIndex] || [];

    return (
        <section className="tui-tool rickroll-container">
            <div className="tui-tool-titlebar">
                <strong>/classified-output</strong>
                <span>frame {String(frameIndex + 1).padStart(3, '0')}/{String(frames.length).padStart(3, '0')}</span>
            </div>
            <div className="rickroll-frame" aria-label="Animated ASCII video">
                {currentFrame.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            {/* Hidden YouTube embed for audio */}
            <iframe
                width="0"
                height="0"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&showinfo=0&autohide=1&loop=1"
                title="Rickroll"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rickroll-audio"
            />
        </section>
    );
};

export default RickrollAnimation;
