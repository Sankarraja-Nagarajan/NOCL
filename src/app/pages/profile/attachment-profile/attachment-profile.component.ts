import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";
import { DatePipe } from "@angular/common";
import { Attachment } from "../../../Models/Dtos";
import { DocumentViewDialogComponent } from "../../../Dialogs/document-view-dialog/document-view-dialog.component";
import { AttachmentService } from "../../../Services/attachment.service";
import { FileSaverService } from "../../../Services/file-saver.service";
import { AttachmentDialogComponent } from "../../../Dialogs/attachment-dialog/attachment-dialog.component";

@Component({
  selector: "ngx-attachment-profile",
  templateUrl: "./attachment-profile.component.html",
  styleUrls: ["./attachment-profile.component.scss"],
})
export class AttachmentProfileComponent implements OnInit {
  @Output() hasAttachment: EventEmitter<any> = new EventEmitter();

  attachmentsDetails = new MatTableDataSource();
  vendorInfo: any;
  formId: any;
  role: string;
  reqDocIndex: number = -1;
  displayedColumns = [
    'Index', 
    'File Name',
    'File Type',
    'Expiry Date',
    'Action'
  ]

  constructor(
    private _commonService: CommonService,
    private _registration: RegistrationService,
    private _dialog: MatDialog,
    private datePipe: DatePipe,
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService
  ) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;

    this.role = JSON.parse(sessionStorage.getItem("userDetails")).Role;

    this.getAttachments();
  }

  getAttachments() {
    this._registration.getFormData(this.formId, "Attachments").subscribe({
      next: (res) => {
        this.attachmentsDetails = new MatTableDataSource(res);
        this.hasAttachment.emit(this.attachmentsDetails.data.length != 0);
      },
      error: ()=>{
        this.hasAttachment.emit(false)
      }
    });
  }

  openAttachmentDialog(attachment: Attachment){
    console.log(attachment);
    const dialogConfig: MatDialogConfig = {
      data: {
        attachment: attachment
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
        dialogConfig
      );
    } else {
      
      this._docService.getFileById(attachment.Attachment_Id).subscribe({
        next: async (res) => {
          
          await this._fileSaver.downloadFile(res);
        },
        error: (err) => {
          
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

  reUploadAttachment(element: Attachment, type: string, i) {
    this.getDocIndex(type, i);

    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: false,
        reUpload: true,
        formId: this.formId,
        attachment: element,
      },
    });

    // const DIALOGREF = this._common.reuploadAttachment(this.form_Id, element);

    DIALOGREF.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          if (this.reqDocIndex >= 0) {
            this.attachmentsDetails.data[this.reqDocIndex] = response as Attachment;
            this.attachmentsDetails._updateChangeSubscription();
          }
        }
        this.resetIndexes();
      },
    });
  }

  getDocIndex(type: string, i: number) {
    if (type == "req") {
      this.reqDocIndex = i;
    }
    if (type == "not-req") {
      this.reqDocIndex = -1;
    }
  }

  getToolTip(fileName: string): string {
    return fileName ? "Re-upload" : "Upload";
  }

  resetIndexes() {
    this.reqDocIndex = -1;
  }
}
