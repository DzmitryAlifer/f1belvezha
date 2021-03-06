import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CURRENT_USER_KEY} from 'src/constants';
import {toPoints} from '../common';
import {Params, PlayerRoundResult, Prediction, User, UserPoints} from '../types';
import {EncryptionService} from './encryption.service';
import {HttpService} from './http.service';
import {LocalStorageService} from './local-storage.service';


const API_DOMAIN = 'https://safe-crag-81937.herokuapp.com';


@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly httpClient: HttpClient,
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  getCurrentUser(): Observable<User|null> {
    return of(this.localStorageService.getItem<User>(CURRENT_USER_KEY));
  }

  getAllUsers(): Observable<User[]> {
    return this.httpService.getAll<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.httpService.getById<User>('/users', id);
  }

  createUser(user: User): Observable<User> {
    const encryptedPassword = this.encryptionService.encrypt(user.password!);
    return this.httpService.post<User>('/users', {...user, password: encryptedPassword});
  }

  login(params: Params): Observable<User|null> {
    const encryptedPassword = this.encryptionService.encrypt(String(params['password']));
    return this.httpService.login<User>('/login', {...params, password: encryptedPassword});
  }
  
  updateUserPoints(playersResults: PlayerRoundResult[], allPredictions: Prediction[], lastRound: number, users: User[]): Observable<User[]> {
    const userPointsList: UserPoints[] = toPoints(playersResults, users);
    const updatedUsers: User[] = users.map(user => ({
      ...user,
      seasonpoints: findUserPoints(userPointsList, user),
      season_events_total: 
          allPredictions.filter(prediction => prediction.userid == user.id && prediction.round! <= lastRound).length,
    }));
    
    return this.httpService.put<User[]>('/users', updatedUsers);
  }

  updateUserAvatar(user: User): Observable<HttpEvent<User>> {
    const formData = new FormData();
    formData.append('file', user.avatar!, '' + user.id);
    const request = new HttpRequest('PUT', `${API_DOMAIN}/updateAvatar`, formData, {reportProgress: true, responseType: 'json'});
    return this.httpClient.request<User>(request);
  }
}

function findUserPoints(userPointsList: UserPoints[], user: User): number {
  return userPointsList.find(userPoints => userPoints.user.id == user.id)?.points ?? 0;
}
