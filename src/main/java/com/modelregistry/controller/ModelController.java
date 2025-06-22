
package com.modelregistry.controller;

import com.modelregistry.dto.ModelDTO;
import com.modelregistry.service.ModelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "*")
public class ModelController {

    @Autowired
    private ModelService modelService;

    @GetMapping
    public ResponseEntity<List<ModelDTO>> getAllModels() {
        List<ModelDTO> models = modelService.getAllModels();
        return ResponseEntity.ok(models);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModelDTO> getModelById(@PathVariable Long id) {
        Optional<ModelDTO> model = modelService.getModelById(id);
        return model.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ModelDTO> createModel(@Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO savedModel = modelService.saveModel(modelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
    }

    @PostMapping("/draft")
    public ResponseEntity<ModelDTO> createDraftModel(@Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO savedModel = modelService.saveDraftModel(modelDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModelDTO> updateModel(@PathVariable Long id, 
                                               @Valid @RequestBody ModelDTO modelDTO) {
        ModelDTO updatedModel = modelService.updateModel(id, modelDTO);
        return updatedModel != null ? 
               ResponseEntity.ok(updatedModel) : 
               ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        boolean deleted = modelService.deleteModel(id);
        return deleted ? ResponseEntity.noContent().build() : 
                        ResponseEntity.notFound().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ModelDTO>> getFilteredModels(
            @RequestParam(required = false) String modelName,
            @RequestParam(required = false) String modelVersion,
            @RequestParam(required = false) String modelSponsor,
            @RequestParam(required = false) String modelValidatorName,
            @RequestParam(required = false) String businessLine,
            @RequestParam(required = false) String modelType,
            @RequestParam(required = false) String riskRating,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String updatedBy) {
        
        List<ModelDTO> models = modelService.getFilteredModels(
            modelName, modelVersion, modelSponsor, modelValidatorName, businessLine, 
            modelType, riskRating, status, updatedBy);
        return ResponseEntity.ok(models);
    }
}
