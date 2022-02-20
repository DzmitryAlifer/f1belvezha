import { Component } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { Observable, startWith } from 'rxjs';

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'F1 Belvezha';
  underConstruction = 'under construction...';

  readonly users: Observable<User[]> = 
      this.http.get<User[]>('https://safe-crag-81937.herokuapp.com/users');
  readonly userById: Observable<User> = 
      this.http.get<User>('https://safe-crag-81937.herokuapp.com/users/1');
  
  constructor(private http: HttpClient) {}
}
