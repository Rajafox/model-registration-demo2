package com.modelregistry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class ModelDTO {
    private Long modelId;

    @NotBlank(message = "Model name is required")
    @Size(max = 255, message = "Model name must not exceed 255 characters")
    private String modelName;

    @NotBlank(message = "Model version is required")
    @Size(max = 50, message = "Model version must not exceed 50 characters")
    private String modelVersion;

    @NotBlank(message = "Model sponsor is required")
    private String modelSponsor;

    @NotBlank(message = "Model validator name is required")
    private String modelValidatorName;

    @NotBlank(message = "Business line is required")
    private String businessLine;

    @NotBlank(message = "Model type is required")
    private String modelType;

    @NotBlank(message = "Risk rating is required")
    private String riskRating;

    private String status;

    private String updatedBy;
    private LocalDateTime updatedOn;

    // Constructors
    public ModelDTO() {}

    public ModelDTO(String modelName, String modelVersion, String modelSponsor, 
                   String businessLine, String modelType, String riskRating, 
                   String status, String updatedBy) {
        this.modelName = modelName;
        this.modelVersion = modelVersion;
        this.modelSponsor = modelSponsor;
        this.businessLine = businessLine;
        this.modelType = modelType;
        this.riskRating = riskRating;
        this.status = status;
        this.updatedBy = updatedBy;
    }

    // Getters and Setters
    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelVersion() { return modelVersion; }
    public void setModelVersion(String modelVersion) { this.modelVersion = modelVersion; }

    public String getModelSponsor() { return modelSponsor; }
    public void setModelSponsor(String modelSponsor) { this.modelSponsor = modelSponsor; }

    public String getModelValidatorName() {
        return modelValidatorName;
    }

    public void setModelValidatorName(String modelValidatorName) {
        this.modelValidatorName = modelValidatorName;
    }

    public String getBusinessLine() { return businessLine; }
    public void setBusinessLine(String businessLine) { this.businessLine = businessLine; }

    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }

    public String getRiskRating() { return riskRating; }
    public void setRiskRating(String riskRating) { this.riskRating = riskRating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedOn() { return updatedOn; }
    public void setUpdatedOn(LocalDateTime updatedOn) { this.updatedOn = updatedOn; }
}