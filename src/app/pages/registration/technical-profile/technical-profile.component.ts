import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Attachment, TechnicalProfile } from "../../../Models/Dtos";
import { AuthResponse } from "../../../Models/authModel";
import { RegistrationService } from "../../../Services/registration.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { AppConfigService } from "../../../Services/app-config.service";
import { EmitterService } from "../../../Services/emitter.service";
import { getSession, isNullOrEmpty } from "../../../Utils";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AttachmentDialogComponent } from "../../../Dialogs/attachment-dialog/attachment-dialog.component";
import { AttachmentService } from "../../../Services/attachment.service";
import { FileSaverService } from "../../../Services/file-saver.service";
import { DocumentViewDialogComponent } from "../../../Dialogs/document-view-dialog/document-view-dialog.component";

@Component({
  selector: "ngx-technical-profile",
  templateUrl: "./technical-profile.component.html",
  styleUrls: ["./technical-profile.component.scss"],
})
export class TechnicalProfileComponent implements OnInit {
  @Input() form_Id: number;

  technicalProfileForm: FormGroup;
  disablePlanningOption: boolean;
  authResponse: AuthResponse;
  techId: number = 0;
  isoindex: number;
  documents: string;
  reqDoctypes: string[] = [];
  isoAttachment: Attachment = new Attachment();


  constructor(
    private _fb: FormBuilder,
    private _registration: RegistrationService,
    private _common: CommonService,
    private _config: AppConfigService,
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService,
    private emitterService: EmitterService,
    public _dialog: MatDialog) {
    console.log(this.isoAttachment)

  }

  ngOnInit(): void {
    this.technicalProfileForm = this._fb.group({
      Is_ISO_Certified: [false],
      Other_Qms_Certified: [false],
      Planning_for_Qms: [false],
      Is_Statutory_Provisions_Adheard: [false],
      Initiatives_for_Development: [""],
    });

    this.authResponse = JSON.parse(getSession("userDetails"));
    if (this.authResponse && this.authResponse?.Role != "Vendor") {
      this.technicalProfileForm.disable();
    }

    // Get Form data by form Id
    this._registration.getFormData(this.form_Id, "TechnicalProfile").subscribe({
      next: (res) => {
        if (res) {
          this.techId = (res as TechnicalProfile).Id;
          this.technicalProfileForm.patchValue(res);
        }
      },
      error: (err) => {

      },
    });

    this.updateISOAttachment();

  }

  changeOptions() {
    this.reqDoctypes = this._config.get("Required_Attachments").split(",");
    if (this.technicalProfileForm.get("Is_ISO_Certified").value == true && this.technicalProfileForm.get("Other_Qms_Certified").value) {
      this.technicalProfileForm.get("Planning_for_Qms").disable();
    }
    else if (this.technicalProfileForm.get("Is_ISO_Certified").value == true || this.technicalProfileForm.get("Other_Qms_Certified").value) {
      this.technicalProfileForm.get("Planning_for_Qms").enable();
    }
    else if (this.technicalProfileForm.get("Planning_for_Qms").value == true) {
      this.technicalProfileForm.get("Is_ISO_Certified").disable();
      this.technicalProfileForm.get("Other_Qms_Certified").disable();
    }
    else {
      this.technicalProfileForm.get("Planning_for_Qms").enable();
      this.technicalProfileForm.get("Is_ISO_Certified").enable();
      this.technicalProfileForm.get("Other_Qms_Certified").enable();
    }
    if (!this.technicalProfileForm.get("Is_ISO_Certified").value) {
      this.isoindex = this.reqDoctypes.indexOf("ISO 9001");
      if (this.isoindex != -1) {
        this.reqDoctypes.splice(this.isoindex, 1);
        this.documents = this.reqDoctypes.join(",");
        this._config.updateConfigValue('Required_Attachments', this.documents);
        const value = this._config.get("Required_Attachments").split(",");
        this.updateRequireDocument(value);
      }
    }
    else {
      this.isoindex = this.reqDoctypes.indexOf("ISO 9001");
      if (this.isoindex == -1) {
        //this.reqDoctypes = [];
        this.reqDoctypes.push("ISO 9001");
        this.documents = this.reqDoctypes.join(",");
        this._config.updateConfigValue('Required_Attachments', this.documents);
        const value = this._config.get("Required_Attachments").split(",");
        this.updateRequireDocument(value);
      }

    }
  }

  // Get technical Profile data, calls by layout component
  getTechnicalProfile() {
    let technicalProfile = new TechnicalProfile();
    technicalProfile = this.technicalProfileForm.value;
    technicalProfile.Id = this.techId ? this.techId : 0;
    technicalProfile.Form_Id = this.form_Id;
    return technicalProfile;
  }
  updateRequireDocument(value: string) {
    // Logic to update value
    this.emitterService.emitRequiredDocument(value);
  }






  //upload-Attachment
  uploadAttachment(fileType: string) {
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
          this.isoAttachment = response as Attachment;
          console.log(this.isoAttachment)
        }
      },
    });
  }

  //Reupload Attachment
  reUploadAttachment(attachment: any) {
    const DIALOGREF = this._dialog.open(AttachmentDialogComponent, {
      autoFocus: false,
      data: {
        upload: false,
        reUpload: true,
        formId: this.form_Id,
        attachment: attachment,
      },
    });

    DIALOGREF.afterClosed().subscribe({
      next: (response) => {
        if (response) {
          this.isoAttachment = response as Attachment;
          console.log(this.isoAttachment)

        }
      },
    });
  }


  getToolTip(fileName: string): string {
    return !isNullOrEmpty(fileName) ? "Re-upload" : "Upload";
  }


  openViewDocDialog(attachment: Attachment) {
    const dialogconfig: MatDialogConfig = {
      data: {
        attachment: this.isoAttachment,
      },
      height: "calc(100vh - 100px)",
      minWidth: "600px",
      panelClass: "dialog-box-document",
      autoFocus: false,
    };

    if (
      this.isImage(this.isoAttachment.File_Name) ||
      this.isPdf(this.isoAttachment.File_Name)
    ) {
      const dialogRef = this._dialog.open(
        DocumentViewDialogComponent,
        dialogconfig
      );
    } else {
      this._docService.getFileById(this.isoAttachment.Attachment_Id).subscribe({
        next: async (res) => {
          await this._fileSaver.downloadFile(res);
        },
        error: (err) => {
          console.log(err);
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

  updateISOAttachment() {
    this.emitterService.ISODocumentData().subscribe({
      next: (data) => {
        if (data && !isNullOrEmpty(data)) {
          this.isoAttachment = data as Attachment;
          this.technicalProfileForm.get('Is_ISO_Certified').patchValue(true);
        }
      }
    });
  }

}
