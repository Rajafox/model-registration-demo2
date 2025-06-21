package com.modelregistry.service;

import com.modelregistry.dto.ModelDTO;
import com.modelregistry.entity.Model;
import com.modelregistry.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ModelService {

    @Autowired
    private ModelRepository modelRepository;

    public List<ModelDTO> getAllModels() {
        return modelRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<ModelDTO> getAllModels(Pageable pageable) {
        Page<Model> models = modelRepository.findAll(pageable);
        return models.map(this::convertToDTO);
    }

    public Optional<ModelDTO> getModelById(Long id) {
        return modelRepository.findById(id)
                .map(this::convertToDTO);
    }

    public ModelDTO saveModel(ModelDTO modelDTO) {
        Model model = convertToEntity(modelDTO);
        Model savedModel = modelRepository.save(model);
        return convertToDTO(savedModel);
    }

    public ModelDTO saveDraftModel(ModelDTO modelDTO) {
        modelDTO.setStatus("Draft");
        return saveModel(modelDTO);
    }

    public ModelDTO updateModel(Long id, ModelDTO modelDTO) {
        Optional<Model> existingModel = modelRepository.findById(id);
        if (existingModel.isPresent()) {
            Model model = existingModel.get();
            updateModelFromDTO(model, modelDTO);
            Model savedModel = modelRepository.save(model);
            return convertToDTO(savedModel);
        }
        return null;
    }

    public boolean deleteModel(Long id) {
        if (modelRepository.existsById(id)) {
            modelRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<ModelDTO> getFilteredModels(String modelName, String modelVersion, 
                                          String modelSponsor, String modelValidatorName, String businessLine, 
                                          String modelType, String riskRating, 
                                          String status, String updatedBy) {
        return modelRepository.findByFilters(modelName, modelVersion, modelSponsor, 
                                           modelValidatorName, businessLine, modelType, riskRating, 
                                           status, updatedBy)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<ModelDTO> getFilteredModels(String modelName, String modelVersion, 
                                          String modelSponsor, String modelValidatorName, String businessLine, 
                                          String modelType, String riskRating, 
                                          String status, String updatedBy, Pageable pageable) {
        Page<Model> models = modelRepository.findByFilters(modelName, modelVersion, modelSponsor, 
                                           modelValidatorName, businessLine, modelType, riskRating, 
                                           status, updatedBy, pageable);
        return models.map(this::convertToDTO);
    }

    private ModelDTO convertToDTO(Model model) {
        ModelDTO dto = new ModelDTO();
        dto.setModelId(model.getModelId());
        dto.setModelName(model.getModelName());
        dto.setModelVersion(model.getModelVersion());
        dto.setModelSponsor(model.getModelSponsor());        dto.setModelValidatorName(model.getModelValidatorName());
        dto.setBusinessLine(model.getBusinessLine());
        dto.setModelType(model.getModelType());
        dto.setRiskRating(model.getRiskRating());
        dto.setStatus(model.getStatus());
        dto.setUpdatedBy(model.getUpdatedBy());
        dto.setUpdatedOn(model.getUpdatedOn());
        return dto;
    }

    private Model convertToEntity(ModelDTO dto) {
        Model model = new Model();
        model.setModelName(dto.getModelName());
        model.setModelVersion(dto.getModelVersion());
        model.setModelSponsor(dto.getModelSponsor());
        model.setModelValidatorName(dto.getModelValidatorName());
        model.setBusinessLine(dto.getBusinessLine());
        model.setModelType(dto.getModelType());
        model.setRiskRating(dto.getRiskRating());
        // Set default status as Draft if no status provided
        model.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus() : "Draft");
        model.setUpdatedBy(dto.getUpdatedBy());
        return model;
    }

    private void updateModelFromDTO(Model model, ModelDTO dto) {
        model.setModelName(dto.getModelName());
        model.setModelVersion(dto.getModelVersion());
        model.setModelSponsor(dto.getModelSponsor());
        model.setModelValidatorName(dto.getModelValidatorName());
        model.setBusinessLine(dto.getBusinessLine());
        model.setModelType(dto.getModelType());
        model.setRiskRating(dto.getRiskRating());
        model.setStatus(dto.getStatus());
        model.setUpdatedBy(dto.getUpdatedBy());
    }
}