import React from 'react';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className }) => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className}
    >
      <source src={src} type="video/webm; codecs=vp9,vorbis" />
      Your browser does not support the video tag.
    </video>
  );
}; 