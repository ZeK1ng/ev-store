package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.ImageEntity;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.repository.ImageRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.service.interf.ImageService;
import ge.evstore.ev_store.utils.CompressionUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;

    @Override
    public ImageSaveResponse saveImage(final MultipartFile image) throws IOException {
        try (final InputStream inputStream = image.getInputStream()) {
            final String originalFilename = image.getOriginalFilename();
            final byte[] compress = CompressionUtils.compress(inputStream);
            final ImageEntity save = imageRepository.save(ImageEntity.builder().name(originalFilename)
                    .type(image.getContentType())
                    .image(compress).build());
            return ImageSaveResponse.builder().imageId(save.getId()).imageSize(compress.length).imageName(originalFilename).build();
        }
    }

    @Override
    public byte[] getImageById(final Long imageId) {
        if (imageId < 0) return null;
        final Optional<ImageEntity> byId = imageRepository.findById(imageId);
        return byId.map(imageEntity -> CompressionUtils.decompressImage(imageEntity.getImage())).orElse(null);
    }

    @Override
    public int deleteOrphanImages() {
        int result = 0;
        for (final ImageEntity imageEntity : imageRepository.findAll()) {
            final List<Product> byImageId = productRepository.findByImageId(imageEntity.getId());
            if (byImageId.isEmpty()) {
                result++;
                imageRepository.delete(imageEntity);
            }
        }
        return result;
    }
}
