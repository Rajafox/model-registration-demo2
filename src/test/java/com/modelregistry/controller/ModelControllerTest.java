
package com.modelregistry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.modelregistry.dto.ModelDTO;
import com.modelregistry.service.ModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ModelController.class)
class ModelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ModelService modelService;

    @Autowired
    private ObjectMapper objectMapper;

    private ModelDTO testModelDTO;

    @BeforeEach
    void setUp() {
        testModelDTO = new ModelDTO();
        testModelDTO.setModelId(1L);
        testModelDTO.setModelName("Test Model");
        testModelDTO.setModelVersion("v1.0");
        testModelDTO.setModelSponsor("Test Sponsor");
        testModelDTO.setBusinessLine("Retail Banking");
        testModelDTO.setModelType("Credit Risk");
        testModelDTO.setRiskRating("High");
        testModelDTO.setStatus("Production");
        testModelDTO.setUpdatedBy("Test User");
        testModelDTO.setUpdatedOn(LocalDateTime.now());
    }

    @Test
    void getAllModels_ShouldReturnAllModels() throws Exception {
        // Given
        when(modelService.getAllModels()).thenReturn(Arrays.asList(testModelDTO));

        // When & Then
        mockMvc.perform(get("/api/models"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].modelName").value("Test Model"));

        verify(modelService, times(1)).getAllModels();
    }

    @Test
    void getModelById_WhenModelExists_ShouldReturnModel() throws Exception {
        // Given
        when(modelService.getModelById(1L)).thenReturn(Optional.of(testModelDTO));

        // When & Then
        mockMvc.perform(get("/api/models/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.modelName").value("Test Model"));

        verify(modelService, times(1)).getModelById(1L);
    }

    @Test
    void getModelById_WhenModelDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Given
        when(modelService.getModelById(1L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/models/1"))
                .andExpect(status().isNotFound());

        verify(modelService, times(1)).getModelById(1L);
    }

    @Test
    void createModel_WithValidData_ShouldCreateModel() throws Exception {
        // Given
        when(modelService.saveModel(any(ModelDTO.class))).thenReturn(testModelDTO);

        // When & Then
        mockMvc.perform(post("/api/models")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testModelDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.modelName").value("Test Model"));

        verify(modelService, times(1)).saveModel(any(ModelDTO.class));
    }

    @Test
    void createDraftModel_WithValidData_ShouldCreateDraftModel() throws Exception {
        // Given
        testModelDTO.setStatus("Draft");
        when(modelService.saveDraftModel(any(ModelDTO.class))).thenReturn(testModelDTO);

        // When & Then
        mockMvc.perform(post("/api/models/draft")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testModelDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Draft"));

        verify(modelService, times(1)).saveDraftModel(any(ModelDTO.class));
    }

    @Test
    void updateModel_WhenModelExists_ShouldUpdateModel() throws Exception {
        // Given
        when(modelService.updateModel(anyLong(), any(ModelDTO.class))).thenReturn(testModelDTO);

        // When & Then
        mockMvc.perform(put("/api/models/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testModelDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelName").value("Test Model"));

        verify(modelService, times(1)).updateModel(anyLong(), any(ModelDTO.class));
    }

    @Test
    void updateModel_WhenModelDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Given
        when(modelService.updateModel(anyLong(), any(ModelDTO.class))).thenReturn(null);

        // When & Then
        mockMvc.perform(put("/api/models/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testModelDTO)))
                .andExpect(status().isNotFound());

        verify(modelService, times(1)).updateModel(anyLong(), any(ModelDTO.class));
    }

    @Test
    void deleteModel_WhenModelExists_ShouldDeleteModel() throws Exception {
        // Given
        when(modelService.deleteModel(1L)).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/models/1"))
                .andExpect(status().isNoContent());

        verify(modelService, times(1)).deleteModel(1L);
    }

    @Test
    void deleteModel_WhenModelDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Given
        when(modelService.deleteModel(1L)).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/models/1"))
                .andExpect(status().isNotFound());

        verify(modelService, times(1)).deleteModel(1L);
    }

    @Test
    void getFilteredModels_ShouldReturnFilteredResults() throws Exception {
        // Given
        when(modelService.getFilteredModels(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Arrays.asList(testModelDTO));

        // When & Then
        mockMvc.perform(get("/api/models/filter")
                .param("modelName", "Test")
                .param("businessLine", "Retail Banking"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].modelName").value("Test Model"));

        verify(modelService, times(1)).getFilteredModels(any(), any(), any(), any(), any(), any(), any(), any());
    }
}
