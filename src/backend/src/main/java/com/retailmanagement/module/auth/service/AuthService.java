package com.retailmanagement.module.auth.service;

import com.retailmanagement.module.auth.dto.request.RefreshTokenRequest;
import com.retailmanagement.module.auth.dto.request.SignInRequest;
import com.retailmanagement.module.auth.dto.request.SignUpRequest;
import com.retailmanagement.module.auth.dto.response.AuthResponse;

public interface AuthService {

    /**
     * Register a new tenant with the first admin user
     */
    AuthResponse signUp(SignUpRequest request, String ipAddress);

    /**
     * Authenticate user and return tokens
     */
    AuthResponse signIn(SignInRequest request, String ipAddress);

    /**
     * Refresh access token using refresh token
     */
    AuthResponse refreshToken(RefreshTokenRequest request, String ipAddress);

    /**
     * Logout user by revoking refresh token
     */
    void logout(String refreshToken);

    /**
     * Logout user from all devices
     */
    void logoutAll();
}
