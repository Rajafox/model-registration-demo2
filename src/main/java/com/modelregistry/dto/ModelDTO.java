package com.modelregistry.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Schema(description = "Model Data Transfer Object")
public class ModelDTO {
    @Schema(description = "Unique identifier of the model", example = "1")
    private Long modelId;

    @Schema(description = "Name of the model", example = "Credit Scoring Model", required = true)
    @NotBlank(message = "Model name is required")
    private String modelName;

    @Schema(description = "Version of the model", example = "v1.0", required = true)
    @NotBlank(message = "Model version is required")
    private String modelVersion;

    @Schema(description = "Sponsor of the model", example = "John Doe", required = true)
    @NotBlank(message = "Model sponsor is required")
    private String modelSponsor;

    @Schema(description = "Validator name of the model", example = "Jane Smith", required = true)
    @NotBlank(message = "Model validator name is required")
    private String modelValidatorName;

    @Schema(description = "Business line associated with the model", example = "Retail Banking", required = true)
    @NotBlank(message = "Business line is required")
    private String businessLine;

    @Schema(description = "Type of the model", example = "Credit Risk", required = true)
    @NotBlank(message = "Model type is required")
    private String modelType;

    @Schema(description = "Risk rating of the model", example = "High", required = true)
    @NotBlank(message = "Risk rating is required")
    private String riskRating;

    @Schema(description = "Current status of the model", example = "Production")
    private String status;

    @Schema(description = "User who last updated the model", example = "Admin")
    private String updatedBy;

    @Schema(description = "Timestamp when the model was last updated")
    private LocalDateTime updatedOn;

    // Constructors
    public ModelDTO() {}

    public ModelDTO(String modelName, String modelVersion, String modelSponsor, 
                   String modelValidatorName, String businessLine, String modelType, String riskRating, 
                   String status, String updatedBy) {
        this.modelName = modelName;
        this.modelVersion = modelVersion;
        this.modelSponsor = modelSponsor;
        this.modelValidatorName = modelValidatorName;
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