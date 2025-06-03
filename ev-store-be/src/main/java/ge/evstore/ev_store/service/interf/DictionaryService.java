package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Dictionary;

import java.util.List;

public interface DictionaryService {
    Dictionary create(Dictionary dictionary);
    Dictionary update(Long id, Dictionary dictionary);
    void delete(Long id);
    List<Dictionary> findAll();
}
