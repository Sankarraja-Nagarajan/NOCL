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
  requiredAttachments=new Subject<boolean>();


  constructor() {
    this.requireddocument.asObservable();
    this.ISODocument.asObservable();
    this.gstinValue.asObservable();
    this.isManufacturer.asObservable();
    this.isMSME.asObservable();
    this.gstVenClass.asObservable();
    this.requiredAttachments.asObservable();
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

  emitIsMSMEValue(status: any) {
    this.isMSME.next(status);
  }

  IsMSMEIndustry() {
    return this.isMSME.asObservable();
  }

  emitGSTVenClass(status: boolean) {
    this.gstVenClass.next(status);
  }

  hideGSTIN() {
    return this.gstVenClass.asObservable();
  }

  emitRequiredAttachments(status: boolean) {
    this.requiredAttachments.next(status);
  }

  requiredAttachmentData() {
    return this.requiredAttachments.asObservable();
  }

}
