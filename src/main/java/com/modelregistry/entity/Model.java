
package com.modelregistry.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "models")
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modelId;

    @NotBlank(message = "Model name is required")
    @Size(max = 255, message = "Model name must not exceed 255 characters")
    @Column(nullable = false)
    private String modelName;

    @NotBlank(message = "Model version is required")
    @Size(max = 50, message = "Model version must not exceed 50 characters")
    @Column(nullable = false)
    private String modelVersion;

    @NotBlank(message = "Model sponsor is required")
    @Size(max = 255, message = "Model sponsor must not exceed 255 characters")
    @Column(nullable = false)
    private String modelSponsor;

    @NotBlank(message = "Business line is required")
    @Column(nullable = false)
    private String businessLine;

    @NotBlank(message = "Model type is required")
    @Column(nullable = false)
    private String modelType;

    @NotBlank(message = "Risk rating is required")
    @Column(nullable = false)
    private String riskRating;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String updatedBy;

    @Column(nullable = false)
    private LocalDateTime updatedOn;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.updatedOn = LocalDateTime.now();
        if (this.updatedBy == null) {
            this.updatedBy = "System";
        }
    }

    // Constructors
    public Model() {}

    public Model(String modelName, String modelVersion, String modelSponsor, 
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
        this.updatedOn = LocalDateTime.now();
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
