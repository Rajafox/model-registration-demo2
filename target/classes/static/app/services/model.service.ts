
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
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
  status: string;
  updatedBy: string;
  updatedOn?: Date;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface FilterParams {
  modelName?: string;
  modelVersion?: string;
  modelSponsor?: string;
  modelValidatorName?: string;
  businessLine?: string;
  modelType?: string;
  riskRating?: string;
  status?: string;
  updatedBy?: string;
}

@Injectable()
export class ModelService {
  private baseUrl = '/api/models';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {}

  getAllModels(page: number = 0, size: number = 5, sort: string = 'modelId', direction: string = 'asc'): Observable<PageResponse<ModelDTO>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&sort=${sort},${direction}`;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getFilteredModels(filters: FilterParams, page: number = 0, size: number = 5, sort: string = 'modelId', direction: string = 'asc'): Observable<PageResponse<ModelDTO>> {
    let url = `${this.baseUrl}/filter?page=${page}&size=${size}&sort=${sort},${direction}`;
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof FilterParams];
      if (value && value.trim() !== '') {
        url += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getModelById(id: number): Observable<ModelDTO> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  createModel(model: ModelDTO): Observable<ModelDTO> {
    return this.http.post(this.baseUrl, JSON.stringify(model), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  createDraftModel(model: ModelDTO): Observable<ModelDTO> {
    return this.http.post(`${this.baseUrl}/draft`, JSON.stringify(model), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  updateModel(id: number, model: ModelDTO): Observable<ModelDTO> {
    return this.http.put(`${this.baseUrl}/${id}`, JSON.stringify(model), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  deleteModel(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return Observable.throw(error.message || error);
  }
}
