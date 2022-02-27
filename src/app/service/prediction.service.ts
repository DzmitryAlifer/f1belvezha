import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Params, Prediction} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class PredictionService {

  constructor(private readonly httpService: HttpService) {}

  getPrediction(userId: number, round: number): Observable<Prediction> {
    const queryParams: Params = {userId: String(userId), round: String(round)};
    return this.httpService.getByParams<Prediction>('/predict', queryParams);
  }

  makePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.post<Prediction>('/predict', prediction);
  }

  updatePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.put<Prediction>('/predict', prediction);
  }
}
