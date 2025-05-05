package ge.evstore.ev_store.service;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.UserRegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findUser(String username) {
        return userRepository.findByEmail(username);
    }

    @Transactional
    public User registerUser(UserRegisterRequest request) throws UserAlreadyRegisteredException {
        if (findUser(request.getEmail()).isPresent()) {
            throw new UserAlreadyRegisteredException(request);
        }
        final User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPersonalIdCode(request.getPersonalIdCode());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        return user;
    }
}
