import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  requireddocument = new Subject<any>();
  ISODocument = new Subject<any>();
  constructor() { 
    this.requireddocument.asObservable();
    this.ISODocument.asObservable();
  }
  
  emitRequiredDocument(status: string) {
    this.requireddocument.next(status);
  }
  
  DocumentData() {
    return this.requireddocument.asObservable();
  }

  emitISODocument(status: string) {
    this.ISODocument.next(status);
  }

  ISODocumentData() {
    return this.ISODocument.asObservable();
  }
}
