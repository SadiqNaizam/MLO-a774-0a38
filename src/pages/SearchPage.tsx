import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongRowItem from '@/components/SongRowItem';
import MediaGridCard from '@/components/MediaGridCard';
import PersistentPlayerBar from '@/components/PersistentPlayerBar';
import type { TrackInfo } from '@/components/PersistentPlayerBar';
import { Search as SearchIcon } from 'lucide-react';


const placeholderSongs = [
  { id: 'song1', title: 'Echoes in Time', artist: 'The Timeless', album: 'Chronicles', duration: '3:45', isLiked: false },
  { id: 'song2', title: 'Neon Dreams', artist: 'Synthwave Rider', album: 'Night Drive', duration: '4:12', isLiked: true },
  { id: 'song3', title: 'Lost in the Woods', artist: 'Forest Spirit', album: 'Nature\'s Call', duration: '2:58', isLiked: false },
];

const placeholderAlbums = [
  { id: 'album3', imageUrl: 'https://source.unsplash.com/random/400x400?music,abstract&sig=6', title: 'Abstract Grooves', subtitle: 'Experimental Beats', type: 'album' as const },
  { id: 'album4', imageUrl: 'https://source.unsplash.com/random/400x400?music,urban&sig=7', title: 'City Lights', subtitle: 'Urban Anthems', type: 'album' as const },
];

const placeholderArtists = [
 { id: 'artist2', imageUrl: 'https://source.unsplash.com/random/400x400?person,musician&sig=8', title: 'Melody Maker', subtitle: 'Pop Sensation', type: 'artist' as const },
];

const placeholderPlaylists = [
 { id: 'playlist3', imageUrl: 'https://source.unsplash.com/random/400x400?music,mood&sig=9', title: 'Chill Vibes', subtitle: 'Relax and Unwind', type: 'playlist' as const },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    if (query) {
      setSearchTerm(query);
      // Here you would typically fetch search results based on the query
      console.log(`Searching for: ${query}`);
    }
  }, [location.search]);

  console.log('SearchPage loaded');

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipNext = () => console.log('Skip next');
  const handleSkipPrevious = () => console.log('Skip previous');
  const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);
  const handleSeek = (newProgress: number[]) => setProgress(newProgress[0]);

  const handlePlaySong = (songId: string) => {
    const song = placeholderSongs.find(s => s.id === songId);
    if (song) {
      setCurrentTrack({
        id: song.id,
        title: song.title,
        artist: song.artist,
        albumArtUrl: `https://source.unsplash.com/random/100x100?music,song&sig=${song.id}`, // Placeholder
        duration: 200 // Placeholder
      });
      setIsPlaying(true);
      setProgress(0);
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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-[100px]"> {/* Padding bottom for player bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-8 max-w-xl mx-auto">
          <Input
            type="search"
            placeholder="Search for songs, albums, artists, playlists..."
            className="w-full pl-12 pr-4 py-3 text-lg bg-neutral-800 border-neutral-700 focus:ring-green-500 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </form>

        {searchTerm && (
          <Tabs defaultValue="songs" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-neutral-800">
              <TabsTrigger value="songs">Songs</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>
            <ScrollArea style={{ height: 'calc(100vh - 64px - 90px - 150px)'}}> {/* Adjust height dynamically */}
              <TabsContent value="songs">
                <div className="space-y-2">
                  {placeholderSongs.map((song, index) => (
                    <SongRowItem
                      key={song.id}
                      trackNumber={index + 1}
                      songTitle={song.title}
                      artistName={song.artist}
                      albumName={song.album}
                      duration={song.duration}
                      isLiked={song.isLiked}
                      onPlayClick={() => handlePlaySong(song.id)}
                      isCurrent={currentTrack?.id === song.id}
                      isPlaying={currentTrack?.id === song.id && isPlaying}
                      onLikeClick={() => console.log('Like clicked for', song.title)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="albums">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {placeholderAlbums.map(album => (
                    <MediaGridCard key={album.id} {...album} onViewClick={handleViewMedia} onPlayClick={() => console.log("Play album", album.id)} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="artists">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {placeholderArtists.map(artist => (
                    <MediaGridCard key={artist.id} {...artist} onViewClick={handleViewMedia} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="playlists">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {placeholderPlaylists.map(playlist => (
                    <MediaGridCard key={playlist.id} {...playlist} onViewClick={handleViewMedia} onPlayClick={() => console.log("Play playlist", playlist.id)} />
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
        {!searchTerm && <p className="text-center text-neutral-400">Enter a search term to find music.</p>}
      </main>

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

export default SearchPage;