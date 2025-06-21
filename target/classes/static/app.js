
angular.module('modelRegistryApp', [])
.controller('ModelController', ['$scope', '$http', function($scope, $http) {
    $scope.models = [];
    $scope.currentModel = {};
    $scope.currentView = 'grid';
    $scope.isEditing = false;
    $scope.sortField = 'modelId';
    $scope.reverse = false;
    $scope.filters = {
        modelName: '',
        modelVersion: '',
        modelSponsor: '',
        businessLine: '',
        modelType: '',
        riskRating: '',
        status: '',
        updatedBy: ''
    };

    // Load all models
    $scope.loadModels = function() {
        $http.get('/api/models')
            .then(function(response) {
                $scope.models = response.data;
            })
            .catch(function(error) {
                console.error('Error loading models:', error);
                alert('Failed to load models');
            });
    };

    // Apply filters
    $scope.applyFilters = function() {
        var params = {};
        
        if ($scope.filters.modelName) params.modelName = $scope.filters.modelName;
        if ($scope.filters.modelVersion) params.modelVersion = $scope.filters.modelVersion;
        if ($scope.filters.modelSponsor) params.modelSponsor = $scope.filters.modelSponsor;
        if ($scope.filters.businessLine) params.businessLine = $scope.filters.businessLine;
        if ($scope.filters.modelType) params.modelType = $scope.filters.modelType;
        if ($scope.filters.riskRating) params.riskRating = $scope.filters.riskRating;
        if ($scope.filters.status) params.status = $scope.filters.status;
        if ($scope.filters.updatedBy) params.updatedBy = $scope.filters.updatedBy;

        var paramString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        var url = '/api/models/filter' + (paramString ? '?' + paramString : '');

        $http.get(url)
            .then(function(response) {
                $scope.models = response.data;
            })
            .catch(function(error) {
                console.error('Error filtering models:', error);
                alert('Failed to filter models');
            });
    };

    // Sort by field
    $scope.sortBy = function(field) {
        if ($scope.sortField === field) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.sortField = field;
            $scope.reverse = false;
        }
    };

    // Show create form
    $scope.showCreateForm = function() {
        $scope.currentModel = {
            updatedBy: 'Current User'
        };
        $scope.isEditing = false;
        $scope.currentView = 'form';
    };

    // Edit model
    $scope.editModel = function(model) {
        $scope.currentModel = angular.copy(model);
        $scope.isEditing = true;
        $scope.currentView = 'form';
    };

    // Save model
    $scope.saveModel = function() {
        if ($scope.isEditing) {
            // Update existing model
            $http.put('/api/models/' + $scope.currentModel.modelId, $scope.currentModel)
                .then(function(response) {
                    alert('Model updated successfully!');
                    $scope.currentView = 'grid';
                    $scope.loadModels();
                })
                .catch(function(error) {
                    console.error('Error updating model:', error);
                    alert('Failed to update model');
                });
        } else {
            // Create new model with status
            $scope.currentModel.status = 'In Development';
            $http.post('/api/models', $scope.currentModel)
                .then(function(response) {
                    alert('Model created successfully!');
                    $scope.currentView = 'grid';
                    $scope.loadModels();
                })
                .catch(function(error) {
                    console.error('Error creating model:', error);
                    alert('Failed to create model');
                });
        }
    };

    // Save as draft
    $scope.saveDraft = function() {
        $http.post('/api/models/draft', $scope.currentModel)
            .then(function(response) {
                alert('Model saved as draft successfully!');
                $scope.currentView = 'grid';
                $scope.loadModels();
            })
            .catch(function(error) {
                console.error('Error saving draft:', error);
                alert('Failed to save draft');
            });
    };

    // Delete model
    $scope.deleteModel = function(modelId) {
        if (confirm('Are you sure you want to delete this model?')) {
            $http.delete('/api/models/' + modelId)
                .then(function(response) {
                    alert('Model deleted successfully!');
                    $scope.loadModels();
                })
                .catch(function(error) {
                    console.error('Error deleting model:', error);
                    alert('Failed to delete model');
                });
        }
    };

    // Cancel form
    $scope.cancelForm = function() {
        $scope.currentView = 'grid';
        $scope.currentModel = {};
    };

    // Initialize
    $scope.loadModels();
}]);
