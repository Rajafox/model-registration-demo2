
package com.modelregistry.config;

import com.modelregistry.entity.Model;
import com.modelregistry.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void run(String... args) throws Exception {
        if (modelRepository.count() == 0) {
            createSampleData();
        }
    }

    private void createSampleData() {
        // Sample data for testing
        Model model1 = new Model();
        model1.setModelName("Credit Scoring Model");
        model1.setModelVersion("v1.0");
        model1.setModelSponsor("John Doe");
        model1.setBusinessLine("Retail Banking");
        model1.setModelType("Credit Risk");
        model1.setRiskRating("High");
        model1.setStatus("Production");
        model1.setUpdatedBy("Admin");
        model1.setUpdatedOn(LocalDateTime.now());

        Model model2 = new Model();
        model2.setModelName("Market Risk Assessment");
        model2.setModelVersion("v2.1");
        model2.setModelSponsor("Jane Smith");
        model2.setBusinessLine("Investment Banking");
        model2.setModelType("Market Risk");
        model2.setRiskRating("Medium");
        model2.setStatus("Validated");
        model2.setUpdatedBy("Risk Manager");
        model2.setUpdatedOn(LocalDateTime.now());

        Model model3 = new Model();
        model3.setModelName("AML Detection System");
        model3.setModelVersion("v1.5");
        model3.setModelSponsor("Mike Johnson");
        model3.setBusinessLine("Risk Management");
        model3.setModelType("AML");
        model3.setRiskRating("High");
        model3.setStatus("In Development");
        model3.setUpdatedBy("Compliance Team");
        model3.setUpdatedOn(LocalDateTime.now());

        Model model4 = new Model();
        model4.setModelName("Capital Calculation Engine");
        model4.setModelVersion("v3.0");
        model4.setModelSponsor("Sarah Wilson");
        model4.setBusinessLine("Wholesale Lending");
        model4.setModelType("Capital Calculation");
        model4.setRiskRating("Low");
        model4.setStatus("Draft");
        model4.setUpdatedBy("Finance Team");
        model4.setUpdatedOn(LocalDateTime.now());

        Model model5 = new Model();
        model5.setModelName("Operational Risk Model");
        model5.setModelVersion("v1.2");
        model5.setModelSponsor("David Brown");
        model5.setBusinessLine("Risk Management");
        model5.setModelType("Operational Risk");
        model5.setRiskRating("Medium");
        model5.setStatus("Retired");
        model5.setUpdatedBy("Operations");
        model5.setUpdatedOn(LocalDateTime.now());

        modelRepository.save(model1);
        modelRepository.save(model2);
        modelRepository.save(model3);
        modelRepository.save(model4);
        modelRepository.save(model5);

        System.out.println("Sample data initialized successfully!");
    }
}
