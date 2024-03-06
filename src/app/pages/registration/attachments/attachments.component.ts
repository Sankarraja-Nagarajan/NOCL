import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AttachmentDialogComponent } from '../../../Dialogs/attachment-dialog/attachment-dialog.component';

export interface tableData {
  Type: string,
  Is_Expiry_Available: boolean,
  Expiry_Date: null,
  Document: string[]
}

@Component({
  selector: 'ngx-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})

export class AttachmentsComponent{

  attachmentsForm: FormGroup;

  constructor(public dialog: MatDialog) { }

  displayedColumns: string[] = [
    'typeOfAttachments',
    'expiryAvailable',
    'expiryDate',
    'document',
    'action'
  ];

  data: tableData[] =
    [
      {
        Type: 'PAN',
        Is_Expiry_Available: false,
        Expiry_Date: null,
        Document: ['exalca.png']
      }
    ]

  dataSource = new MatTableDataSource(this.data);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(AttachmentDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe({
      next: (response) => {
        if (response && response.Type != null && response.Document != null) {
          this.data.push(response);
          this.dataSource = new MatTableDataSource(this.data);
          console.log(this.dataSource.filteredData)
        }
      },
    })
  }
  removePartners(i:number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}