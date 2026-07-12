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
        if (mute) {
            playerRef.current.mute();
        } else {
            playerRef.current.unMute();
        }
        playerRef.current.setVolume(volume);
        if (play) {
            playerRef.current.playVideo();
        }
    };

    const onPlayerStateChange = (event: any) => {
        // Loop video if it ends
        if (event.data === window.YT.PlayerState.ENDED) {
            playerRef.current.playVideo();
        }
    };

    const initPlayer = () => {
        if (playerRef.current) return;

        const videoId = config.videoId || 'vHAsZ2hOltg';

        // YouTube error 153 = embed request arrived without a valid HTTP
        // referrer. CEF loadscreens don't send one by default, and a
        // non-http(s) origin (nui://…) is rejected outright. Fix:
        //   1. build the <iframe> ourselves with referrerpolicy="origin"
        //      so Chromium attaches an Origin-based Referer header
        //   2. only pass origin/widget_referrer when it's real http(s)
        const pageOrigin = window.location.origin || '';
        const isHttp = /^https?:/i.test(pageOrigin);

        const params = new URLSearchParams({
            autoplay: '1',
            controls: '0',
            disablekb: '1',
            enablejsapi: '1',
            fs: '0',
            iv_load_policy: '3',
            loop: '1',
            playlist: videoId,        // required for loop=1 to work
            modestbranding: '1',
            rel: '0',
            mute: '1',
        });
        if (isHttp) {
            params.set('origin', pageOrigin);
            params.set('widget_referrer', pageOrigin);
        }

        const mount = document.getElementById('yt-player');
        if (!mount) return;

        const iframe = document.createElement('iframe');
        iframe.id = 'yt-player-frame';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = '0';
        iframe.setAttribute('referrerpolicy', 'origin');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('frameborder', '0');
        iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
        mount.replaceChildren(iframe);

        new window.YT.Player(iframe, {
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    };

    useEffect(() => {
        // Define standard global callback first to prevent race condition
        window.onYouTubeIframeAPIReady = () => {
            initPlayer();
        };

        if (!window.YT || !window.YT.Player) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                document.head.appendChild(tag);
            }
        } else {
            initPlayer();
        }

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error("Error destroying YT player:", e);
                }
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
      <div id="yt-player" className="video-player-frame" style={{ pointerEvents: 'none' }} />
      <div className="video-overlay" />
    </div>
  );
};

export default YouTubeBg;
