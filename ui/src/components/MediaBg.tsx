import React, { useEffect, useRef, useState } from 'react';

const VIDEOS = [
  './video/bg-1.webm',
  './video/bg-2.webm',
  './video/bg-3.webm',
  './video/bg-4.webm',
  './video/bg-5.webm',
  './video/bg-6.webm',
];

const AUDIO = './audio/song.mp3';

interface MediaBgProps {
  play: boolean;
  muted: boolean;
  volume: number; // 0..100
}

const MediaBg: React.FC<MediaBgProps> = ({ play, muted, volume }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Random starting clip each load
  const [index, setIndex] = useState(() => Math.floor(Math.random() * VIDEOS.length));

  // Audio: volume / mute / play
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.min(1, Math.max(0, volume / 100));
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = muted;
  }, [muted]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (play) a.play().catch(() => {});
    else a.pause();
  }, [play]);

  // Video: pause the whole montage when the user hits pause
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play, index]);

  const onEnded = () => setIndex((i) => (i + 1) % VIDEOS.length);

  return (
    <div className="video-background-container">
      <video
        ref={videoRef}
        className="video-player-frame"
        src={VIDEOS[index]}
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
      />
      <div className="video-overlay" />
      <audio ref={audioRef} src={AUDIO} loop autoPlay />
    </div>
  );
};

export default MediaBg;
