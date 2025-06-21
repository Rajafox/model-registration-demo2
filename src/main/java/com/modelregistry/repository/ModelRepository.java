
package com.modelregistry.repository;

import com.modelregistry.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    
    @Query("SELECT m FROM Model m WHERE " +
           "(:modelName IS NULL OR LOWER(m.modelName) LIKE LOWER(CONCAT('%', :modelName, '%'))) AND " +
           "(:modelVersion IS NULL OR LOWER(m.modelVersion) LIKE LOWER(CONCAT('%', :modelVersion, '%'))) AND " +
           "(:modelSponsor IS NULL OR LOWER(m.modelSponsor) LIKE LOWER(CONCAT('%', :modelSponsor, '%'))) AND " +
           "(:businessLine IS NULL OR m.businessLine = :businessLine) AND " +
           "(:modelType IS NULL OR m.modelType = :modelType) AND " +
           "(:riskRating IS NULL OR m.riskRating = :riskRating) AND " +
           "(:status IS NULL OR m.status = :status) AND " +
           "(:updatedBy IS NULL OR LOWER(m.updatedBy) LIKE LOWER(CONCAT('%', :updatedBy, '%')))")
    List<Model> findByFilters(@Param("modelName") String modelName,
                             @Param("modelVersion") String modelVersion,
                             @Param("modelSponsor") String modelSponsor,
                             @Param("businessLine") String businessLine,
                             @Param("modelType") String modelType,
                             @Param("riskRating") String riskRating,
                             @Param("status") String status,
                             @Param("updatedBy") String updatedBy);
}
