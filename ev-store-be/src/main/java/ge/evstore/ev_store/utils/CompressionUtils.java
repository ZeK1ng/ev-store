package ge.evstore.ev_store.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;


//Took this class from https://github.com/Java-Techie-jt/file-storage-service/blob/main/src/main/java/com/javatechie/util/ImageUtils.java
public class CompressionUtils {

    public static byte[] compress(final byte[] input) {
        final Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(input);
        deflater.finish();

        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        final byte[] buffer = new byte[4 * 1024];

        while (!deflater.finished()) {
            final int compressedSize = deflater.deflate(buffer);
            outputStream.write(buffer, 0, compressedSize);
        }
        try {
            outputStream.close();
        } catch (final IOException ignored) {
        }

        return outputStream.toByteArray();
    }

    public static byte[] decompressImage(final byte[] data) {
        final Inflater inflater = new Inflater();
        inflater.setInput(data);
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        final byte[] tmp = new byte[4 * 1024];
        try {
            while (!inflater.finished()) {
                final int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
        } catch (final Exception ignored) {
        }
        return outputStream.toByteArray();
    }
}
