import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from '@environment/environment';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';


const routes = {
  techRecords: (searchIdentifier: string) => `${environment.APIServerUri}/vehicles/${searchIdentifier}/tech-records`
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class TechnicalRecordService {
  private jwttoken:string;
  private readonly tokenSubscription: any;

  constructor(private httpClient: HttpClient,private adalSvc: MsAdalAngular6Service) { 
    console.log(this.adalSvc.userInfo);
    this.tokenSubscription = this.adalSvc.acquireToken('https://graph.microsoft.com').subscribe((token: string) => {
      console.log(token);
      this.jwttoken = token;
    });    

  }

  getTechnicalRecords(searchIdentifier: string): Observable<any[]> {
    return this.httpClient.get<any[]>(routes.techRecords(searchIdentifier),{
      headers: new HttpHeaders({
        'Content-Type' : 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.jwttoken}`,
      })}).pipe(
      tap(_ => console.log('fetched techRecords', _)),
      catchError(this.handleError('getTechnicalRecords', []))
    );
  }

  private log(message: string) {
    console.log(`TechnicalRecordService: ${message}`);
  }
  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
