package demo.msa.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Created by wxh on 2017/3/26.
 */

@SpringBootApplication(scanBasePackages = "demo.msa")
public class SampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }
}
