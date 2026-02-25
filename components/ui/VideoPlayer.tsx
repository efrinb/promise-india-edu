'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
    url: string;
    title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                preload="metadata"
            >
                Your browser does not support the video tag.
            </video>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="bg-white/90 hover:bg-white p-6 rounded-full transition-all group-hover:scale-110">
                        <Play className="h-12 w-12 text-primary ml-1" />
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-primary transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <Pause className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6" />
                            )}
                        </button>
                        <button
                            onClick={toggleMute}
                            className="text-white hover:text-primary transition-colors"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <VolumeX className="h-6 w-6" />
                            ) : (
                                <Volume2 className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-primary transition-colors"
                        aria-label="Fullscreen"
                    >
                        <Maximize className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}