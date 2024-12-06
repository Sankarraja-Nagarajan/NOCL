import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
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
import { getSession } from "../../../Utils";
@Component({
  selector: "ngx-attachments",
  templateUrl: "./attachments.component.html",
  styleUrls: ["./attachments.component.scss"],
})
export class AttachmentsComponent implements OnInit, OnChanges {
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
  requiredAttachments: Attachment[] = [];
  otherAttachments: Attachment[] = [];
  reqDatasource = new MatTableDataSource(this.requiredAttachments);
  additionalDatasource = new MatTableDataSource(this.otherAttachments);
  reqDoctypes: string[] = [];
  reqDocIndex: number = -1;
  otherDocIndex: number = -1;
  attachmentsArray: Attachment[] = [];
  responseToTechnical;
  FileType;
  IsGstRequired: boolean;
  IsMsmeRequired: boolean;

  constructor(
    public _dialog: MatDialog,
    private _common: CommonService,
    private _registration: RegistrationService,
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService,
    private _config: AppConfigService,
    private emitterService: EmitterService,

  ) { }

  ngOnInit(): void {
    const userData = JSON.parse(getSession("userDetails"));
    this.role = userData ? userData.Role : "";

    //GST
    this.IsGSTAttach();

    // MSME 
    this.IsMSMEAttach();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.v_Id) {
      this.v_Id = changes.v_Id.currentValue;
      this.reqDoctypes = this._config
        .getSubItem("RequiredDocs", this.v_Id.toString())
        .split(",");
      this.GetAttachment();
    }
    if (changes.form_Id) {
      this.form_Id = changes.form_Id.currentValue;
    }
  }

  // Get attachments by form Id
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
              this.FileType = element.File_Type;
            } else {
              if(!element.File_Type.toLowerCase().includes("iso")){
                this.additionalDatasource.data.push(element);
              }
            }
          });

          this.reqDatasource.data = this.reqDatasource.data.filter((attachment) =>
            attachment.File_Name && attachment.File_Path
          );

          this.additionalDatasource.data = this.additionalDatasource.data.filter((attachment) =>
            attachment.File_Name && attachment.File_Path
          );

          this.reqDoctypes.forEach((element) => {
            if (!resFileTypes.includes(element)) {
              let attachment = new Attachment();
              attachment.Form_Id = this.form_Id;
              attachment.File_Type = element;
              if (attachment.File_Name != null) {
                this.reqDatasource.data.push(attachment);
              }
            }
          });

          this.reqDatasource._updateChangeSubscription();
          this.additionalDatasource._updateChangeSubscription();
          this.responseToTechnical = res;
          this.filterISOType();

          // this.additionalDatasource._updateChangeSubscription();
        } else {
          this.reqDatasource = new MatTableDataSource();
          this.reqDoctypes.forEach((element) => {
            let attachment = new Attachment();
            attachment.Form_Id = this.form_Id;
            attachment.File_Type = element;
            this.reqDatasource.data.push(attachment);
          });
          this.reqDatasource._updateChangeSubscription();
          this.additionalDatasource._updateChangeSubscription();
        }
        // else if(this.reqDoctypes.length <= 5){

        // }
      },
      error: (err) => { },
    });
  }

  removeAttachment(attachmentId: number, i: number) {

    this._docService.DeleteAttachment(attachmentId).subscribe({
      next: (res) => {
        this.additionalDatasource.data.splice(i, 1);
        this.additionalDatasource._updateChangeSubscription();
        this._common.openSnackbar(res.Message, snackbarStatus.Success);
      },
      error: (err) => {

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

  uploadAttachment(fileType: string, type: string, i = -1) {
    this.getDocIndex(type, i);

    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: true,
        reUpload: false,
        formId: this.form_Id,
        file_Type: fileType,
      },
    });

    // const DIALOGREF = this._common.uploadAttachment(this.form_Id, fileType);

    DIALOGREF.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          if (this.reqDocIndex >= 0) {
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

  reUploadAttachment(element: Attachment, type: string, i) {
    this.getDocIndex(type, i);

    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: false,
        reUpload: true,
        formId: this.form_Id,
        attachment: element,
      },
    });

    // const DIALOGREF = this._common.reuploadAttachment(this.form_Id, element);

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

  getDocIndex(type: string, i: number) {
    if (type == "req") {
      this.reqDocIndex = i;
      this.otherDocIndex = -1;
    }
    if (type == "not-req") {
      this.otherDocIndex = i;
      this.reqDocIndex = -1;
    }
  }

  getToolTip(fileName: string): string {
    return fileName ? "Re-upload" : "Upload";
  }

  resetIndexes() {
    this.reqDocIndex = -1;
    this.otherDocIndex = -1;
  }

  // getAttachments() {
  //   this._registration.getFormData(this.form_Id, "Attachments").subscribe({
  //     next: (res) => {
  //       this.attachmentsArray = res;
  //       this.openDialog();
  //     }
  //   });
  // }

  // openDialog(): void {
  //   const dialogRef = this._dialog.open(PreviewDialogComponent, {
  //     data:
  //       { attach: this.attachmentsArray },
  //     height: "500px",
  //     width: "700px",
  //     autoFocus: false
  //   });

  // }

  filterISOType() {
    this.responseToTechnical.forEach((element) => {
      if (element.File_Type.includes("ISO 9001")) {
        this.emitterService.emitISODocument(element);
      }
    });
  }

  IsGSTAttach() {
    this.emitterService.requiredAttachments.subscribe({
      next: (data) => {
        this.IsGstRequired = data;
        const gstAttachment = this.reqDatasource.data.find(item => item.File_Type === 'GST');
        const gstAttachmentIndex = this.reqDatasource.data.findIndex(item => item.File_Type === 'GST');
        if (this.IsGstRequired) {
          if (!gstAttachment) {
            let attachment = new Attachment();
            attachment.Form_Id = this.form_Id;
            attachment.File_Type = 'GST';
            attachment.File_Name = '';
            this.reqDatasource.data.push(attachment);
          }
        }
        else {
          if (gstAttachment) {
            this.reqDatasource.data = this.reqDatasource.data.filter(item => item.File_Type !== 'GST');
          }
        }
        this.reqDatasource._updateChangeSubscription();
      }
    });
  }

  IsMSMEAttach() {
    this.emitterService.isMSME.subscribe({
      next: (data) => {
        this.IsMsmeRequired = data;
        const msmeAttachment = this.reqDatasource.data.find(item => item.File_Type === 'MSME');
        if (this.IsMsmeRequired) {
          if (!msmeAttachment) {
            let attachment = new Attachment();
            attachment.Form_Id = this.form_Id;
            attachment.File_Type = 'MSME';
            this.reqDatasource.data.push(attachment);
          }
        }
        else {
          if (msmeAttachment) {
            this.reqDatasource.data = this.reqDatasource.data.filter(item => item.File_Type !== 'MSME');
          }
        }
        this.reqDatasource._updateChangeSubscription();
      }
    });
  }
}
