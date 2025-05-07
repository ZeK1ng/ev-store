package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.service.interf.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${verification.code.expiration.duration.minutes}")
    private int verifyCodeExpirationDuration;

    public UserServiceImpl(final UserRepository userRepository, final PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findUser(final String username) {
        return userRepository.findByEmail(username.toLowerCase());
    }

    @Transactional
    public User registerUserWithoutVerification(final UserRegisterRequest request, final String verificationCode) throws UserAlreadyRegisteredException {
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
    public User verifyUser(final User userFound) {
        userFound.setVerified(true);
        userFound.setVerificationCode(null);
        userFound.setOtpVerificationExpiration(null);
        return userRepository.save(userFound);
    }

    @Transactional
    public void updateVerificationCodeFor(final User user, final String verificationCode) {
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(final User user, final String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setOtpVerificationExpiration(null);
        userRepository.save(user);
    }

}

