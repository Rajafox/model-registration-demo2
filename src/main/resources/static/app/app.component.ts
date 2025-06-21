
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelService, ModelDTO, PageResponse } from './services/model.service';

@Component({
  selector: 'model-registry-app',
  template: `
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <i class="fas fa-chart-line me-2"></i>Model Registration System
          </a>
        </div>
      </nav>

      <!-- Model Inventory Grid -->
      <div class="card" *ngIf="currentView === 'grid'">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="fas fa-table me-2"></i>Model Inventory
          </h5>
          <button class="btn btn-success" (click)="showCreateForm()">
            <i class="fas fa-plus me-2"></i>Create Model
          </button>
        </div>
        <div class="card-body">
          <!-- Filters -->
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Model Name" 
                     [(ngModel)]="filters.modelName" (input)="applyFilters()">
            </div>
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Model Version" 
                     [(ngModel)]="filters.modelVersion" (input)="applyFilters()">
            </div>
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Model Sponsor" 
                     [(ngModel)]="filters.modelSponsor" (input)="applyFilters()">
            </div>
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Model Validator Name" 
                     [(ngModel)]="filters.modelValidatorName" (input)="applyFilters()">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.businessLine" (change)="applyFilters()">
                <option value="">All Business Lines</option>
                <option value="Retail Banking">Retail Banking</option>
                <option value="Wholesale Lending">Wholesale Lending</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Risk Management">Risk Management</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.modelType" (change)="applyFilters()">
                <option value="">All Model Types</option>
                <option value="Credit Risk">Credit Risk</option>
                <option value="Market Risk">Market Risk</option>
                <option value="Operational Risk">Operational Risk</option>
                <option value="AML">AML</option>
                <option value="Capital Calculation">Capital Calculation</option>
                <option value="Valuation">Valuation</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.riskRating" (change)="applyFilters()">
                <option value="">All Risk Ratings</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.status" (change)="applyFilters()">
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="In Development">In Development</option>
                <option value="Validated">Validated</option>
                <option value="Production">Production</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-3">
              <input type="text" class="form-control" placeholder="Updated By" 
                     [(ngModel)]="filters.updatedBy" (input)="applyFilters()">
            </div>
          </div>

          <!-- Page Size Selector -->
          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Page Size:</label>
              <select class="form-select" [(ngModel)]="pagination.pageSize" (change)="changePageSize()">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div class="col-md-9 d-flex align-items-end">
              <span class="text-muted">
                Showing {{pagination.currentPage * pagination.pageSize + 1}} to 
                {{getEndIndex()}} 
                of {{pagination.totalElements}} entries
              </span>
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th (click)="sortBy('modelId')" class="sortable">
                    Model ID 
                    <i class="fas" [class.fa-sort-up]="sortField === 'modelId' && !reverse"
                       [class.fa-sort-down]="sortField === 'modelId' && reverse"
                       [class.fa-sort]="sortField !== 'modelId'"></i>
                  </th>
                  <th (click)="sortBy('modelName')" class="sortable">
                    Model Name 
                    <i class="fas" [class.fa-sort-up]="sortField === 'modelName' && !reverse"
                       [class.fa-sort-down]="sortField === 'modelName' && reverse"
                       [class.fa-sort]="sortField !== 'modelName'"></i>
                  </th>
                  <th (click)="sortBy('modelVersion')" class="sortable">
                    Model Version 
                    <i class="fas" [class.fa-sort-up]="sortField === 'modelVersion' && !reverse"
                       [class.fa-sort-down]="sortField === 'modelVersion' && reverse"
                       [class.fa-sort]="sortField !== 'modelVersion'"></i>
                  </th>
                  <th (click)="sortBy('modelSponsor')" class="sortable">
                    Model Sponsor 
                    <i class="fas" [class.fa-sort-up]="sortField === 'modelSponsor' && !reverse"
                       [class.fa-sort-down]="sortField === 'modelSponsor' && reverse"
                       [class.fa-sort]="sortField !== 'modelSponsor'"></i>
                  </th>
                  <th (click)="sortBy('businessLine')" class="sortable">
                    Business Line 
                    <i class="fas" [class.fa-sort-up]="sortField === 'businessLine' && !reverse"
                       [class.fa-sort-down]="sortField === 'businessLine' && reverse"
                       [class.fa-sort]="sortField !== 'businessLine'"></i>
                  </th>
                  <th (click)="sortBy('modelType')" class="sortable">
                    Model Type 
                    <i class="fas" [class.fa-sort-up]="sortField === 'modelType' && !reverse"
                       [class.fa-sort-down]="sortField === 'modelType' && reverse"
                       [class.fa-sort]="sortField !== 'modelType'"></i>
                  </th>
                  <th (click)="sortBy('riskRating')" class="sortable">
                    Risk Rating 
                    <i class="fas" [class.fa-sort-up]="sortField === 'riskRating' && !reverse"
                       [class.fa-sort-down]="sortField === 'riskRating' && reverse"
                       [class.fa-sort]="sortField !== 'riskRating'"></i>
                  </th>
                  <th (click)="sortBy('status')" class="sortable">
                    Status 
                    <i class="fas" [class.fa-sort-up]="sortField === 'status' && !reverse"
                       [class.fa-sort-down]="sortField === 'status' && reverse"
                       [class.fa-sort]="sortField !== 'status'"></i>
                  </th>
                  <th (click)="sortBy('updatedBy')" class="sortable">
                    Updated By 
                    <i class="fas" [class.fa-sort-up]="sortField === 'updatedBy' && !reverse"
                       [class.fa-sort-down]="sortField === 'updatedBy' && reverse"
                       [class.fa-sort]="sortField !== 'updatedBy'"></i>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let model of models">
                  <td>{{model.modelId}}</td>
                  <td>{{model.modelName}}</td>
                  <td>{{model.modelVersion}}</td>
                  <td>{{model.modelSponsor}}</td>
                  <td>{{model.businessLine}}</td>
                  <td>{{model.modelType}}</td>
                  <td>
                    <span class="badge" [class.bg-danger]="model.riskRating === 'High'"
                          [class.bg-warning]="model.riskRating === 'Medium'"
                          [class.bg-success]="model.riskRating === 'Low'">{{model.riskRating}}</span>
                  </td>
                  <td>
                    <span class="badge" [class.bg-secondary]="model.status === 'Draft'"
                          [class.bg-info]="model.status === 'In Development'"
                          [class.bg-warning]="model.status === 'Validated'"
                          [class.bg-success]="model.status === 'Production'"
                          [class.bg-dark]="model.status === 'Retired'">{{model.status}}</span>
                  </td>
                  <td>{{model.updatedBy}}</td>
                  <td>
                    <button class="btn btn-sm btn-primary me-1" (click)="editModel(model)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteModel(model.modelId)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
              <button class="btn btn-outline-primary me-1" 
                      (click)="goToPage(0)" 
                      [disabled]="pagination.first">
                <i class="fas fa-angle-double-left"></i> First
              </button>
              <button class="btn btn-outline-primary me-1" 
                      (click)="goToPage(pagination.currentPage - 1)" 
                      [disabled]="pagination.first">
                <i class="fas fa-angle-left"></i> Previous
              </button>
            </div>
            
            <div class="d-flex align-items-center">
              <span class="me-2">Page</span>
              <span class="badge bg-primary me-2">{{pagination.currentPage + 1}}</span>
              <span class="me-2">of {{pagination.totalPages}}</span>
            </div>
            
            <div>
              <button class="btn btn-outline-primary me-1" 
                      (click)="goToPage(pagination.currentPage + 1)" 
                      [disabled]="pagination.last">
                Next <i class="fas fa-angle-right"></i>
              </button>
              <button class="btn btn-outline-primary" 
                      (click)="goToPage(pagination.totalPages - 1)" 
                      [disabled]="pagination.last">
                Last <i class="fas fa-angle-double-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Model Form -->
      <div class="card" *ngIf="currentView === 'form'">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="fas fa-plus me-2"></i>{{isEditing ? 'Edit' : 'Create'}} Model
          </h5>
        </div>
        <div class="card-body">
          <form [formGroup]="modelForm" (ngSubmit)="saveModel()">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Model Name *</label>
                  <input type="text" class="form-control" formControlName="modelName" 
                         [class.is-invalid]="modelForm.get('modelName')?.invalid && modelForm.get('modelName')?.touched">
                  <div class="invalid-feedback" *ngIf="modelForm.get('modelName')?.invalid && modelForm.get('modelName')?.touched">
                    Model name is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Model Version *</label>
                  <input type="text" class="form-control" formControlName="modelVersion" 
                         placeholder="e.g., v1.0"
                         [class.is-invalid]="modelForm.get('modelVersion')?.invalid && modelForm.get('modelVersion')?.touched">
                  <div class="invalid-feedback" *ngIf="modelForm.get('modelVersion')?.invalid && modelForm.get('modelVersion')?.touched">
                    Model version is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Model Sponsor *</label>
                  <input type="text" class="form-control" formControlName="modelSponsor" 
                         placeholder="Department Head or Individual Name"
                         [class.is-invalid]="modelForm.get('modelSponsor')?.invalid && modelForm.get('modelSponsor')?.touched">
                  <div class="invalid-feedback" *ngIf="modelForm.get('modelSponsor')?.invalid && modelForm.get('modelSponsor')?.touched">
                    Model sponsor is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Model Validator Name *</label>
                  <input type="text" class="form-control" formControlName="modelValidatorName" 
                         placeholder="Validator Name"
                         [class.is-invalid]="modelForm.get('modelValidatorName')?.invalid && modelForm.get('modelValidatorName')?.touched">
                  <div class="invalid-feedback" *ngIf="modelForm.get('modelValidatorName')?.invalid && modelForm.get('modelValidatorName')?.touched">
                    Model validator name is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Business Line *</label>
                  <select class="form-select" formControlName="businessLine"
                          [class.is-invalid]="modelForm.get('businessLine')?.invalid && modelForm.get('businessLine')?.touched">
                    <option value="">Select Business Line</option>
                    <option value="Retail Banking">Retail Banking</option>
                    <option value="Wholesale Lending">Wholesale Lending</option>
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Risk Management">Risk Management</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="modelForm.get('businessLine')?.invalid && modelForm.get('businessLine')?.touched">
                    Business line is required
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Model Type *</label>
                  <select class="form-select" formControlName="modelType"
                          [class.is-invalid]="modelForm.get('modelType')?.invalid && modelForm.get('modelType')?.touched">
                    <option value="">Select Model Type</option>
                    <option value="Credit Risk">Credit Risk</option>
                    <option value="Market Risk">Market Risk</option>
                    <option value="Operational Risk">Operational Risk</option>
                    <option value="AML">AML</option>
                    <option value="Capital Calculation">Capital Calculation</option>
                    <option value="Valuation">Valuation</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="modelForm.get('modelType')?.invalid && modelForm.get('modelType')?.touched">
                    Model type is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Risk Rating *</label>
                  <select class="form-select" formControlName="riskRating"
                          [class.is-invalid]="modelForm.get('riskRating')?.invalid && modelForm.get('riskRating')?.touched">
                    <option value="">Select Risk Rating</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="modelForm.get('riskRating')?.invalid && modelForm.get('riskRating')?.touched">
                    Risk rating is required
                  </div>
                </div>
              </div>
              <div class="col-md-6" *ngIf="isEditing">
                <div class="mb-3">
                  <label class="form-label">Status *</label>
                  <select class="form-select" formControlName="status"
                          [class.is-invalid]="modelForm.get('status')?.invalid && modelForm.get('status')?.touched">
                    <option value="">Select Status</option>
                    <option value="Draft">Draft</option>
                    <option value="In Development">In Development</option>
                    <option value="Validated">Validated</option>
                    <option value="Production">Production</option>
                    <option value="Retired">Retired</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="modelForm.get('status')?.invalid && modelForm.get('status')?.touched">
                    Status is required
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="modelForm.invalid">
                    <i class="fas fa-save me-2"></i>{{isEditing ? 'Update' : 'Submit'}}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="saveDraft()" 
                          *ngIf="!isEditing">
                    <i class="fas fa-file-alt me-2"></i>Save as Draft
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelForm()">
                    <i class="fas fa-times me-2"></i>Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sortable {
      cursor: pointer;
    }
    .sortable:hover {
      background-color: #495057;
    }
    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class AppComponent implements OnInit {
  models: ModelDTO[] = [];
  currentView: string = 'grid';
  isEditing: boolean = false;
  sortField: string = 'modelId';
  reverse: boolean = false;
  modelForm: FormGroup;
  
  pagination = {
    currentPage: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  };
  
  filters = {
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

  constructor(
    private modelService: ModelService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadModels();
  }

  initializeForm(): void {
    this.modelForm = this.fb.group({
      modelId: [''],
      modelName: ['', Validators.required],
      modelVersion: ['', Validators.required],
      modelSponsor: ['', Validators.required],
      modelValidatorName: ['', Validators.required],
      businessLine: ['', Validators.required],
      modelType: ['', Validators.required],
      riskRating: ['', Validators.required],
      status: [''],
      updatedBy: ['Current User']
    });
  }

  loadModels(page: number = 0): void {
    const sortDirection = this.reverse ? 'desc' : 'asc';
    this.modelService.getAllModels(page, this.pagination.pageSize, this.sortField, sortDirection)
      .subscribe(
        (response: PageResponse<ModelDTO>) => {
          this.models = response.content;
          this.updatePagination(response);
        },
        (error: any) => {
          console.error('Error loading models:', error);
          alert('Failed to load models');
        }
      );
  }

  applyFilters(page: number = 0): void {
    const sortDirection = this.reverse ? 'desc' : 'asc';
    this.modelService.getFilteredModels(this.filters, page, this.pagination.pageSize, this.sortField, sortDirection)
      .subscribe(
        (response: PageResponse<ModelDTO>) => {
          this.models = response.content;
          this.updatePagination(response);
        },
        (error: any) => {
          console.error('Error filtering models:', error);
          alert('Failed to filter models');
        }
      );
  }

  updatePagination(response: PageResponse<ModelDTO>): void {
    this.pagination.currentPage = response.number;
    this.pagination.totalElements = response.totalElements;
    this.pagination.totalPages = response.totalPages;
    this.pagination.first = response.first;
    this.pagination.last = response.last;
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.reverse = !this.reverse;
    } else {
      this.sortField = field;
      this.reverse = false;
    }
    
    const hasFilters = Object.values(this.filters).some(filter => filter);
    if (hasFilters) {
      this.applyFilters(this.pagination.currentPage);
    } else {
      this.loadModels(this.pagination.currentPage);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.pagination.totalPages) {
      const hasFilters = Object.values(this.filters).some(filter => filter);
      if (hasFilters) {
        this.applyFilters(page);
      } else {
        this.loadModels(page);
      }
    }
  }

  changePageSize(): void {
    this.pagination.currentPage = 0;
    const hasFilters = Object.values(this.filters).some(filter => filter);
    if (hasFilters) {
      this.applyFilters(0);
    } else {
      this.loadModels(0);
    }
  }

  getEndIndex(): number {
    return Math.min((this.pagination.currentPage + 1) * this.pagination.pageSize, this.pagination.totalElements);
  }

  showCreateForm(): void {
    this.initializeForm();
    this.modelForm.patchValue({
      updatedBy: 'Current User',
      modelValidatorName: ''
    });
    this.isEditing = false;
    this.currentView = 'form';
  }

  editModel(model: ModelDTO): void {
    this.initializeForm();
    this.modelForm.patchValue(model);
    this.isEditing = true;
    this.currentView = 'form';
  }

  saveModel(): void {
    if (this.modelForm.valid) {
      const formValue = this.modelForm.value;
      
      if (this.isEditing) {
        this.modelService.updateModel(formValue.modelId, formValue)
          .subscribe(
            (response: ModelDTO) => {
              alert('Model updated successfully!');
              this.currentView = 'grid';
              this.loadModels(this.pagination.currentPage);
            },
            (error: any) => {
              console.error('Error updating model:', error);
              alert('Failed to update model');
            }
          );
      } else {
        formValue.status = 'In Development';
        this.modelService.createModel(formValue)
          .subscribe(
            (response: ModelDTO) => {
              alert('Model created successfully!');
              this.currentView = 'grid';
              this.loadModels(0);
            },
            (error: any) => {
              console.error('Error creating model:', error);
              alert('Failed to create model');
            }
          );
      }
    }
  }

  saveDraft(): void {
    const formValue = this.modelForm.value;
    this.modelService.createDraftModel(formValue)
      .subscribe(
        (response: ModelDTO) => {
          alert('Model saved as draft successfully!');
          this.currentView = 'grid';
          this.loadModels(0);
        },
        (error: any) => {
          console.error('Error saving draft:', error);
          alert('Failed to save draft');
        }
      );
  }

  deleteModel(modelId: number): void {
    if (confirm('Are you sure you want to delete this model?')) {
      this.modelService.deleteModel(modelId)
        .subscribe(
          (response: any) => {
            alert('Model deleted successfully!');
            this.loadModels(this.pagination.currentPage);
          },
          (error: any) => {
            console.error('Error deleting model:', error);
            alert('Failed to delete model');
          }
        );
    }
  }

  cancelForm(): void {
    this.currentView = 'grid';
    this.initializeForm();
  }
}
