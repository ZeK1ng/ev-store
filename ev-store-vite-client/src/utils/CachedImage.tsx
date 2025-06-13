import { useState, useEffect } from 'react';
import { Image, ImageProps, Skeleton } from '@chakra-ui/react';
import { getImageUrl } from '@/utils/helpers';

interface CachedImageProps extends Omit<ImageProps, 'src'> {
  imageId: number;
  fallbackSrc?: string;
}

const CachedImage = ({ imageId, fallbackSrc, ...props }: CachedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = getImageUrl(imageId);
    setImageUrl(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [imageId]);
  if (isLoading) {
    return <Skeleton height={props.height || '200px'} width={props.width || '100%'} />;
  }

  if (error && fallbackSrc) {
    return <Image src={fallbackSrc} {...props} />;
  }

  return (
    <Image
      src={imageUrl}
      {...props}
      htmlWidth={props.htmlWidth || '100%'}
      htmlHeight={props.htmlHeight || 'auto'}
    />
  );
};

export default CachedImage; 