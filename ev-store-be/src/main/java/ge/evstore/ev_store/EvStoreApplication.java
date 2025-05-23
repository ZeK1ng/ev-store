package ge.evstore.ev_store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

@SpringBootApplication
public class EvStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(EvStoreApplication.class, args);
	}

}
