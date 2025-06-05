import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongRowItem from '@/components/SongRowItem';
import PersistentPlayerBar from '@/components/PersistentPlayerBar';
import type { TrackInfo } from '@/components/PersistentPlayerBar';
import { Play, Shuffle, ListMusic } from 'lucide-react';

// Mock data structure for a playlist or album
interface ContentDetails {
  id: string;
  type: 'playlist' | 'album';
  title: string;
  creator?: string; // For playlists
  artist?: string; // For albums
  description?: string;
  coverArtUrl: string;
  tracks: Array<{ id: string; title: string; artist: string; album?: string; duration: string; isLiked?: boolean; }>;
}

const fetchContentDetails = async (type: string, id: string): Promise<ContentDetails | null> => {
  console.log(`Fetching ${type} with id ${id}`);
  // Mock fetch
  if (type === 'playlist' && id === 'pl1') {
    return {
      id: 'pl1', type: 'playlist', title: 'Late Night Coding', creator: 'You',
      description: 'Deep focus electronic and lo-fi music for late night coding sessions. Updated weekly.',
      coverArtUrl: 'https://source.unsplash.com/random/400x400?music,coding&sig=20',
      tracks: [
        { id: 'track101', title: 'Binary Sunset', artist: 'Code Weaver', duration: '4:15' },
        { id: 'track102', title: 'Algorithm Blues', artist: 'Syntax Sisters', duration: '3:30' },
        { id: 'track103', title: 'Kernel Panic Dreams', artist: 'Debug Entity', duration: '5:01' },
      ]
    };
  }
  if (type === 'album' && id === 'album1') {
    return {
      id: 'album1', type: 'album', title: 'Sunset Vibes', artist: 'Chill Beats',
      description: 'An album full of relaxing beats to unwind to.',
      coverArtUrl: 'https://source.unsplash.com/random/400x400?music,sunset&sig=21',
      tracks: [
        { id: 'track201', title: 'Golden Hour', artist: 'Chill Beats', album: 'Sunset Vibes', duration: '3:50' },
        { id: 'track202', title: 'Crimson Sky', artist: 'Chill Beats', album: 'Sunset Vibes', duration: '4:20' },
        { id: 'track203', title: 'Twilight Haze', artist: 'Chill Beats', album: 'Sunset Vibes', duration: '3:10' },
      ]
    };
  }
  return null;
};


const PlaylistAlbumPage = () => {
  const { type, id } = useParams<{ type: 'playlist' | 'album', id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentDetails | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (type && id) {
      fetchContentDetails(type, id).then(setContent);
    }
  }, [type, id]);

  console.log('PlaylistAlbumPage loaded for:', type, id);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipNext = () => console.log('Skip next');
  const handleSkipPrevious = () => console.log('Skip previous');
  const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);
  const handleSeek = (newProgress: number[]) => setProgress(newProgress[0]);

  const handlePlayTrack = (trackId: string) => {
    const track = content?.tracks.find(t => t.id === trackId);
    if (track && content) {
      setCurrentTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        albumArtUrl: content.coverArtUrl, // Use main content cover art for simplicity
        duration: 200 // Placeholder
      });
      setIsPlaying(true);
      setProgress(0);
    }
  };
  
  const playAll = () => {
    if(content && content.tracks.length > 0) {
        handlePlayTrack(content.tracks[0].id);
    }
  }

  if (!content) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">Loading content...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-700">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500 cursor-pointer" onClick={() => navigate('/')}>MusicApp</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/search" className={navigationMenuTriggerStyle()}>Search</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/library" className={navigationMenuTriggerStyle()}>Library</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      
      <ScrollArea className="flex-grow" style={{ height: 'calc(100vh - 64px - 90px)'}}>
        <main className="container mx-auto px-4 py-8 pb-[100px]">
          <section className="flex flex-col md:flex-row gap-8 mb-8">
            <img 
              src={content.coverArtUrl} 
              alt={content.title} 
              className="w-full md:w-64 h-64 md:h-64 object-cover rounded-lg shadow-xl" 
            />
            <div className="flex flex-col justify-end">
              <p className="text-sm uppercase text-neutral-400 mb-1">{content.type}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">{content.title}</h2>
              {content.creator && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://source.unsplash.com/random/50x50?person&sig=${content.creator}`} alt={content.creator} />
                    <AvatarFallback>{content.creator.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-neutral-300">{content.creator}</p>
                </div>
              )}
              {content.artist && <p className="text-lg text-neutral-300 mb-1">By {content.artist}</p>}
              {content.description && (
                <Textarea
                  readOnly
                  value={content.description}
                  className="bg-transparent border-neutral-700 text-neutral-400 text-sm mt-2 h-20 resize-none"
                  placeholder="No description available."
                />
              )}
              <p className="text-sm text-neutral-400 mt-2">{content.tracks.length} songs</p>
              <div className="mt-4 flex gap-3">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold" onClick={playAll}>
                  <Play className="mr-2 h-5 w-5 fill-black" /> Play All
                </Button>
                <Button variant="outline" size="lg" className="border-neutral-500 text-neutral-300 hover:bg-neutral-700">
                  <Shuffle className="mr-2 h-5 w-5" /> Shuffle
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center"><ListMusic className="mr-2 h-5 w-5" /> Tracks</h3>
            <div className="space-y-1">
              {content.tracks.map((track, index) => (
                <SongRowItem
                  key={track.id}
                  trackNumber={index + 1}
                  songTitle={track.title}
                  artistName={track.artist}
                  albumName={content.type === 'album' ? content.title : track.album}
                  duration={track.duration}
                  isLiked={track.isLiked}
                  onPlayClick={() => handlePlayTrack(track.id)}
                  isCurrent={currentTrack?.id === track.id}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onLikeClick={() => console.log('Like:', track.title)}
                />
              ))}
            </div>
          </section>
        </main>
      </ScrollArea>

      <PersistentPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
      />
    </div>
  );
};

export default PlaylistAlbumPage;