package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.ImageEntity;
import ge.evstore.ev_store.repository.ImageRepository;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.service.interf.ImageService;
import ge.evstore.ev_store.utils.CompressionUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;

    @Override
    public ImageSaveResponse saveImage(final MultipartFile image) throws IOException {
        final String originalFilename = image.getOriginalFilename();
        final byte[] compress = CompressionUtils.compress(image.getBytes());

        final ImageEntity save = imageRepository.save(ImageEntity.builder().name(originalFilename)
                .type(image.getContentType())
                .image(compress).build());
        return ImageSaveResponse.builder().imageId(save.getId()).imageSize(compress.length).imageName(originalFilename).build();
    }

    @Override
    public byte[] getImageById(final Long imageId) {
        if (imageId < 0) return null;
        final Optional<ImageEntity> byId = imageRepository.findById(imageId);
        return byId.map(imageEntity -> CompressionUtils.decompressImage(imageEntity.getImage())).orElse(null);
    }

    @Override
    public List<byte[]> getImagesBulk(final List<Long> imageIds) {
        if (imageIds.isEmpty()) return null;
        final List<ImageEntity> allById = imageRepository.findAllById(imageIds);
        return allById.stream().map(imageEntity -> CompressionUtils.decompressImage(imageEntity.getImage())).collect(Collectors.toList());
    }
}
