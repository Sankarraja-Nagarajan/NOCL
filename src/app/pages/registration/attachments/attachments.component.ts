import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AttachmentDialogComponent } from "../../../Dialogs/attachment-dialog/attachment-dialog.component";
import { Attachment } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";

@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})
export class AttachmentsComponent {
  @Input() form_Id: number;

  attachmentsForm: FormGroup;
  role: string = "";

  displayedColumns: string[] = [
    "typeOfAttachments",
    "expiryDate",
    "document",
    "action",
  ];

  attachments: Attachment[] = [];

  dataSource = new MatTableDataSource(this.attachments);

  constructor(public dialog: MatDialog, private _common: CommonService) {}
  
  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(AttachmentDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      autoFocus: false,
      data: {
        form_Id: this.form_Id,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          this.attachments.push(response as Attachment);
          this.dataSource._updateChangeSubscription();
        }
      },
    });
  }
  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.attachments);
  }

  isValid() {
    if (this.attachments.length > 0) {
      return true;
    } else {
      this._common.openSnackbar(
        "Add required attachments.",
        snackbarStatus.Danger
      );
      return false;
    }
  }
}
