package ge.evstore.ev_store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EvStoreApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EvStoreApplication.class, args);
    }

}
