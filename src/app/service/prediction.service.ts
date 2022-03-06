import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Params, Prediction} from '../types';
import {HttpService} from './http.service';


const PREDICTION_API = '/prediction';


@Injectable({providedIn: 'root'})
export class PredictionService {

  constructor(private readonly httpService: HttpService) {}

  getAllPredictions(): Observable<Prediction[]> {
    return this.httpService.getAll<Prediction[]>(PREDICTION_API);
  }

  getAllUserPredictions(userId: number): Observable<Prediction[]> {
    const queryParams: Params = {userId: String(userId)};
    return this.httpService.getByParams<Prediction[]>(PREDICTION_API, queryParams);
  }

  getPrediction(userId: number, round: number): Observable<Prediction> {
    const queryParams: Params = {userId: String(userId), round: String(round)};
    
    return this.httpService.getByParams<Prediction>(PREDICTION_API, queryParams).pipe(
      map(predictions => predictions));
  }

  makePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.post<Prediction>(PREDICTION_API, prediction);
  }

  updatePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.put<Prediction>(PREDICTION_API, prediction);
  }
}
