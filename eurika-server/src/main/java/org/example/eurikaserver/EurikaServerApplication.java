package org.example.eurikaserver;

import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEurekaServer
public class EurikaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurikaServerApplication.class, args);
    }

}
