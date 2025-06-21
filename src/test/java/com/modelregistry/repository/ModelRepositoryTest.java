
package com.modelregistry.repository;

import com.modelregistry.entity.Model;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ModelRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ModelRepository modelRepository;

    private Model testModel1;
    private Model testModel2;

    @BeforeEach
    void setUp() {
        testModel1 = new Model();
        testModel1.setModelName("Credit Risk Model");
        testModel1.setModelVersion("v1.0");
        testModel1.setModelSponsor("John Smith");
        testModel1.setBusinessLine("Retail Banking");
        testModel1.setModelType("Credit Risk");
        testModel1.setRiskRating("High");
        testModel1.setStatus("Production");
        testModel1.setUpdatedBy("Admin");
        testModel1.setUpdatedOn(LocalDateTime.now());

        testModel2 = new Model();
        testModel2.setModelName("Market Risk Model");
        testModel2.setModelVersion("v2.0");
        testModel2.setModelSponsor("Jane Doe");
        testModel2.setBusinessLine("Investment Banking");
        testModel2.setModelType("Market Risk");
        testModel2.setRiskRating("Medium");
        testModel2.setStatus("Validated");
        testModel2.setUpdatedBy("User");
        testModel2.setUpdatedOn(LocalDateTime.now());

        entityManager.persistAndFlush(testModel1);
        entityManager.persistAndFlush(testModel2);
    }

    @Test
    void findByFilters_WithModelName_ShouldReturnMatchingModels() {
        // When
        List<Model> result = modelRepository.findByFilters(
                "Credit", null, null, null, null, null, null, null);

        // Then
        assertEquals(1, result.size());
        assertEquals("Credit Risk Model", result.get(0).getModelName());
    }

    @Test
    void findByFilters_WithBusinessLine_ShouldReturnMatchingModels() {
        // When
        List<Model> result = modelRepository.findByFilters(
                null, null, null, "Retail Banking", null, null, null, null);

        // Then
        assertEquals(1, result.size());
        assertEquals("Retail Banking", result.get(0).getBusinessLine());
    }

    @Test
    void findByFilters_WithMultipleFilters_ShouldReturnMatchingModels() {
        // When
        List<Model> result = modelRepository.findByFilters(
                null, null, null, "Investment Banking", "Market Risk", null, null, null);

        // Then
        assertEquals(1, result.size());
        assertEquals("Market Risk Model", result.get(0).getModelName());
    }

    @Test
    void findByFilters_WithNoFilters_ShouldReturnAllModels() {
        // When
        List<Model> result = modelRepository.findByFilters(
                null, null, null, null, null, null, null, null);

        // Then
        assertEquals(2, result.size());
    }

    @Test
    void findByFilters_WithNonMatchingFilters_ShouldReturnEmptyList() {
        // When
        List<Model> result = modelRepository.findByFilters(
                "Non-existent", null, null, null, null, null, null, null);

        // Then
        assertTrue(result.isEmpty());
    }
}
