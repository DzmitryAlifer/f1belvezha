import { Component } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'F1 Belvezha';
  underConstruction = 'under construction...';

  // usersResponse = this.http.get('http://localhost:3000/users', {headers: {'Access-Control-Allow-Origin': '*'}});
  usersResponse1 = this.http.get('https://safe-crag-81937.herokuapp.com/users1');
  usersResponse2 = this.http.get('https://safe-crag-81937.herokuapp.com/users2');
  
  constructor(private http: HttpClient) {}

  getAllUsers1() {
    this.usersResponse1.subscribe(response => {console.log(response);});
  }

  getAllUsers2() {
    this.usersResponse2.subscribe(response => {console.log(response);});
  }
}
