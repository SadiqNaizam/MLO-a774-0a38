import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaGridCard from '@/components/MediaGridCard';
import SongRowItem from '@/components/SongRowItem';
import PersistentPlayerBar from '@/components/PersistentPlayerBar';
import type { TrackInfo } from '@/components/PersistentPlayerBar';
import { PlusCircle } from 'lucide-react';

const userPlaylists = [
  { id: 'pl1', imageUrl: 'https://source.unsplash.com/random/400x400?music,sad&sig=10', title: 'Late Night Coding', subtitle: 'Focus Beats', type: 'playlist' as const },
  { id: 'pl2', imageUrl: 'https://source.unsplash.com/random/400x400?music,roadtrip&sig=11', title: 'Road Trip Anthems', subtitle: 'Singalongs', type: 'playlist' as const },
];

const likedSongs = [
  { id: 'song4', title: 'Starlight Serenade', artist: 'Cosmic Voyager', album: 'Galaxies', duration: '5:02', isLiked: true },
  { id: 'song5', title: 'Ocean Depths', artist: 'Aqua Marine', album: 'Blue World', duration: '3:30', isLiked: true },
];

const followedArtists = [
  { id: 'artist3', imageUrl: 'https://source.unsplash.com/random/400x400?person,dj&sig=12', title: 'Beat Crafter', subtitle: 'Lo-fi Producer', type: 'artist' as const },
];
const followedAlbums = [
 { id: 'album5', imageUrl: 'https://source.unsplash.com/random/400x400?music,classical&sig=13', title: 'Classical Moods', subtitle: 'Piano Sonatas', type: 'album' as const },
];


const LibraryPage = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  console.log('LibraryPage loaded');

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipNext = () => console.log('Skip next');
  const handleSkipPrevious = () => console.log('Skip previous');
  const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);
  const handleSeek = (newProgress: number[]) => setProgress(newProgress[0]);

  const handlePlaySong = (songId: string) => {
    const song = likedSongs.find(s => s.id === songId); // Assuming playing from liked songs
    if (song) {
      setCurrentTrack({
        id: song.id,
        title: song.title,
        artist: song.artist,
        albumArtUrl: `https://source.unsplash.com/random/100x100?music&sig=${song.id}`,
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
      // For playlists and albums from library
      navigate(`/collection/${type}/${id}`);
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
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-[100px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Your Library</h2>
          <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-neutral-900">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Playlist
          </Button>
        </div>

        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-neutral-800">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="songs">Liked Songs</TabsTrigger>
            <TabsTrigger value="followed">Followed</TabsTrigger>
          </TabsList>
          <ScrollArea style={{ height: 'calc(100vh - 64px - 90px - 150px)'}}>
            <TabsContent value="playlists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {userPlaylists.map(playlist => (
                  <MediaGridCard key={playlist.id} {...playlist} onViewClick={handleViewMedia} onPlayClick={() => console.log("Play playlist", playlist.id)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="songs">
              <div className="space-y-2">
                {likedSongs.map((song, index) => (
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
                    onLikeClick={() => console.log('Unlike song:', song.title)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="followed">
              <h3 className="text-xl font-semibold mt-4 mb-3">Followed Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                {followedArtists.map(artist => (
                  <MediaGridCard key={artist.id} {...artist} onViewClick={handleViewMedia} />
                ))}
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-3">Followed Albums</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {followedAlbums.map(album => (
                  <MediaGridCard key={album.id} {...album} onViewClick={handleViewMedia} onPlayClick={() => console.log("Play album", album.id)} />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
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

export default LibraryPage;