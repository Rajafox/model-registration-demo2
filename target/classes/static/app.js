
(function() {
    'use strict';

    // Wait for all Angular modules to be loaded
    function waitForAngular() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            function checkAngular() {
                attempts++;
                if (window.ng && window.ng.core && window.ng.common && window.ng.forms && window.ng.common.http) {
                    resolve();
                } else if (attempts < maxAttempts) {
                    setTimeout(checkAngular, 100);
                } else {
                    reject(new Error('Angular modules failed to load'));
                }
            }
            
            checkAngular();
        });
    }

    // Initialize the application
    waitForAngular().then(() => {
        const { Component, Injectable, Input, OnInit } = ng.core;
        const { CommonModule } = ng.common;
        const { ReactiveFormsModule, FormsModule, FormBuilder, Validators } = ng.forms;
        const { HttpClient } = ng.common.http;

        // Model Service
        @Injectable({
            providedIn: 'root'
        })
        class ModelService {
            constructor(http) {
                this.http = http;
            }

            getAllModels(page = 0, size = 5, sort = 'modelId', direction = 'asc') {
                const url = `/api/models?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
                return this.http.get(url);
            }

            getFilteredModels(filters, page = 0, size = 5, sort = 'modelId', direction = 'asc') {
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) {
                        params.append(key, filters[key]);
                    }
                });
                params.append('page', page.toString());
                params.append('size', size.toString());
                params.append('sort', sort);
                params.append('direction', direction);
                
                return this.http.get(`/api/models/filter?${params.toString()}`);
            }

            createModel(model) {
                return this.http.post('/api/models', model);
            }

            createDraftModel(model) {
                return this.http.post('/api/models/draft', model);
            }

            updateModel(id, model) {
                return this.http.put(`/api/models/${id}`, model);
            }

            deleteModel(id) {
                return this.http.delete(`/api/models/${id}`);
            }
        }

        // Main Component
        @Component({
            selector: 'model-registry-app',
            standalone: true,
            imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
                                        {{Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}} 
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
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelId' && !reverse,
                                                    'fa-sort-down': sortField === 'modelId' && reverse,
                                                    'fa-sort': sortField !== 'modelId'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('modelName')" class="sortable">
                                                Model Name 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelName' && !reverse,
                                                    'fa-sort-down': sortField === 'modelName' && reverse,
                                                    'fa-sort': sortField !== 'modelName'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('modelVersion')" class="sortable">
                                                Model Version 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelVersion' && !reverse,
                                                    'fa-sort-down': sortField === 'modelVersion' && reverse,
                                                    'fa-sort': sortField !== 'modelVersion'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('modelSponsor')" class="sortable">
                                                Model Sponsor 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelSponsor' && !reverse,
                                                    'fa-sort-down': sortField === 'modelSponsor' && reverse,
                                                    'fa-sort': sortField !== 'modelSponsor'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('modelValidatorName')" class="sortable">
                                                Model Validator Name 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelValidatorName' && !reverse,
                                                    'fa-sort-down': sortField === 'modelValidatorName' && reverse,
                                                    'fa-sort': sortField !== 'modelValidatorName'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('businessLine')" class="sortable">
                                                Business Line 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'businessLine' && !reverse,
                                                    'fa-sort-down': sortField === 'businessLine' && reverse,
                                                    'fa-sort': sortField !== 'businessLine'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('modelType')" class="sortable">
                                                Model Type 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'modelType' && !reverse,
                                                    'fa-sort-down': sortField === 'modelType' && reverse,
                                                    'fa-sort': sortField !== 'modelType'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('riskRating')" class="sortable">
                                                Risk Rating 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'riskRating' && !reverse,
                                                    'fa-sort-down': sortField === 'riskRating' && reverse,
                                                    'fa-sort': sortField !== 'riskRating'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('status')" class="sortable">
                                                Status 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'status' && !reverse,
                                                    'fa-sort-down': sortField === 'status' && reverse,
                                                    'fa-sort': sortField !== 'status'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('updatedBy')" class="sortable">
                                                Updated By 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'updatedBy' && !reverse,
                                                    'fa-sort-down': sortField === 'updatedBy' && reverse,
                                                    'fa-sort': sortField !== 'updatedBy'
                                                }"></i>
                                            </th>
                                            <th (click)="sortBy('updatedOn')" class="sortable">
                                                Updated On 
                                                <i class="fas" [ngClass]="{
                                                    'fa-sort-up': sortField === 'updatedOn' && !reverse,
                                                    'fa-sort-down': sortField === 'updatedOn' && reverse,
                                                    'fa-sort': sortField !== 'updatedOn'
                                                }"></i>
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
                                            <td>{{model.modelValidatorName}}</td>
                                            <td>{{model.businessLine}}</td>
                                            <td>{{model.modelType}}</td>
                                            <td>
                                                <span class="badge" [ngClass]="{
                                                    'bg-danger': model.riskRating === 'High',
                                                    'bg-warning': model.riskRating === 'Medium',
                                                    'bg-success': model.riskRating === 'Low'
                                                }">{{model.riskRating}}</span>
                                            </td>
                                            <td>
                                                <span class="badge" [ngClass]="{
                                                    'bg-secondary': model.status === 'Draft',
                                                    'bg-info': model.status === 'In Development',
                                                    'bg-warning': model.status === 'Validated',
                                                    'bg-success': model.status === 'Production',
                                                    'bg-dark': model.status === 'Retired'
                                                }">{{model.status}}</span>
                                            </td>
                                            <td>{{model.updatedBy}}</td>
                                            <td>{{model.updatedOn | date:'dd/MM/yyyy HH:mm'}}</td>
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
                                            <label class="form-label">Model ID</label>
                                            <input type="text" class="form-control" formControlName="modelId" 
                                                   [disabled]="isEditing" *ngIf="isEditing">
                                            <input type="text" class="form-control" value="Auto-generated" 
                                                   disabled *ngIf="!isEditing">
                                        </div>
                                    </div>
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
                                </div>
                                <div class="row">
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
                                </div>
                                <div class="row">
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
                                </div>
                                <div class="row">
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
                                </div>
                                <div class="row" *ngIf="isEditing">
                                    <div class="col-md-6">
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
            `
        })
        class ModelRegistryComponent {
            models = [];
            currentView = 'grid';
            isEditing = false;
            sortField = 'modelId';
            reverse = false;
            Math = Math;
            
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

            constructor(modelService, fb) {
                this.modelService = modelService;
                this.fb = fb;
                this.initializeForm();
            }

            ngOnInit() {
                this.loadModels();
            }

            initializeForm() {
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

            loadModels(page = 0) {
                const sortDirection = this.reverse ? 'desc' : 'asc';
                this.modelService.getAllModels(page, this.pagination.pageSize, this.sortField, sortDirection)
                    .subscribe({
                        next: (response) => {
                            this.models = response.content;
                            this.updatePagination(response);
                        },
                        error: (error) => {
                            console.error('Error loading models:', error);
                            alert('Failed to load models');
                        }
                    });
            }

            applyFilters(page = 0) {
                const sortDirection = this.reverse ? 'desc' : 'asc';
                this.modelService.getFilteredModels(this.filters, page, this.pagination.pageSize, this.sortField, sortDirection)
                    .subscribe({
                        next: (response) => {
                            this.models = response.content;
                            this.updatePagination(response);
                        },
                        error: (error) => {
                            console.error('Error filtering models:', error);
                            alert('Failed to filter models');
                        }
                    });
            }

            updatePagination(response) {
                this.pagination.currentPage = response.number;
                this.pagination.totalElements = response.totalElements;
                this.pagination.totalPages = response.totalPages;
                this.pagination.first = response.first;
                this.pagination.last = response.last;
            }

            sortBy(field) {
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

            goToPage(page) {
                if (page >= 0 && page < this.pagination.totalPages) {
                    const hasFilters = Object.values(this.filters).some(filter => filter);
                    if (hasFilters) {
                        this.applyFilters(page);
                    } else {
                        this.loadModels(page);
                    }
                }
            }

            changePageSize() {
                this.pagination.currentPage = 0;
                const hasFilters = Object.values(this.filters).some(filter => filter);
                if (hasFilters) {
                    this.applyFilters(0);
                } else {
                    this.loadModels(0);
                }
            }

            showCreateForm() {
                this.initializeForm();
                this.modelForm.patchValue({
                    updatedBy: 'Current User',
                    modelValidatorName: ''
                });
                this.isEditing = false;
                this.currentView = 'form';
            }

            editModel(model) {
                this.initializeForm();
                this.modelForm.patchValue(model);
                this.isEditing = true;
                this.currentView = 'form';
            }

            saveModel() {
                if (this.modelForm.valid) {
                    const formValue = this.modelForm.value;
                    
                    if (this.isEditing) {
                        this.modelService.updateModel(formValue.modelId, formValue)
                            .subscribe({
                                next: (response) => {
                                    alert('Model updated successfully!');
                                    this.currentView = 'grid';
                                    this.loadModels(this.pagination.currentPage);
                                },
                                error: (error) => {
                                    console.error('Error updating model:', error);
                                    alert('Failed to update model');
                                }
                            });
                    } else {
                        formValue.status = 'In Development';
                        this.modelService.createModel(formValue)
                            .subscribe({
                                next: (response) => {
                                    alert('Model created successfully!');
                                    this.currentView = 'grid';
                                    this.loadModels(0);
                                },
                                error: (error) => {
                                    console.error('Error creating model:', error);
                                    alert('Failed to create model');
                                }
                            });
                    }
                }
            }

            saveDraft() {
                const formValue = this.modelForm.value;
                this.modelService.createDraftModel(formValue)
                    .subscribe({
                        next: (response) => {
                            alert('Model saved as draft successfully!');
                            this.currentView = 'grid';
                            this.loadModels(0);
                        },
                        error: (error) => {
                            console.error('Error saving draft:', error);
                            alert('Failed to save draft');
                        }
                    });
            }

            deleteModel(modelId) {
                if (confirm('Are you sure you want to delete this model?')) {
                    this.modelService.deleteModel(modelId)
                        .subscribe({
                            next: (response) => {
                                alert('Model deleted successfully!');
                                this.loadModels(this.pagination.currentPage);
                            },
                            error: (error) => {
                                console.error('Error deleting model:', error);
                                alert('Failed to delete model');
                            }
                        });
                }
            }

            cancelForm() {
                this.currentView = 'grid';
                this.initializeForm();
            }
        }

        // Bootstrap the application
        ng.platformBrowserDynamic.platformBrowserDynamic()
            .bootstrapModule(ng.core.createNgModule({
                providers: [
                    ng.common.http.provideHttpClient()
                ]
            }))
            .then(() => {
                ng.platformBrowser.bootstrapApplication(ModelRegistryComponent, {
                    providers: [
                        ng.common.http.provideHttpClient(),
                        ModelService
                    ]
                });
            })
            .catch(err => console.error('Error starting application:', err));

    }).catch(error => {
        console.error('Failed to load Angular:', error);
        document.getElementById('app').innerHTML = '<div class="alert alert-danger">Failed to load Angular. Please refresh the page.</div>';
    });

})();
