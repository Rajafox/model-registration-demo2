
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
        Model[] sampleModels = {
            new Model("Credit Scoring Model", "v1.0", "John Smith", 
                     "Retail Banking", "Credit Risk", "High", "Production", "Admin"),
            new Model("Market Risk Calculator", "v2.1", "Jane Doe", 
                     "Investment Banking", "Market Risk", "Medium", "Validated", "Admin"),
            new Model("AML Detection System", "v1.5", "Mike Johnson", 
                     "Risk Management", "AML", "High", "Production", "Admin"),
            new Model("Capital Adequacy Model", "v3.0", "Sarah Wilson", 
                     "Wholesale Lending", "Capital Calculation", "Low", "In Development", "Admin"),
            new Model("Operational Risk Framework", "v1.2", "David Brown", 
                     "Risk Management", "Operational Risk", "Medium", "Draft", "Admin"),
            new Model("Valuation Model", "v2.0", "Lisa Davis", 
                     "Investment Banking", "Valuation", "High", "Validated", "Admin"),
            new Model("Retail Credit Model", "v1.8", "Tom Anderson", 
                     "Retail Banking", "Credit Risk", "Medium", "Production", "Admin"),
            new Model("Liquidity Risk Model", "v1.0", "Emma Thompson", 
                     "Wholesale Lending", "Market Risk", "Low", "Draft", "Admin"),
            new Model("Fraud Detection Model", "v2.5", "Chris Martinez", 
                     "Retail Banking", "AML", "High", "Production", "Admin"),
            new Model("Portfolio Valuation", "v1.3", "Alex Garcia", 
                     "Investment Banking", "Valuation", "Medium", "Retired", "Admin")
        };

        for (Model model : sampleModels) {
            model.setUpdatedOn(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
            modelRepository.save(model);
        }
    }
}
