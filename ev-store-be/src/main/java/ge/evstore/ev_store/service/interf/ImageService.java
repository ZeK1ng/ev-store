package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.response.ImageSaveResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {
    ImageSaveResponse saveImage(MultipartFile image) throws IOException;

    byte[] getImageById(Long imageId);

    List<byte[]> getImagesBulk(List<Long> imageIds);
}
