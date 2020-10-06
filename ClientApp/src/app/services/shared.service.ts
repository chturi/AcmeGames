import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private subject = new Subject<any>();
 
  sendVerifyEvent() {
    this.subject.next();
  }

  getVerifyEvent(): Observable<any>{ 
    return this.subject.asObservable();
  }


}
