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
import { AppConfigService } from "../../../Services/app-config.service";
import { EmitterService } from "../../../Services/emitter.service";
import { MatAccordion } from "@angular/material/expansion";

@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})
export class AttachmentsComponent  {
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
  loader: boolean;
  requiredAttachments: Attachment[] = [];
  otherAttachments: Attachment[] = [];
  reqDatasource = new MatTableDataSource(this.requiredAttachments);
  additionalDatasource = new MatTableDataSource(this.otherAttachments);
  reqDoctypes: string[] = [];
  reqDocIndex: number = -1;
  otherDocIndex: number = -1;

  constructor(
    public _dialog: MatDialog,
    private _common: CommonService,
    private _registration: RegistrationService,
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService,
    private _config: AppConfigService,private emitterService: EmitterService
  ) { }
  // ngAfterViewInit(): void {
  //   this.reqDoctypes = this.document;
  //   this.GetAttachment();
  // }
  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem("userDetails"));
    this.role = userData ? userData.Role : "";
    if (this.v_Id == 4) {
      this.reqDoctypes = this._config
        .get("Import_Required_Attachments")
        .split(",");
    } else {
      this.reqDoctypes = this._config.get("Required_Attachments").split(",");
    }
    this.GetAttachment();
    this.emitterService.DocumentData().subscribe((data) => {
      this.reqDoctypes = data ;
      this.GetAttachment();
    });
    // this.emitterService.ISODocumentData().subscribe((data) => {
    //   this.reqDoctypes = data ;
    //   this.GetAttachment();
    // });
    // Get attachments by form Id

  }
  GetAttachment() {
    this._registration.getFormData(this.form_Id, "Attachments").subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          let resFileTypes = [];
          this.reqDatasource.data = [];
          this.attachments = res as Attachment[];
          this.attachments.forEach((element) => {
            resFileTypes.push(element.File_Type);
            if (this.reqDoctypes.includes(element.File_Type)) {
             
              this.reqDatasource.data.push(element);
            } else {
              this.additionalDatasource.data.push(element);
            }
          });

          this.reqDoctypes.forEach((element) => {
            if (!resFileTypes.includes(element)) {
              let attachment = new Attachment();
              attachment.Form_Id = this.form_Id;
              attachment.File_Type = element;
              this.reqDatasource.data.push(attachment);
            }
          });

          this.reqDatasource._updateChangeSubscription();
          this.additionalDatasource._updateChangeSubscription();
        } 
        else {
          this.reqDatasource = new MatTableDataSource();
          this.reqDoctypes.forEach((element) => {
            
            let attachment = new Attachment();
            attachment.Form_Id = this.form_Id;
            attachment.File_Type = element;
            this.reqDatasource.data.push(attachment);
          });
          this.reqDatasource._updateChangeSubscription();
        }
        // else if(this.reqDoctypes.length <= 5){

        // }
      },
      error: (err) => { },
    });
  }
  removeAttachment(attachmentId: number, i: number) {
    this.loader = true;
    this._docService.DeleteAttachment(attachmentId).subscribe({
      next: (res) => {
        this.additionalDatasource.data.splice(i, 1);
        this.additionalDatasource._updateChangeSubscription();
        this.loader = false;
        this._common.openSnackbar(res.Message, snackbarStatus.Success);
      },
      error: (err) => {
        this.loader = false;
      },
    });
  }

  isValid() {
    let valid = true;
    this.reqDatasource.data.forEach((element) => {
      if (element.Attachment_Id == 0) {
        valid = false;
      }
    });
    if (!valid) {
      this._common.openSnackbar(
        "Attach necessary files",
        snackbarStatus.Danger
      );
    }
    return valid;
  }

  openViewDocDialog(attachment: Attachment) {
    const dialogconfig: MatDialogConfig = {
      data: {
        attachment: attachment,
      },
      height: "calc(100vh - 100px)",
      minWidth: "600px",
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

  uploadAttachment(fileType: string, type: string, i: number = -1) {
    if (type == "req") {
      this.reqDocIndex = i;
    }

    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: true,
        reUpload: false,
        formId: this.form_Id,
        file_Type: fileType,
      },
    });
    DIALOGREF.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          if (this.reqDocIndex >= 0) {
            console.log(this.reqDatasource.data[this.reqDocIndex]);
            this.reqDatasource.data[this.reqDocIndex] = response as Attachment;
            this.reqDatasource._updateChangeSubscription();
          }
          if (i == -1) {
            this.additionalDatasource.data.push(response as Attachment);
            this.additionalDatasource._updateChangeSubscription();
          }
        }
        this.resetIndexes();
      },
    });
  }

  reUploadAttachment(element: Attachment, type: string, i: number) {
    console.log(element);
    if (type == "req") {
      this.reqDocIndex = i;
    }
    if (type == "not-req") {
      this.otherDocIndex = i;
    }

    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: false,
        reUpload: true,
        formId: this.form_Id,
        attachment: element,
      },
    });
    DIALOGREF.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          if (this.reqDocIndex >= 0) {
            this.reqDatasource.data[this.reqDocIndex] = response as Attachment;
            this.reqDatasource._updateChangeSubscription();
          }
          if (this.otherDocIndex >= 0) {
            this.additionalDatasource.data[this.otherDocIndex] =
              response as Attachment;
            this.additionalDatasource._updateChangeSubscription();
          }
        }
        this.resetIndexes();
      },
    });
  }

  getToolTip(fileName: string): string {
    return fileName ? "Re-upload" : "Upload";
  }

  resetIndexes() {
    this.reqDocIndex = -1;
    this.otherDocIndex = -1;
  }
}
