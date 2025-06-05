import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume1, Volume2, VolumeX } from 'lucide-react';

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl?: string;
  duration?: number; // in seconds
}

interface PersistentPlayerBarProps {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  progress: number; // 0 to 100
  volume: number; // 0 to 100
  onPlayPause: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onVolumeChange: (volume: number[]) => void;
  onSeek: (progress: number[]) => void;
}

const PersistentPlayerBar: React.FC<PersistentPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  onVolumeChange,
  onSeek,
}) => {
  console.log("Rendering PersistentPlayerBar. Current track:", currentTrack?.title, "Is playing:", isPlaying);

  if (!currentTrack) {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center px-4 z-50">
            <p className="text-neutral-400 text-sm">No track selected.</p>
        </div>
    );
  }

  const formatTime = (seconds: number = 0) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-neutral-900 text-white border-t border-neutral-700 flex items-center justify-between px-4 z-50">
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
        <Avatar className="h-12 w-12 rounded-sm">
          <AvatarImage src={currentTrack.albumArtUrl || '/placeholder.svg'} alt={currentTrack.title} />
          <AvatarFallback className="bg-neutral-700 rounded-sm text-xs">
            {currentTrack.title.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium line-clamp-1">{currentTrack.title}</p>
          <p className="text-xs text-neutral-400 line-clamp-1">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center: Playback Controls & Progress */}
      <div className="flex flex-col items-center justify-center flex-grow max-w-2xl">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onSkipPrevious} aria-label="Previous track">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="bg-white text-black hover:bg-neutral-200 rounded-full h-10 w-10"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-black" /> : <Play className="h-6 w-6 fill-black" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onSkipNext} aria-label="Next track">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full mt-1">
          <span className="text-xs text-neutral-400 w-8 text-right">
            {formatTime(currentTrack.duration ? (progress / 100) * currentTrack.duration : 0)}
          </span>
          <Slider
            defaultValue={[0]}
            value={[progress]}
            max={100}
            step={1}
            className="flex-grow h-1 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-white"
            onValueChange={onSeek}
            aria-label="Track progress"
          />
          <span className="text-xs text-neutral-400 w-8 text-left">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Right: Volume Control */}
      <div className="flex items-center gap-2 w-1/4 min-w-[120px] justify-end">
        <VolumeIcon className="h-5 w-5 text-neutral-400 hover:text-white cursor-pointer" />
        <Slider
          defaultValue={[50]}
          value={[volume]}
          max={100}
          step={1}
          className="w-24 h-1 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-white"
          onValueChange={onVolumeChange}
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default PersistentPlayerBar;