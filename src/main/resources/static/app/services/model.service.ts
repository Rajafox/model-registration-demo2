
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export interface ModelDTO {
  modelId?: number;
  modelName: string;
  modelVersion: string;
  modelSponsor: string;
  modelValidatorName: string;
  businessLine: string;
  modelType: string;
  riskRating: string;
  status?: string;
  updatedBy: string;
  updatedOn?: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Injectable()
export class ModelService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getAllModels(page: number = 0, size: number = 5, sort: string = 'modelId', direction: string = 'asc'): Observable<PageResponse<ModelDTO>> {
    const url = `/api/models?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
    return this.http.get(url)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getFilteredModels(filters: any, page: number = 0, size: number = 5, sort: string = 'modelId', direction: string = 'asc'): Observable<PageResponse<ModelDTO>> {
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
    
    return this.http.get(`/api/models/filter?${params.toString()}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  createModel(model: ModelDTO): Observable<ModelDTO> {
    return this.http.post('/api/models', JSON.stringify(model), this.options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  createDraftModel(model: ModelDTO): Observable<ModelDTO> {
    return this.http.post('/api/models/draft', JSON.stringify(model), this.options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  updateModel(id: number, model: ModelDTO): Observable<ModelDTO> {
    return this.http.put(`/api/models/${id}`, JSON.stringify(model), this.options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  deleteModel(id: number): Observable<any> {
    return this.http.delete(`/api/models/${id}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return Observable.throw(error.message || error);
  }
}
