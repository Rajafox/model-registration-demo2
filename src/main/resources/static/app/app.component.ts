import { Component } from '@angular/core';
import { ModelService } from './services/model.service';

@Component({
  selector: 'model-registry-app',
  template: `
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <i class="fas fa-database me-2"></i>Model Registry
          </a>
        </div>
      </nav>

      <div class="container mt-4">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">Model Registry Dashboard</h5>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <button class="btn btn-primary" (click)="loadModels()">
                      <i class="fas fa-sync-alt me-2"></i>Load Models
                    </button>
                    <button class="btn btn-success ms-2" (click)="showAddForm = !showAddForm">
                      <i class="fas fa-plus me-2"></i>Add Model
                    </button>
                  </div>
                </div>

                <div *ngIf="showAddForm" class="card mb-4">
                  <div class="card-header">
                    <h6>Add New Model</h6>
                  </div>
                  <div class="card-body">
                    <form (ngSubmit)="addModel()" #modelForm="ngForm">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Model Name</label>
                            <input type="text" class="form-control" [(ngModel)]="newModel.modelName" name="modelName" required>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Model Version</label>
                            <input type="text" class="form-control" [(ngModel)]="newModel.modelVersion" name="modelVersion" required>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Model Sponsor</label>
                            <input type="text" class="form-control" [(ngModel)]="newModel.modelSponsor" name="modelSponsor" required>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Business Line</label>
                            <select class="form-control" [(ngModel)]="newModel.businessLine" name="businessLine" required>
                              <option value="">Select Business Line</option>
                              <option value="Retail Banking">Retail Banking</option>
                              <option value="Investment Banking">Investment Banking</option>
                              <option value="Commercial Banking">Commercial Banking</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Model Type</label>
                            <select class="form-control" [(ngModel)]="newModel.modelType" name="modelType" required>
                              <option value="">Select Model Type</option>
                              <option value="Credit Risk">Credit Risk</option>
                              <option value="Market Risk">Market Risk</option>
                              <option value="Operational Risk">Operational Risk</option>
                            </select>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Risk Rating</label>
                            <select class="form-control" [(ngModel)]="newModel.riskRating" name="riskRating" required>
                              <option value="">Select Risk Rating</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Updated By</label>
                            <input type="text" class="form-control" [(ngModel)]="newModel.updatedBy" name="updatedBy" required>
                          </div>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary" [disabled]="!modelForm.form.valid">
                        <i class="fas fa-save me-2"></i>Save Model
                      </button>
                      <button type="button" class="btn btn-secondary ms-2" (click)="cancelAdd()">
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>

                <div *ngIf="loading" class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <div *ngIf="!loading && models.length > 0" class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Model Name</th>
                        <th>Version</th>
                        <th>Sponsor</th>
                        <th>Business Line</th>
                        <th>Type</th>
                        <th>Risk Rating</th>
                        <th>Status</th>
                        <th>Updated By</th>
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
                          <span class="badge" [ngClass]="{
                            'bg-success': model.riskRating === 'Low',
                            'bg-warning': model.riskRating === 'Medium',
                            'bg-danger': model.riskRating === 'High'
                          }">{{model.riskRating}}</span>
                        </td>
                        <td>
                          <span class="badge bg-info">{{model.status}}</span>
                        </td>
                        <td>{{model.updatedBy}}</td>
                        <td>
                          <button class="btn btn-sm btn-danger" (click)="deleteModel(model.modelId)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div *ngIf="!loading && models.length === 0" class="text-center">
                  <p class="text-muted">No models found. Click "Load Models" to fetch data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  models: any[] = [];
  loading = false;
  showAddForm = false;
  newModel: any = {};

  constructor(private modelService: ModelService) {}

  ngOnInit() {
    this.loadModels();
  }

  loadModels() {
    this.loading = true;
    this.modelService.getModels().subscribe(
      (data: any[]) => {
        this.models = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading models:', error);
        this.loading = false;
      }
    );
  }

  addModel() {
    this.modelService.addModel(this.newModel).subscribe(
      (response) => {
        console.log('Model added successfully');
        this.loadModels();
        this.cancelAdd();
      },
      (error) => {
        console.error('Error adding model:', error);
      }
    );
  }

  deleteModel(id: number) {
    if (confirm('Are you sure you want to delete this model?')) {
      this.modelService.deleteModel(id).subscribe(
        (response) => {
          console.log('Model deleted successfully');
          this.loadModels();
        },
        (error) => {
          console.error('Error deleting model:', error);
        }
      );
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newModel = {};
  }
}