
package com.modelregistry.service;

import com.modelregistry.dto.ModelDTO;
import com.modelregistry.entity.Model;
import com.modelregistry.repository.ModelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ModelServiceTest {

    @Mock
    private ModelRepository modelRepository;

    @InjectMocks
    private ModelService modelService;

    private Model testModel;
    private ModelDTO testModelDTO;

    @BeforeEach
    void setUp() {
        testModel = new Model();
        testModel.setModelId(1L);
        testModel.setModelName("Test Model");
        testModel.setModelVersion("v1.0");
        testModel.setModelSponsor("Test Sponsor");
        testModel.setBusinessLine("Retail Banking");
        testModel.setModelType("Credit Risk");
        testModel.setRiskRating("High");
        testModel.setStatus("Production");
        testModel.setUpdatedBy("Test User");
        testModel.setUpdatedOn(LocalDateTime.now());

        testModelDTO = new ModelDTO();
        testModelDTO.setModelName("Test Model");
        testModelDTO.setModelVersion("v1.0");
        testModelDTO.setModelSponsor("Test Sponsor");
        testModelDTO.setBusinessLine("Retail Banking");
        testModelDTO.setModelType("Credit Risk");
        testModelDTO.setRiskRating("High");
        testModelDTO.setStatus("Production");
        testModelDTO.setUpdatedBy("Test User");
    }

    @Test
    void getAllModels_ShouldReturnAllModels() {
        // Given
        when(modelRepository.findAll()).thenReturn(Arrays.asList(testModel));

        // When
        List<ModelDTO> result = modelService.getAllModels();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Model", result.get(0).getModelName());
        verify(modelRepository, times(1)).findAll();
    }

    @Test
    void getModelById_WhenModelExists_ShouldReturnModel() {
        // Given
        when(modelRepository.findById(1L)).thenReturn(Optional.of(testModel));

        // When
        Optional<ModelDTO> result = modelService.getModelById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("Test Model", result.get().getModelName());
        verify(modelRepository, times(1)).findById(1L);
    }

    @Test
    void getModelById_WhenModelDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(modelRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<ModelDTO> result = modelService.getModelById(1L);

        // Then
        assertFalse(result.isPresent());
        verify(modelRepository, times(1)).findById(1L);
    }

    @Test
    void saveModel_ShouldSaveAndReturnModel() {
        // Given
        when(modelRepository.save(any(Model.class))).thenReturn(testModel);

        // When
        ModelDTO result = modelService.saveModel(testModelDTO);

        // Then
        assertNotNull(result);
        assertEquals("Test Model", result.getModelName());
        verify(modelRepository, times(1)).save(any(Model.class));
    }

    @Test
    void saveDraftModel_ShouldSetStatusToDraft() {
        // Given
        Model draftModel = new Model();
        draftModel.setModelId(1L);
        draftModel.setModelName("Test Model");
        draftModel.setStatus("Draft");
        when(modelRepository.save(any(Model.class))).thenReturn(draftModel);

        // When
        ModelDTO result = modelService.saveDraftModel(testModelDTO);

        // Then
        assertNotNull(result);
        assertEquals("Draft", result.getStatus());
        verify(modelRepository, times(1)).save(any(Model.class));
    }

    @Test
    void updateModel_WhenModelExists_ShouldUpdateAndReturnModel() {
        // Given
        when(modelRepository.findById(1L)).thenReturn(Optional.of(testModel));
        when(modelRepository.save(any(Model.class))).thenReturn(testModel);

        // When
        ModelDTO result = modelService.updateModel(1L, testModelDTO);

        // Then
        assertNotNull(result);
        assertEquals("Test Model", result.getModelName());
        verify(modelRepository, times(1)).findById(1L);
        verify(modelRepository, times(1)).save(any(Model.class));
    }

    @Test
    void updateModel_WhenModelDoesNotExist_ShouldReturnNull() {
        // Given
        when(modelRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        ModelDTO result = modelService.updateModel(1L, testModelDTO);

        // Then
        assertNull(result);
        verify(modelRepository, times(1)).findById(1L);
        verify(modelRepository, never()).save(any(Model.class));
    }

    @Test
    void deleteModel_WhenModelExists_ShouldReturnTrue() {
        // Given
        when(modelRepository.existsById(1L)).thenReturn(true);

        // When
        boolean result = modelService.deleteModel(1L);

        // Then
        assertTrue(result);
        verify(modelRepository, times(1)).existsById(1L);
        verify(modelRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteModel_WhenModelDoesNotExist_ShouldReturnFalse() {
        // Given
        when(modelRepository.existsById(1L)).thenReturn(false);

        // When
        boolean result = modelService.deleteModel(1L);

        // Then
        assertFalse(result);
        verify(modelRepository, times(1)).existsById(1L);
        verify(modelRepository, never()).deleteById(anyLong());
    }

    @Test
    void getFilteredModels_ShouldReturnFilteredResults() {
        // Given
        when(modelRepository.findByFilters(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Arrays.asList(testModel));

        // When
        List<ModelDTO> result = modelService.getFilteredModels(
                "Test", "v1.0", "Sponsor", "Retail Banking", 
                "Credit Risk", "High", "Production", "User");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(modelRepository, times(1)).findByFilters(any(), any(), any(), any(), any(), any(), any(), any());
    }
}
