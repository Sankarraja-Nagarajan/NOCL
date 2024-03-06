import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'ngx-attachment-dialog',
  templateUrl: './attachment-dialog.component.html',
  styleUrls: ['./attachment-dialog.component.scss']
})
export class AttachmentDialogComponent implements OnInit {

  Type = new FormControl('', Validators.required)
  Is_Expiry_Available = new FormControl(true)
  Expiry_Date = new FormControl('')
  document = new FormControl('', Validators.required)

  fileName = [];
  options: string[] = ['Aadhar', 'PAN', 'License'];
  filteredOptions: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<AttachmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.changeValidators()
  }

  ngOnInit(): void {
    this.filteredOptions = this.Type.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeValidators() {
    if (this.Is_Expiry_Available.value == true) {
      console.log(this.Is_Expiry_Available.value)
      this.Expiry_Date.setValidators([Validators.required])
    }
    else {
      console.log(this.Is_Expiry_Available.value)
      this.Expiry_Date.clearValidators;
      this.Expiry_Date.setValue('');
    }
  }

  onFileChange(event) {
    this.fileName = [];
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      this.fileName.push(files[i].name);
    }
    console.log(files)
    console.log(this.fileName)
  }

  submit() {
    if (this.Type.valid && this.Expiry_Date.valid && this.document.valid) {
      this.dialogRef.close({ Type: this.Type.value, Is_Expiry_Available: this.Is_Expiry_Available.value, Expiry_Date: this.Expiry_Date.value, Document: this.fileName });
      this.Type.reset()
      this.Is_Expiry_Available.reset()
      this.Expiry_Date.reset()
    }
    else if (this.Type.valid && this.Is_Expiry_Available.value == false && this.document.valid) {
      this.dialogRef.close({ Type: this.Type.value, Is_Expiry_Available: this.Is_Expiry_Available.value, Expiry_Date: this.Expiry_Date.value, Document: this.fileName });
      this.Type.reset()
      this.Is_Expiry_Available.reset()
      this.Expiry_Date.reset()
    }
    else {
      this.document.markAllAsTouched();
      this.Type.markAsTouched();
      this.Expiry_Date.markAsTouched();
    }
  }
}