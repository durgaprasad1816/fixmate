package com.fixmate.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@Slf4j
public class ConsoleSmsService implements SmsService {
    @Value("${fixmate.otp.dev-mode:true}")
    private boolean devMode;
    @Value("${fixmate.sms.provider:console}")
    private String provider;
    @Value("${fixmate.sms.twilio.account-sid:}")
    private String accountSid;
    @Value("${fixmate.sms.twilio.auth-token:}")
    private String authToken;
    @Value("${fixmate.sms.twilio.from:}")
    private String from;
    @Value("${fixmate.otp.web-origin:http://localhost:5173}")
    private String webOrigin;

    @Override
    public void sendOtp(String phone, String otp) {
        String host = webOrigin.replaceFirst("^https?://", "").split("/")[0].split(":")[0];
        String message = "<#> FixMate verification code is " + otp + "\n\n@" + host + " #" + otp;
        if ("twilio".equalsIgnoreCase(provider) && !accountSid.isBlank() && !authToken.isBlank() && !from.isBlank()) {
            try {
                String body = "To=" + URLEncoder.encode("+91" + phone, StandardCharsets.UTF_8)
                        + "&From=" + URLEncoder.encode(from, StandardCharsets.UTF_8)
                        + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);
                String auth = Base64.getEncoder().encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json"))
                        .header("Authorization", "Basic " + auth)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build();
                HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 300) throw new IllegalStateException("Twilio returned " + response.statusCode());
                return;
            } catch (Exception ex) {
                log.error("Could not send OTP through Twilio", ex);
                throw new IllegalStateException("OTP delivery failed. Please try again.");
            }
        }
        if (devMode) log.info("FixMate development OTP for {} is {}. SMS format: {}", phone, otp, message.replace("\n", " | "));
        else throw new IllegalStateException("SMS provider is not configured.");
    }
}
