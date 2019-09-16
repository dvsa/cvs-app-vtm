import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from '@environment/environment';


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

  constructor(private httpClient: HttpClient) { }

  getTechnicalRecords(searchIdentifier: string): Observable<any[]> {
    return this.httpClient.get<any[]>(routes.techRecords(searchIdentifier)).pipe(
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
