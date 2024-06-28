import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  requireddocument = new Subject<any>();
  ISODocument = new Subject<any>();
  gstinValue= new Subject<any>();
  isManufacturer=new Subject<any>();


  constructor() { 
    this.requireddocument.asObservable();
    this.ISODocument.asObservable();
    this.gstinValue.asObservable();
    this.isManufacturer.asObservable();
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

  emitGSTIN(status: string) {
    this.gstinValue.next(status);
  }

  GSTINData() {
    return this.gstinValue.asObservable();
  }

  emitIsManufacturer(status: boolean) {
    this.isManufacturer.next(status);
  }

  IsManufacturerValue() {
    return this.isManufacturer.asObservable();
  }

}
