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

  // usersResponse = this.http.get('http://localhost:3000/users', {headers: {'Access-Control-Allow-Origin': '*'}});
  readonly users: Observable<any> = this.http.get('https://safe-crag-81937.herokuapp.com/users');
  // usersResponse2 = this.http.get('https://safe-crag-81937.herokuapp.com/users2');
  
  constructor(private http: HttpClient) {}

  getAllUsers() {
    this.users.subscribe(response => {console.log(response);});
  }

  getAllUsers2() {
    // this.usersResponse2.subscribe(response => {console.log(response);});
  }
}
