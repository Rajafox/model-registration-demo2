import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ModelService {
  private baseUrl = '/api/models';

  constructor(private http: Http) {}

  getModels(): Observable<any[]> {
    return this.http.get(this.baseUrl)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getModel(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  addModel(model: any): Observable<any> {
    return this.http.post(this.baseUrl, model)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  updateModel(id: number, model: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, model)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  deleteModel(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('API Error:', error);
    return Observable.throw(error.json().error || 'Server error');
  }
}