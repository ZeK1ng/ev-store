import { useState, useEffect } from 'react';
import { Image, ImageProps, Skeleton, Box, Text, Center } from '@chakra-ui/react';
import { getImageUrl } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

interface CachedImageProps extends Omit<ImageProps, 'src'> {
  imageId: number;
  fallbackSrc?: string;
  comingSoon?: boolean;
}

const CachedImage = ({ imageId, fallbackSrc, comingSoon, ...props }: CachedImageProps) => {
  const { t } = useTranslation('common');
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
    <Box position="relative" width={props.width} height={props.height}>
      <Image
        src={imageUrl}
        {...props}
        htmlWidth={props.htmlWidth || '100%'}
        htmlHeight={props.htmlHeight || 'auto'}
        filter={comingSoon ? 'blur(1px)' : 'none'}
        transition="filter 0.3s ease-in-out"
      />
      {comingSoon && (
        <Center
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          backdropFilter="blur(1px)"
          color="white"
          fontWeight="bold"
          fontSize="xl"
          textTransform="uppercase"
          letterSpacing="wider"
          textAlign="center"
          p={4}
        >
          <Text
            bg="blackAlpha.600"
            px={4}
            py={2}
            borderRadius="md"
            border="2px solid"
            borderColor="whiteAlpha.500"
          >
            {t('comingSoon')}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default CachedImage; 