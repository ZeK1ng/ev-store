package ge.evstore.ev_store.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EMailConfig {

    @Value("${email.sender.username}")
    private String username;

    @Value("${email.sender.password}")
    private String password;

    @Value("${email.gmail.host}")
    private String host;
    @Value("${email.gmail.port}")
    private Integer port;

    @Bean
    public JavaMailSender getMailSender() {
        final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        setupProperties(mailSender);
        return mailSender;
    }

    private void setupProperties(final JavaMailSenderImpl mailSender) {
        final Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true"); // optional: for logging
    }
}
