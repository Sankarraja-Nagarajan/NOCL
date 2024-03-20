import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AttachmentDialogComponent } from '../../../Dialogs/attachment-dialog/attachment-dialog.component';
import { Attachment } from '../../../Models/Dtos';

@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})

export class AttachmentsComponent{
  @Input() form_Id: number;
  
  attachmentsForm: FormGroup;
  role: string = "";

  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  displayedColumns: string[] = [
    'typeOfAttachments',
    'expiryDate',
    'document',
    'action'
  ];

  data: Attachment[] = [];

  dataSource = new MatTableDataSource(this.data);

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(AttachmentDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          this.data.push(...response);
          this.dataSource._updateChangeSubscription();
        }
      },
    });
  }
  removePartners(i: number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
