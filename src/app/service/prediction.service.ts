import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {findNextEvent2, NOT_SELECTED_DRIVER_NAME} from 'src/app/common';
import {Params, Prediction} from '../types';
import {HttpService} from './http.service';


const PREDICTION_API = '/prediction';


@Injectable({providedIn: 'root'})
export class PredictionService {

  constructor(private readonly httpService: HttpService) {}

  getAllPredictions(): Observable<Prediction[]> {
    return this.httpService.getAll<Prediction[]>(PREDICTION_API).pipe(
      map(predictions => predictions.map(prediction => ({
        ...prediction,
        qualification: prediction.qualification.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
        race: prediction.race.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
      }))));
  }

  getAllUserPredictions(userId: number): Observable<Prediction[]> {
    const queryParams: Params = {userId: String(userId)};
    return this.httpService.getByParams<Prediction[]>(PREDICTION_API, queryParams).pipe(
      map(predictions => predictions.map(prediction => ({
        ...prediction,
        qualification: prediction.qualification.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
        race: prediction.race.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
      }))));
  }

  getPrediction(userId: number, round: number): Observable<Prediction> {
    const queryParams: Params = {userId: String(userId), round: String(round)};
    
    return this.httpService.getByParams<Prediction>(PREDICTION_API, queryParams).pipe(
      map(prediction => ({
        ...prediction,
        qualification: prediction.qualification.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
        race: prediction.race.filter(driverName => !!driverName && driverName !== NOT_SELECTED_DRIVER_NAME),
      })));
  }

  makePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.post<Prediction>(PREDICTION_API, prediction);
  }

  updatePrediction(prediction: Prediction): Observable<Prediction> {
    return this.httpService.put<Prediction>(PREDICTION_API, prediction);
  }
}
