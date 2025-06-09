package ge.evstore.ev_store.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;

@Converter
public class JsonListConverter implements AttributeConverter<List<Long>, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final List<Long> list) {
        try {
            return mapper.writeValueAsString(list);
        } catch (final JsonProcessingException e) {
            throw new RuntimeException("Error converting list to JSON", e);
        }
    }

    @Override
    public List<Long> convertToEntityAttribute(final String json) {
        try {
            return mapper.readValue(json, new TypeReference<List<Long>>() {
            });
        } catch (final IOException e) {
            throw new RuntimeException("Error converting JSON to list", e);
        }
    }
}