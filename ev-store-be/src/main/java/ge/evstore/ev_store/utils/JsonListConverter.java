package ge.evstore.ev_store.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Converter
public class JsonListConverter implements AttributeConverter<List<Long>, String> {
    private final ObjectMapper mapper = new ObjectMapper();


    @Override
    public String convertToDatabaseColumn(final List<Long> attribute) {
        try {
            return attribute == null ? "[]" : mapper.writeValueAsString(attribute);
        } catch (final JsonProcessingException e) {
            throw new RuntimeException("Failed to convert list to JSON string", e);
        }
    }

    @Override
    public List<Long> convertToEntityAttribute(final String dbData) {
        try {
            if (dbData == null || dbData.isBlank()) {
                return new ArrayList<>();
            }
            return mapper.readValue(dbData, new TypeReference<>() {
            });
        } catch (final IOException e) {
            throw new RuntimeException("Failed to convert JSON string to list", e);
        }
    }
}