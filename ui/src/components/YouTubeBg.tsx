import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
    LoadscreenConfig: any;
  }
}

interface YouTubeBgProps {
  play: boolean;
  mute: boolean;
  volume: number;
}

const YouTubeBg: React.FC<YouTubeBgProps> = ({ play, mute, volume }) => {
  const playerRef = useRef<any>(null);
  const config = window.LoadscreenConfig?.youtube || {};

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
        if (mute) playerRef.current.mute();
        playerRef.current.setVolume(volume);
        if (play) playerRef.current.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
        // Loop video if it ends
        if (event.data === window.YT.PlayerState.ENDED) {
            playerRef.current.playVideo();
        }
    };

    const initPlayer = () => {
        if (playerRef.current) return;
        
        new window.YT.Player('yt-player', {
            videoId: config.videoId || 'z0p06GfL-1U',
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                mute: mute ? 1 : 0,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    };

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = initPlayer;
        } else if (window.YT && window.YT.Player) {
            initPlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, []);

  useEffect(() => {
    if (playerRef.current) {
      if (play) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [play]);

  useEffect(() => {
    if (playerRef.current) {
      if (mute) playerRef.current.mute();
      else playerRef.current.unMute();
    }
  }, [mute]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  return (
    <div className="video-background-container">
      <div 
        id="yt-player"
        className="video-player-frame"
      />
      <div className="video-overlay" />
    </div>
  );
};

export default YouTubeBg;
