package demo.msa.config;

import demo.msa.framework.registry.ServiceRegistry;
import demo.msa.framework.registry.ServiceRegistryImpl;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by wxh on 2017/3/26.
 */
@Configuration
@ConfigurationProperties(prefix = "registry")
public class RegistryConfig {
    private String servers;

    @Bean
    public ServiceRegistry serviceRegistry () {
        return new ServiceRegistryImpl(servers);
    }

    public void setServers(String servers) {
        this.servers = servers;
    }


}
