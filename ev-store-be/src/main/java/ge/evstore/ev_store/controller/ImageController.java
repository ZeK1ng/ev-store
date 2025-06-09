package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.service.interf.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @GetMapping
    public ResponseEntity<?> getImage(@RequestParam final Long imageId) {
        final byte[] imageData = imageService.getImageById(imageId);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);
    }

    @GetMapping("/bulk")
    public ResponseEntity<?> getImages(@RequestParam final List<Long> imageIds) {
        final List<byte[]> imageData = imageService.getImagesBulk(imageIds);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(imageData);
    }
}
