
interface Model {
  modelId?: number;
  modelName: string;
  modelVersion: string;
  modelSponsor: string;
  modelValidatorName: string;
  businessLine: string;
  modelType: string;
  riskRating: string;
  status: string;
  updatedBy: string;
  updatedOn?: string;
}

interface ModelFilters {
  modelName: string;
  modelVersion: string;
  modelSponsor: string;
  modelValidatorName: string;
  businessLine: string;
  modelType: string;
  riskRating: string;
  status: string;
  updatedBy: string;
}

interface ModelScope extends ng.IScope {
  models: Model[];
  currentModel: Model;
  currentView: string;
  isEditing: boolean;
  sortField: string;
  reverse: boolean;
  filters: ModelFilters;
  loadModels(): void;
  applyFilters(): void;
  sortBy(field: string): void;
  showCreateForm(): void;
  editModel(model: Model): void;
  saveModel(): void;
  saveDraft(): void;
  deleteModel(modelId: number): void;
  cancelForm(): void;
}
