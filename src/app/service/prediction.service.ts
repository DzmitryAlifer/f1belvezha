import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Params, Prediction} from '../types';
import {HttpService} from './http.service';


const PREDICTION_API = '/prediction';


@Injectable({providedIn: 'root'})
export class PredictionService {

  constructor(private readonly httpService: HttpService) {}

  getPrediction(userId: number, round: number): Observable<Prediction> {
    const queryParams: Params = {userId: String(userId), round: String(round)};
    return this.httpService.getByParams<Prediction>(PREDICTION_API, queryParams);
  }

  makePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.post<Prediction>(PREDICTION_API, prediction);
  }

  updatePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.put<Prediction>(PREDICTION_API, prediction);
  }
}
