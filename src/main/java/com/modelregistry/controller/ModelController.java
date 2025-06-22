
package com.modelregistry.controller;

import com.modelregistry.dto.ModelDTO;
import com.modelregistry.service.ModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Tag(name = "Model Registry", description = "Model management APIs")
@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "*")
public class ModelController {

    @Autowired
    private ModelService modelService;

    @Operation(summary = "Get all models", description = "Retrieve a paginated list of all models in the registry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all models"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Page<ModelDTO>> getAllModels(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "5") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "modelId") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<ModelDTO> models = modelService.getAllModels(pageable);
        return ResponseEntity.ok(models);
    }

    @Operation(summary = "Get model by ID", description = "Retrieve a specific model by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the model"),
        @ApiResponse(responseCode = "404", description = "Model not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ModelDTO> getModelById(
            @Parameter(description = "ID of the model to retrieve") @PathVariable Long id) {
        Optional<ModelDTO> model = modelService.getModelById(id);
        return model.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new model", description = "Create a new model in the registry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Model created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<ModelDTO> createModel(
            @Parameter(description = "Model data to create") @Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO savedModel = modelService.saveModel(modelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
    }

    @Operation(summary = "Create a draft model", description = "Create a new model with draft status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Draft model created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/draft")
    public ResponseEntity<ModelDTO> createDraftModel(
            @Parameter(description = "Model data to create as draft") @Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO savedModel = modelService.saveDraftModel(modelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
    }

    @Operation(summary = "Update a model", description = "Update an existing model by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Model updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Model not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ModelDTO> updateModel(
            @Parameter(description = "ID of the model to update") @PathVariable Long id, 
            @Parameter(description = "Updated model data") @Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO updatedModel = modelService.updateModel(id, modelDTO);
        return updatedModel != null ? 
               ResponseEntity.ok(updatedModel) : 
               ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete a model", description = "Delete a model by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Model deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Model not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModel(
            @Parameter(description = "ID of the model to delete") @PathVariable Long id) {
        boolean deleted = modelService.deleteModel(id);
        return deleted ? ResponseEntity.noContent().build() : 
                        ResponseEntity.notFound().build();
    }

    @Operation(summary = "Filter models", description = "Retrieve models based on filter criteria with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved filtered models"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/filter")
    public ResponseEntity<Page<ModelDTO>> getFilteredModels(
            @Parameter(description = "Filter by model name") @RequestParam(required = false) String modelName,
            @Parameter(description = "Filter by model version") @RequestParam(required = false) String modelVersion,
            @Parameter(description = "Filter by model sponsor") @RequestParam(required = false) String modelSponsor,
            @Parameter(description = "Filter by model validator name") @RequestParam(required = false) String modelValidatorName,
            @Parameter(description = "Filter by business line") @RequestParam(required = false) String businessLine,
            @Parameter(description = "Filter by model type") @RequestParam(required = false) String modelType,
            @Parameter(description = "Filter by risk rating") @RequestParam(required = false) String riskRating,
            @Parameter(description = "Filter by status") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by updated by") @RequestParam(required = false) String updatedBy,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "5") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "modelId") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<ModelDTO> models = modelService.getFilteredModels(
            modelName, modelVersion, modelSponsor, modelValidatorName, businessLine, 
            modelType, riskRating, status, updatedBy, pageable);
        return ResponseEntity.ok(models);
    }
}
