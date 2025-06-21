
package com.modelregistry.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI modelRegistryOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:5000");
        devServer.setDescription("Server URL in Development environment");

        Contact contact = new Contact();
        contact.setEmail("admin@modelregistry.com");
        contact.setName("Model Registry Team");

        Info info = new Info()
                .title("Model Registry API")
                .version("1.0")
                .contact(contact)
                .description("This API exposes endpoints to manage model registry operations including creating, updating, retrieving, and filtering models.");

        return new OpenAPI().info(info).servers(List.of(devServer));
    }
}
