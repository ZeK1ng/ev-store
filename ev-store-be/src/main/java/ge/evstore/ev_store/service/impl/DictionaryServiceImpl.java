package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Dictionary;
import ge.evstore.ev_store.repository.DictionaryRepository;
import ge.evstore.ev_store.service.interf.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class DictionaryServiceImpl implements DictionaryService {

    private final DictionaryRepository dictionaryRepository;

    @Override
    @Transactional
    public Dictionary create(final Dictionary dictionary) {
        return dictionaryRepository.save(dictionary);
    }

    @Override
    @Transactional
    public Dictionary update(final Integer id, final Dictionary dictionary) {
        final Optional<Dictionary> existingOpt = dictionaryRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return null;
        }

        final Dictionary existing = existingOpt.get();
        existing.setKey(dictionary.getKey());
        existing.setValue(dictionary.getValue());

        return dictionaryRepository.save(existing);
    }

    @Override
    public void delete(final Integer id) {
        dictionaryRepository.deleteById(id);
    }

    @Override
    public List<Dictionary> findAll() {
        return dictionaryRepository.findAll();
    }
}
