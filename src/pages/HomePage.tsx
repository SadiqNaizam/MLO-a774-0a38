import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaGridCard from '@/components/MediaGridCard';
import PersistentPlayerBar from '@/components/PersistentPlayerBar';
import type { TrackInfo } from '@/components/PersistentPlayerBar'; // Assuming TrackInfo is exported or define here
import { Search } from 'lucide-react';

// Define TrackInfo if not exported from PersistentPlayerBar, or import if it is.
// For this example, let's assume TrackInfo might be part of PersistentPlayerBar's props interface but not separately exported.
// If PersistentPlayerBarProps interface is complex, it's better to have TrackInfo defined/exported where it's used.
// For simplicity, defining a local version or assuming it can be imported.
// interface TrackInfo { id: string; title: string; artist: string; albumArtUrl?: string; duration?: number; }


const placeholderMediaItems = [
  { id: 'album1', imageUrl: 'https://source.unsplash.com/random/400x400?music,album&sig=1', title: 'Sunset Vibes', subtitle: 'Chill Beats', type: 'album' as const },
  { id: 'playlist1', imageUrl: 'https://source.unsplash.com/random/400x400?music,playlist&sig=2', title: 'Workout Hits', subtitle: 'High Energy Mix', type: 'playlist' as const },
  { id: 'artist1', imageUrl: 'https://source.unsplash.com/random/400x400?music,artist&sig=3', title: 'DJ Groove', subtitle: 'Electronic Mastermind', type: 'artist' as const },
  { id: 'album2', imageUrl: 'https://source.unsplash.com/random/400x400?music,concert&sig=4', title: 'Indie Dreams', subtitle: 'Acoustic Sessions', type: 'album' as const },
  { id: 'playlist2', imageUrl: 'https://source.unsplash.com/random/400x400?music,party&sig=5', title: 'Focus Flow', subtitle: 'Instrumental Concentration', type: 'playlist' as const },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('HomePage loaded');

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipNext = () => console.log('Skip next');
  const handleSkipPrevious = () => console.log('Skip previous');
  const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);
  const handleSeek = (newProgress: number[]) => setProgress(newProgress[0]);

  const handlePlayMedia = (id: string | number) => {
    const item = placeholderMediaItems.find(m => m.id === id);
    if (item) {
      setCurrentTrack({
        id: String(id),
        title: item.title,
        artist: item.subtitle || 'Various Artists',
        albumArtUrl: item.imageUrl,
        duration: 180 // Placeholder duration
      });
      setIsPlaying(true);
      setProgress(0);
      console.log(`Playing ${item.type}: ${item.title}`);
    }
  };

  const handleViewMedia = (id: string | number, type: 'album' | 'playlist' | 'artist') => {
    console.log(`Viewing ${type} with id ${id}`);
    if (type === 'artist') {
      navigate(`/artist/${id}`);
    } else {
      navigate(`/collection/${type}/${id}`);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white">
      {/* Simplified NavigationMenu for example purposes */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-500">MusicApp</h1>
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
           <form onSubmit={handleSearch} className="relative w-full max-w-xs ml-4">
            <Input
              type="search"
              placeholder="Search songs, artists, albums..."
              className="pl-10 bg-neutral-800 border-neutral-700 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          </form>
        </div>
      </header>

      <ScrollArea className="flex-grow" style={{ height: 'calc(100vh - 64px - 90px)'}}> {/* Adjust height considering header and player */}
        <main className="container mx-auto px-4 py-8 pb-[100px]"> {/* Padding bottom for player bar */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">New Releases</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {placeholderMediaItems.filter(item => item.type === 'album').map(item => (
                <MediaGridCard
                  key={item.id}
                  {...item}
                  onPlayClick={() => handlePlayMedia(item.id)}
                  onViewClick={handleViewMedia}
                />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Featured Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {placeholderMediaItems.filter(item => item.type === 'playlist').map(item => (
                <MediaGridCard
                  key={item.id}
                  {...item}
                  onPlayClick={() => handlePlayMedia(item.id)}
                  onViewClick={handleViewMedia}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6">Popular Artists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {placeholderMediaItems.filter(item => item.type === 'artist').map(item => (
                <MediaGridCard
                  key={item.id}
                  {...item}
                  // Artists usually don't have a direct play, but navigate to their page
                  onViewClick={handleViewMedia}
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

export default HomePage;