import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Ellipsis, Heart, Check } from 'lucide-react'; // Added Heart and Check

interface SongRowItemProps {
  trackNumber?: number;
  songTitle: string;
  artistName: string;
  albumName?: string;
  duration: string; // e.g., "3:45"
  isPlaying?: boolean;
  isCurrent?: boolean; // If this is the currently loaded/playing track
  isLiked?: boolean;
  onPlayClick: () => void;
  onLikeClick?: () => void;
  onOptionsClick?: () => void; // For a context menu or more actions
}

const SongRowItem: React.FC<SongRowItemProps> = ({
  trackNumber,
  songTitle,
  artistName,
  albumName,
  duration,
  isPlaying = false,
  isCurrent = false,
  isLiked = false,
  onPlayClick,
  onLikeClick,
  onOptionsClick,
}) => {
  console.log(`Rendering SongRowItem: ${songTitle}, isPlaying: ${isPlaying}, isCurrent: ${isCurrent}`);

  const textColor = isCurrent ? 'text-green-400' : 'text-white';
  const hoverTextColor = isCurrent ? 'hover:text-green-300' : 'hover:text-neutral-300';

  return (
    <div
      className={`group grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_4fr_2fr_1fr_auto_auto] items-center gap-x-4 p-2 rounded-md hover:bg-neutral-700/50 transition-colors ${isCurrent ? 'bg-neutral-700/70' : ''}`}
    >
      {/* Track Number / Play Button */}
      <div className="flex items-center justify-center w-8 text-neutral-400 group-hover:text-white">
        <Button
            variant="ghost"
            size="icon"
            onClick={onPlayClick}
            className={`h-8 w-8 ${textColor} ${hoverTextColor}`}
            aria-label={isPlaying && isCurrent ? `Pause ${songTitle}` : `Play ${songTitle}`}
        >
            {isCurrent && isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
            ) : isCurrent && !isPlaying ? (
                 <Play className="h-5 w-5 fill-current" />
            ) : (
                <>
                    <span className="group-hover:hidden">{trackNumber}</span>
                    <Play className="h-5 w-5 fill-current hidden group-hover:block" />
                </>
            )}
        </Button>
      </div>

      {/* Title and Artist */}
      <div className="truncate">
        <p className={`text-sm font-medium truncate ${textColor}`}>{songTitle}</p>
        <p className={`text-xs text-neutral-400 truncate group-hover:${hoverTextColor}`}>{artistName}</p>
      </div>

      {/* Album (visible on md+ screens) */}
      <div className="hidden md:block truncate">
        {albumName && <p className={`text-sm text-neutral-400 truncate group-hover:${hoverTextColor}`}>{albumName}</p>}
      </div>

      {/* Like Button */}
      {onLikeClick && (
        <div className="hidden md:flex justify-center">
          <Button variant="ghost" size="icon" onClick={onLikeClick} className="h-8 w-8 text-neutral-400 hover:text-white" aria-label={isLiked ? "Unlike song" : "Like song"}>
            {isLiked ? <Heart className="h-4 w-4 fill-green-500 text-green-500" /> : <Heart className="h-4 w-4" />}
          </Button>
        </div>
      )}


      {/* Duration */}
      <div className="text-sm text-neutral-400 text-right tabular-nums w-12">
        {duration}
      </div>

      {/* Options Button */}
      {onOptionsClick && (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onOptionsClick} className="h-8 w-8 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100" aria-label="More options">
            <Ellipsis className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SongRowItem;