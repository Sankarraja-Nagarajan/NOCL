import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { AttachmentDialogComponent } from "../../../Dialogs/attachment-dialog/attachment-dialog.component";
import { Attachment } from "../../../Models/Dtos";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { RegistrationService } from "../../../Services/registration.service";
import { DocumentViewDialogComponent } from "../../../Dialogs/document-view-dialog/document-view-dialog.component";
import { AttachmentService } from "../../../Services/attachment.service";
import { FileSaverService } from "../../../Services/file-saver.service";

@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})
export class AttachmentsComponent {
  @Input() form_Id: number;
  @Input() v_Id: number;

  role: string = "";

  displayedColumns: string[] = [
    "typeOfAttachments",
    "expiryDate",
    "document",
    "action",
  ];

  attachments: Attachment[] = [];

  dataSource = new MatTableDataSource(this.attachments);
  loader: boolean;

  constructor(
    public _dialog: MatDialog,
    private _common: CommonService,
    private _registration: RegistrationService,
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService
  ) {}

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";

    // Get attachments by form Id
    this._registration.getFormData(this.form_Id, "Attachments").subscribe({
      next: (res) => {
        if (res) {
          this.attachments = res as Attachment[];
          this.dataSource = new MatTableDataSource(this.attachments);
        }
      },
      error: (err) => {
        this._common.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this._dialog.open(AttachmentDialogComponent, {
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
          this.dataSource.data.push(response as Attachment);
          this.dataSource._updateChangeSubscription();
        }
      },
    });
  }

  removeAttachment(i: number) {
    this.loader = true;
    this._docService
      .DeleteAttachment(this.dataSource.data[i].Attachment_Id)
      .subscribe({
        next: (res) => {
          this.dataSource.data.splice(i, 1);
          this.dataSource._updateChangeSubscription();
          this.loader = false;
          this._common.openSnackbar(res.Message, snackbarStatus.Success);
        },
        error: (err) => {
          this.loader = false;
          this._common.openSnackbar(err, snackbarStatus.Danger);
        },
      });
  }

  isValid() {
    if (this.dataSource.data.length > 0) {
      return true;
    } else {
      console.log("attachments");
      this._common.openSnackbar(
        "Attach necessary files",
        snackbarStatus.Danger
      );
      return false;
    }
  }

  openViewDocDialog(attachment: Attachment) {
    const dialogconfig: MatDialogConfig = {
      data: {
        attachment: attachment,
      },
      panelClass: "dialog-box-document",
      autoFocus: false,
    };

    if (
      this.isImage(attachment.File_Name) ||
      this.isPdf(attachment.File_Name)
    ) {
      const dialogRef = this._dialog.open(
        DocumentViewDialogComponent,
        dialogconfig
      );
    } else {
      this.loader = true;
      this._docService.getFileById(attachment.Attachment_Id).subscribe({
        next: async (res) => {
          this.loader = false;
          await this._fileSaver.downloadFile(res);
        },
        error: (err) => {
          this.loader = false;
        },
      });
    }
  }

  isImage(fileName) {
    let arr = fileName.split(".");
    let ext = arr[arr.length - 1].toLowerCase();
    return (
      ext == "png" ||
      ext == "jpg" ||
      ext == "jpeg" ||
      ext == "tiff" ||
      ext == "svg"
    );
  }

  isPdf(fileName) {
    let arr = fileName.split(".");
    let ext = arr[arr.length - 1].toLowerCase();
    return ext == "pdf";
  }

  isISOAttached() {
    let isoDoc = this.dataSource.data.find((x) =>
      x.File_Type?.toLowerCase().includes("iso")
    );
    if (isoDoc) return true;
    else {
      this._common.openSnackbar(
        "Attach ISO Certificate",
        snackbarStatus.Danger
      );
      return false;
    }
  }

  isImportVendorDocsAttached() {
    if (this.v_Id == 4) {
      let message = "Please attach the following.";
      let cnt = 0;
      let requiredDocs = [
        "ISO",
        "Certificate of analysis",
        "Material safety data sheet",
        "No permanent establishment certificate",
      ];
      requiredDocs.forEach((element) => {
        let isoDoc = this.dataSource.data.find((x) =>
          x.File_Type?.toLowerCase().includes(element.toLowerCase())
        );
        if (!isoDoc) {
          cnt++;
          message += `\n\t${cnt}. ${element}`;
        }
      });
      if (cnt == 0) {
        return true;
      } else {
        this._common.openSnackbar(message, snackbarStatus.Danger, 4000);
      }
    } else {
      return true;
    }
  }
}
