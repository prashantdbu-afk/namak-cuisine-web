"use client";

import { useEffect, useRef, useState } from "react";
import { getImageRecord } from "@/media/manifest";
import { resolveImage, resolveVideo } from "@/media/resolve-media";
import type { VideoRecord } from "@/media/types";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function shouldLoadHeroVideo({
  reducedMotion,
  saveData,
  effectiveType,
}: {
  reducedMotion: boolean;
  saveData?: boolean;
  effectiveType?: string;
}) {
  return (
    !reducedMotion &&
    !saveData &&
    effectiveType !== "slow-2g" &&
    effectiveType !== "2g"
  );
}

export function DeferredHeroVideo({
  media,
  className,
}: {
  media: VideoRecord;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [eligible, setEligible] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const resolved = resolveVideo(media);
  const poster = resolveImage(getImageRecord(media.posterId));

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    const permitted = shouldLoadHeroVideo({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      saveData: connection?.saveData,
      effectiveType: connection?.effectiveType,
    });
    const eligibilityTimer = window.setTimeout(() => setEligible(permitted), 0);
    if (!permitted || !frameRef.current)
      return () => window.clearTimeout(eligibilityTimer);
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "240px" },
    );
    observer.observe(frameRef.current);
    return () => {
      window.clearTimeout(eligibilityTimer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !eligible || failed) return;
    const syncPlayback = () => {
      if (nearViewport && !document.hidden)
        video
          .play()
          .then(() => setPlaying(true))
          .catch(() => setFailed(true));
      else {
        video.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [eligible, nearViewport, failed]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused)
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setFailed(true));
    else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={frameRef} className={`deferred-video ${className ?? ""}`}>
      {eligible && nearViewport && !failed && (
        <video
          ref={videoRef}
          poster={poster}
          preload="none"
          muted
          playsInline
          loop={media.decorative}
          aria-hidden={media.decorative}
          onError={() => setFailed(true)}
        >
          {resolved.webmUrl && (
            <source src={resolved.webmUrl} type="video/webm" />
          )}
          <source
            src={resolved.mp4Url}
            type="video/mp4"
            media="(min-width: 700px)"
          />
          <source src={resolved.mobileUrl} type="video/mp4" />
        </video>
      )}
      <div
        className="video-poster"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden
      />
      {eligible && !failed && (
        <button
          type="button"
          className="video-control"
          onClick={toggle}
          aria-label={
            playing ? "Pause background video" : "Play background video"
          }
        >
          {playing ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
}
