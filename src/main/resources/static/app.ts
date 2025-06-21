
/// <reference path="interfaces.ts" />

interface IModelService {
  get(url: string): ng.IPromise<ng.IHttpResponse<Model[]>>;
  post(url: string, data: Model): ng.IPromise<ng.IHttpResponse<Model>>;
  put(url: string, data: Model): ng.IPromise<ng.IHttpResponse<Model>>;
  delete(url: string): ng.IPromise<ng.IHttpResponse<any>>;
}

class ModelController {
  public models: Model[] = [];
  public currentModel: Model = {} as Model;
  public currentView: string = 'grid';
  public isEditing: boolean = false;
  public sortField: string = 'modelId';
  public reverse: boolean = false;
  public filters: ModelFilters = {
    modelName: '',
    modelVersion: '',
    modelSponsor: '',
    modelValidatorName: '',
    businessLine: '',
    modelType: '',
    riskRating: '',
    status: '',
    updatedBy: ''
  };

  static $inject = ['$scope', '$http'];

  constructor(
    private $scope: ModelScope,
    private $http: ng.IHttpService
  ) {
    this.assignScopeMethods();
    this.loadModels();
  }

  private assignScopeMethods(): void {
    this.$scope.models = this.models;
    this.$scope.currentModel = this.currentModel;
    this.$scope.currentView = this.currentView;
    this.$scope.isEditing = this.isEditing;
    this.$scope.sortField = this.sortField;
    this.$scope.reverse = this.reverse;
    this.$scope.filters = this.filters;

    this.$scope.loadModels = () => this.loadModels();
    this.$scope.applyFilters = () => this.applyFilters();
    this.$scope.sortBy = (field: string) => this.sortBy(field);
    this.$scope.showCreateForm = () => this.showCreateForm();
    this.$scope.editModel = (model: Model) => this.editModel(model);
    this.$scope.saveModel = () => this.saveModel();
    this.$scope.saveDraft = () => this.saveDraft();
    this.$scope.deleteModel = (modelId: number) => this.deleteModel(modelId);
    this.$scope.cancelForm = () => this.cancelForm();
  }

  private updateScope(): void {
    this.$scope.models = this.models;
    this.$scope.currentModel = this.currentModel;
    this.$scope.currentView = this.currentView;
    this.$scope.isEditing = this.isEditing;
    this.$scope.sortField = this.sortField;
    this.$scope.reverse = this.reverse;
  }

  public loadModels(): void {
    this.$http.get<Model[]>('/api/models')
      .then((response: ng.IHttpResponse<Model[]>) => {
        this.models = response.data;
        this.updateScope();
      })
      .catch((error: any) => {
        console.error('Error loading models:', error);
        alert('Failed to load models');
      });
  }

  public applyFilters(): void {
    const params: { [key: string]: string } = {};
    
    if (this.filters.modelName) params.modelName = this.filters.modelName;
    if (this.filters.modelVersion) params.modelVersion = this.filters.modelVersion;
    if (this.filters.modelSponsor) params.modelSponsor = this.filters.modelSponsor;
    if (this.filters.modelValidatorName) params.modelValidatorName = this.filters.modelValidatorName;
    if (this.filters.businessLine) params.businessLine = this.filters.businessLine;
    if (this.filters.modelType) params.modelType = this.filters.modelType;
    if (this.filters.riskRating) params.riskRating = this.filters.riskRating;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.updatedBy) params.updatedBy = this.filters.updatedBy;

    const paramString: string = Object.keys(params)
      .map(key => key + '=' + encodeURIComponent(params[key]))
      .join('&');
    const url: string = '/api/models/filter' + (paramString ? '?' + paramString : '');

    this.$http.get<Model[]>(url)
      .then((response: ng.IHttpResponse<Model[]>) => {
        this.models = response.data;
        this.updateScope();
      })
      .catch((error: any) => {
        console.error('Error filtering models:', error);
        alert('Failed to filter models');
      });
  }

  public sortBy(field: string): void {
    if (this.sortField === field) {
      this.reverse = !this.reverse;
    } else {
      this.sortField = field;
      this.reverse = false;
    }
    this.updateScope();
  }

  public showCreateForm(): void {
    this.currentModel = {
      updatedBy: 'Current User',
      modelValidatorName: '',
      modelName: '',
      modelVersion: '',
      modelSponsor: '',
      businessLine: '',
      modelType: '',
      riskRating: '',
      status: ''
    };
    this.isEditing = false;
    this.currentView = 'form';
    this.updateScope();
  }

  public editModel(model: Model): void {
    this.currentModel = angular.copy(model);
    this.isEditing = true;
    this.currentView = 'form';
    this.updateScope();
  }

  public saveModel(): void {
    if (this.isEditing && this.currentModel.modelId) {
      // Update existing model
      this.$http.put<Model>('/api/models/' + this.currentModel.modelId, this.currentModel)
        .then((response: ng.IHttpResponse<Model>) => {
          alert('Model updated successfully!');
          this.currentView = 'grid';
          this.loadModels();
          this.updateScope();
        })
        .catch((error: any) => {
          console.error('Error updating model:', error);
          alert('Failed to update model');
        });
    } else {
      // Create new model with status
      this.currentModel.status = 'In Development';
      this.$http.post<Model>('/api/models', this.currentModel)
        .then((response: ng.IHttpResponse<Model>) => {
          alert('Model created successfully!');
          this.currentView = 'grid';
          this.loadModels();
          this.updateScope();
        })
        .catch((error: any) => {
          console.error('Error creating model:', error);
          alert('Failed to create model');
        });
    }
  }

  public saveDraft(): void {
    this.$http.post<Model>('/api/models/draft', this.currentModel)
      .then((response: ng.IHttpResponse<Model>) => {
        alert('Model saved as draft successfully!');
        this.currentView = 'grid';
        this.loadModels();
        this.updateScope();
      })
      .catch((error: any) => {
        console.error('Error saving draft:', error);
        alert('Failed to save draft');
      });
  }

  public deleteModel(modelId: number): void {
    if (confirm('Are you sure you want to delete this model?')) {
      this.$http.delete('/api/models/' + modelId)
        .then((response: ng.IHttpResponse<any>) => {
          alert('Model deleted successfully!');
          this.loadModels();
        })
        .catch((error: any) => {
          console.error('Error deleting model:', error);
          alert('Failed to delete model');
        });
    }
  }

  public cancelForm(): void {
    this.currentView = 'grid';
    this.currentModel = {} as Model;
    this.updateScope();
  }
}

angular.module('modelRegistryApp', [])
  .controller('ModelController', ModelController);
