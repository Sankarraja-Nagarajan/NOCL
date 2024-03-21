import { Component, Inject, OnInit } from '@angular/core';
import { Attachment } from '../../Models/Dtos';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ngx-document-view-dialog',
  templateUrl: './document-view-dialog.component.html',
  styleUrls: ['./document-view-dialog.component.scss']
})
export class DocumentViewDialogComponent implements OnInit {

  constructor(public _dialogRef: MatDialogRef<DocumentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public attachment:Attachment){

  }
  ngOnInit(): void {
    console.log(this.attachment)
  }

}
