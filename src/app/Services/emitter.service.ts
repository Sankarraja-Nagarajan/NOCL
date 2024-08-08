import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  requireddocument = new Subject<any>();
  ISODocument = new Subject<any>();
  gstinValue = new Subject<any>();
  isManufacturer = new Subject<any>();
  isMSME =new Subject<any>(); 
  gstVenClass = new Subject<any>();


  constructor() {
    this.requireddocument.asObservable();
    this.ISODocument.asObservable();
    this.gstinValue.asObservable();
    this.isManufacturer.asObservable();
    this.isMSME.asObservable();
    this.gstVenClass.asObservable();
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

  emitIsMSMEValue(status: boolean) {
    console.log(status);
    this.isMSME.next(status);
  }

  IsMSMEIndustry() {
    console.log(this.isMSME)
    return this.isMSME.asObservable();
  }

  emitGSTVenClass(status: boolean) {
    this.gstVenClass.next(status);
  }

  hideGSTIN() {
    return this.gstVenClass.asObservable();
  }

}
