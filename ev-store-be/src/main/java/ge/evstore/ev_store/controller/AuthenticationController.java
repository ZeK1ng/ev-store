package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.*;
import ge.evstore.ev_store.response.AccessTokenResponse;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.utils.HeaderUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/auth")
@RestController
@Slf4j
public class AuthenticationController {
    private final AuthService authService;

    public AuthenticationController(final AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Login user", description = "Authenticate and log in a user with their credentials.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated the user and provided an authentication token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid login request or bad credentials.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized, invalid username or password.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping(value = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody final AuthRequest request) throws AuthenticationException {
        log.info("Login request received for {}", request.getUsername());
        final AuthResponse authResponse = authService.handleLogin(request);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Register user", description = "Register a new user account and send verification instructions.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully registered the user."),
            @ApiResponse(responseCode = "400", description = "Invalid registration data.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody final UserRegisterRequest userRegisterRequest) throws MessagingException {
        log.info("Register request for user {}", userRegisterRequest.toString());
        authService.handleRegister(userRegisterRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Verify email", description = "Verify a user using the confirmation code (OTP) sent to their email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully verified.", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Validation error in OTP or data provided.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verifyUser(@Validated @RequestBody final VerifyUserRequest verifyUserRequest) {
        log.info("Trying to verifyUserRequest:{}", verifyUserRequest);
        return ResponseEntity.ok(authService.verifyUser(verifyUserRequest));
    }

    @Operation(summary = "Resend email verification code", description = "Resend the verification code to the user's email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully resent the verification email."),
            @ApiResponse(responseCode = "400", description = "Invalid email request.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody final ResendVerificationRequest resendVerificationRequest) throws MessagingException {
        log.info("Trying to resend verification for:{}", resendVerificationRequest.getEmail());
        authService.resendVerificationCode(resendVerificationRequest.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Handle forgotten password", description = "Send a password reset code to the user's email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully sent the password reset email."),
            @ApiResponse(responseCode = "400", description = "Invalid email input.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody final ForgotPasswordRequest request) throws MessagingException {
        log.info("Sending password reset code to email:{}", request.getEmail());
        authService.sendPasswordResetCode(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reset password", description = "Reset the user's password using the provided reset code.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid input for password resetting.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody final ResetPasswordRequest request) {
        log.info("Setting new password for email:{}", request.getEmail());
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Verify OTP", description = "Verify an OTP (One-Time Password) code.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OTP verified successfully."),
            @ApiResponse(responseCode = "400", description = "Invalid or expired OTP.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody final OtpVerificationRequest otpVerificationRequest){
        return ResponseEntity.ok(authService.verifyOtp(otpVerificationRequest));
    }

    @Operation(summary = "Logout user", description = "Log out the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged out."),
            @ApiResponse(responseCode = "401", description = "Unauthorized request.")
    })
    @PostMapping("/logout")
    public ResponseEntity<?> logout(final HttpServletRequest request) {
        authService.handleLogout(HeaderUtils.extractBearer(request));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Refresh access token", description = "Renew the access token using the refresh token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Access token refreshed successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AccessTokenResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Refresh token is invalid or expired.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refreshAccessToken(final HttpServletRequest request) {
        log.info("Refreshing access token");
        final String refreshToken = HeaderUtils.extractBearer(request);
        final AccessTokenResponse accessTokenResponse = authService.rotateAccessTokenForUser(refreshToken);
        return ResponseEntity.ok(accessTokenResponse);
    }
}