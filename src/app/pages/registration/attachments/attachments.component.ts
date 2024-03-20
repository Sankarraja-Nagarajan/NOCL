import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AttachmentDialogComponent } from "../../../Dialogs/attachment-dialog/attachment-dialog.component";

export interface tableData {
  Type: string;
  Is_Expiry_Available: boolean;
  Expiry_Date: null;
  Document: string[];
}

@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})
export class AttachmentsComponent implements OnInit {
  attachmentsForm: FormGroup;
  role: string = "";

  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  displayedColumns: string[] = [
    "typeOfAttachments",
    "expiryAvailable",
    "expiryDate",
    "document",
    "action",
  ];

  data: tableData[] = [];

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
        if (response && response.Type != null && response.Document != null) {
          this.data.push(response);
          this.dataSource = new MatTableDataSource(this.data);
          console.log(this.dataSource.filteredData);
        }
      },
    });
  }
  removePartners(i: number) {
    this.data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.data);
  }
}
