import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';

interface MediaGridCardProps {
  id: string | number;
  imageUrl: string;
  title: string;
  subtitle?: string;
  type: 'album' | 'playlist' | 'artist'; // To differentiate styling or action
  onPlayClick?: (id: string | number) => void;
  onViewClick: (id: string | number, type: MediaGridCardProps['type']) => void;
}

const MediaGridCard: React.FC<MediaGridCardProps> = ({
  id,
  imageUrl,
  title,
  subtitle,
  type,
  onPlayClick,
  onViewClick,
}) => {
  console.log(`Rendering MediaGridCard: ${title} (Type: ${type})`);

  const handleView = () => {
    console.log(`View clicked for ${type} ID: ${id}`);
    onViewClick(id, type);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if play button is clicked
    if (onPlayClick) {
      console.log(`Play clicked for ${type} ID: ${id}`);
      onPlayClick(id);
    }
  };

  return (
    <Card
      className="w-full overflow-hidden transition-all hover:shadow-lg cursor-pointer group"
      onClick={handleView}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={1 / 1} className="bg-muted">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {onPlayClick && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10"
            onClick={handlePlay}
            aria-label={`Play ${title}`}
          >
            <PlayCircle className="h-6 w-6" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-3">
        <CardTitle className="text-base font-semibold line-clamp-1">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {subtitle}
          </CardDescription>
        )}
      </CardContent>
      {/* CardFooter can be used for additional actions if needed */}
    </Card>
  );
};

export default MediaGridCard;