import { Component, OnInit } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
interface ItemsResponse {
  results: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent   implements OnInit {
  title = 'app';
  loadingComplete = false;
  constructor(private router: Router, private http: HttpClient) {
  }
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
      .subscribe((result) => this.loadingComplete = true);
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((result) => this.loadingComplete = false);

      this.testApi()
      .then(date => {})
      .catch(err => {});

      this.http.get<ItemsResponse>('/api/items')
      .subscribe(
        // Successful responses call the first callback.
        data => {},
        // Errors will call this callback instead:
        err => {
          console.log('Something went wrong!');
        }
      );
  }

  async testApi() {
    try {
      const data = await this.http.get<ItemsResponse>('/api/items').toPromise();
    }catch (ex) {
      return Promise.reject(ex);
    }
  }
}
