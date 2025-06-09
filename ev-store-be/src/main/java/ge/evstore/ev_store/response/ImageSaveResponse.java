package ge.evstore.ev_store.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImageSaveResponse {
    private long imageId;
    private long imageSize;
    private String imageName;
}
