// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoKeys = ['clip1.mp4', 'clip2.mp4', 'clip3.mp4']; // Add more video keys as needed

  useEffect(() => {
    const videoPlayer = document.getElementById('videoPlayer');

    const fetchVideoUrlAndPlay = async (videoKey) => {
      try {
        const response = await fetch(`/api/stream-video?video=${encodeURIComponent(videoKey)}`);
        const data = await response.json();

        if (response.ok) {
          videoPlayer.src = data.url; // Set the video source to the URL
          videoPlayer.load();
          videoPlayer.play();
        } else {
          throw new Error(data.error || 'Error fetching video');
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    };

    fetchVideoUrlAndPlay(videoKeys[currentVideoIndex]);

    const playNextVideo = () => {
      const newIndex = (currentVideoIndex + 1) % videoKeys.length;
      setCurrentVideoIndex(newIndex);
      fetchVideoUrlAndPlay(videoKeys[newIndex]);
    };

    videoPlayer.addEventListener('ended', playNextVideo);

    return () => {
      videoPlayer.removeEventListener('ended', playNextVideo);
    };
  }, [currentVideoIndex, videoKeys]);

  return (
    <>
      <Head>
        <title>Video Streaming</title>
      </Head>
      <div className={styles.videoContainer}>
        <video id="videoPlayer" className={styles.videoPlayer} controls autoPlay />
      </div>
    </>
  );
}
