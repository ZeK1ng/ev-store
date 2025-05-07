package ge.evstore.ev_store.service;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.UserRegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${verification.code.expiration.duration.minutes}")
    private int verifyCodeExpirationDuration;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findUser(String username) {
        return userRepository.findByEmail(username.toLowerCase());
    }

    @Transactional
    public User registerUserWithoutVerification(UserRegisterRequest request, String verificationCode) throws UserAlreadyRegisteredException {
        if (findUser(request.getEmail()).isPresent()) {
            throw new UserAlreadyRegisteredException(request);
        }
        final User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setMobile(request.getMobile());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPersonalIdCode(request.getPersonalIdCode());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        user.setVerified(false);
        return userRepository.save(user);
    }

    @Transactional
    public User verifyUser(User userFound) {
        userFound.setVerified(true);
        userFound.setVerificationCode(null);
        userFound.setOtpVerificationExpiration(null);
        return userRepository.save(userFound);
    }

    @Transactional
    public void updateVerificationCodeFor(User user, String verificationCode) {
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setOtpVerificationExpiration(null);
        userRepository.save(user);
    }

}

