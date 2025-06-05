import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Or just <p> for bio
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SongRowItem from '@/components/SongRowItem';
import MediaGridCard from '@/components/MediaGridCard';
import PersistentPlayerBar from '@/components/PersistentPlayerBar';
import type { TrackInfo } from '@/components/PersistentPlayerBar';
import { User, Disc, Play } from 'lucide-react';


interface ArtistDetails {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  topTracks: Array<{ id: string; title: string; artist: string; album?: string; duration: string; isLiked?: boolean; }>;
  albums: Array<{ id: string; imageUrl: string; title: string; subtitle?: string; type: 'album'}>;
}

const fetchArtistDetails = async (artistId: string): Promise<ArtistDetails | null> => {
  console.log(`Fetching artist details for ID: ${artistId}`);
  // Mock fetch
  if (artistId === 'artist1' || artistId === 'artist2' || artistId === 'artist3') { // Example IDs
    return {
      id: artistId,
      name: artistId === 'artist1' ? 'DJ Groove' : (artistId === 'artist2' ? 'Melody Maker' : 'Beat Crafter'),
      bio: 'A passionate musician exploring various genres and sounds. Known for electrifying performances and unique compositions that captivate audiences worldwide. This artist has released several critically acclaimed albums and continues to push musical boundaries.',
      imageUrl: `https://source.unsplash.com/random/400x400?person,musician&sig=${artistId}`,
      topTracks: [
        { id: 'track301', title: 'Rhythm of the Night', artist: artistId === 'artist1' ? 'DJ Groove' : (artistId === 'artist2' ? 'Melody Maker' : 'Beat Crafter'), album: 'Nightscapes', duration: '3:55' },
        { id: 'track302', title: 'Morning Dew', artist: artistId === 'artist1' ? 'DJ Groove' : (artistId === 'artist2' ? 'Melody Maker' : 'Beat Crafter'), album: 'Daybreak', duration: '4:20' },
        { id: 'track303', title: 'Synthony', artist: artistId === 'artist1' ? 'DJ Groove' : (artistId === 'artist2' ? 'Melody Maker' : 'Beat Crafter'), album: 'Nightscapes', duration: '3:10', isLiked: true },
      ],
      albums: [
        { id: 'album10', imageUrl: `https://source.unsplash.com/random/400x400?music,electronic&sig=${artistId}1`, title: 'Nightscapes', subtitle: 'Full Album', type: 'album' as const },
        { id: 'album11', imageUrl: `https://source.unsplash.com/random/400x400?music,acoustic&sig=${artistId}2`, title: 'Daybreak', subtitle: 'Acoustic Collection', type: 'album' as const },
      ]
    };
  }
  return null;
};


const ArtistPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<ArtistDetails | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (id) {
      fetchArtistDetails(id).then(setArtist);
    }
  }, [id]);

  console.log('ArtistPage loaded for ID:', id);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleSkipNext = () => console.log('Skip next');
  const handleSkipPrevious = () => console.log('Skip previous');
  const handleVolumeChange = (newVolume: number[]) => setVolume(newVolume[0]);
  const handleSeek = (newProgress: number[]) => setProgress(newProgress[0]);

  const handlePlayTrack = (trackId: string) => {
    const track = artist?.topTracks.find(t => t.id === trackId);
    if (track && artist) {
      setCurrentTrack({
        id: track.id,
        title: track.title,
        artist: artist.name,
        albumArtUrl: artist.imageUrl, // Or specific track/album art if available
        duration: 200 // Placeholder
      });
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleViewAlbum = (albumId: string | number, type: 'album' | 'playlist' | 'artist') => {
    navigate(`/collection/${type}/${albumId}`);
  };
  
  const playTopTracks = () => {
     if(artist && artist.topTracks.length > 0) {
        handlePlayTrack(artist.topTracks[0].id);
    }
  }


  if (!artist) {
    return <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">Loading artist details...</div>;
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
          <section className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <Avatar className="h-48 w-48 md:h-64 md:w-64 shadow-xl border-4 border-neutral-700">
              <AvatarImage src={artist.imageUrl} alt={artist.name} />
              <AvatarFallback className="text-6xl bg-neutral-700">{artist.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <p className="text-sm uppercase text-neutral-400 mb-1 flex items-center justify-center md:justify-start"><User className="h-4 w-4 mr-1"/> Artist</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-3">{artist.name}</h2>
              {/* Using p for bio instead of Textarea for display */}
              <p className="text-neutral-300 text-sm max-w-xl leading-relaxed">{artist.bio}</p>
              <Button size="lg" className="mt-6 bg-green-500 hover:bg-green-600 text-black font-semibold" onClick={playTopTracks}>
                <Play className="mr-2 h-5 w-5 fill-black" /> Play Top Tracks
              </Button>
            </div>
          </section>

          <Tabs defaultValue="top-tracks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-neutral-800 max-w-md mx-auto">
              <TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
            </TabsList>
            <TabsContent value="top-tracks">
              <div className="space-y-1 max-w-3xl mx-auto">
                {artist.topTracks.map((track, index) => (
                  <SongRowItem
                    key={track.id}
                    trackNumber={index + 1}
                    songTitle={track.title}
                    artistName={artist.name}
                    albumName={track.album}
                    duration={track.duration}
                    isLiked={track.isLiked}
                    onPlayClick={() => handlePlayTrack(track.id)}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={currentTrack?.id === track.id && isPlaying}
                    onLikeClick={() => console.log('Like:', track.title)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="albums">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {artist.albums.map(album => (
                  <MediaGridCard 
                    key={album.id} 
                    {...album} 
                    onViewClick={handleViewAlbum} 
                    onPlayClick={() => navigate(`/collection/album/${album.id}`)} // Or direct play album
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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

export default ArtistPage;