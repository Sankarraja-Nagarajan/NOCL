import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { Attachment } from "../../Models/Dtos";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AttachmentService } from "../../Services/attachment.service";
import { FileSaverService } from "../../Services/file-saver.service";
import { CommonService } from "../../Services/common.service";
import { snackbarStatus } from "../../Enums/snackbar-status";

@Component({
  selector: "ngx-document-view-dialog",
  templateUrl: "./document-view-dialog.component.html",
  styleUrls: ["./document-view-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentViewDialogComponent implements OnInit {
  fileName: string = "";
  loader: boolean = false;
  attachmentData: any;
  fileData: any;

  currentIndex: number = 0;
  zoom: number = 0.9;

  constructor(
    private _docService: AttachmentService,
    private _fileSaver: FileSaverService,
    private _common: CommonService,
    public _dialogRef: MatDialogRef<DocumentViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    if (this.data.attachment.Attachment_Id != null) {
      this.getAttachmentById();
    }
  }

  getAttachmentById() {
    this.loader = true;
    this._docService.getFileById(this.data.attachment.Attachment_Id).subscribe({
      next: async (res) => {
        this.fileData = res;
        this.fileName = res.FileName;
        this.attachmentData = await this._fileSaver.getAttachmentData(res);
        console.log(typeof this.attachmentData);
        console.log(this.attachmentData);
        this.loader = false;
      },
      error: (err) => {
        this.loader = false;
        this._dialogRef.close();
      },
    });
  }

  async downloadFile() {
    await this._fileSaver.downloadFile(this.fileData);
  }

  adjustZoom(zoomSize: number) {
    this.zoom += zoomSize;
  }

  nextOrPreviousPdf(num: number) {
    this.currentIndex += num;
  }

  isImage() {
    let arr = this.fileName.split(".");
    let ext = arr[arr.length - 1].toLowerCase();
    return (
      ext == "png" ||
      ext == "jpg" ||
      ext == "jpeg" ||
      ext == "tiff" ||
      ext == "svg"
    );
  }

  isPdf() {
    let arr = this.fileName.split(".");
    let ext = arr[arr.length - 1].toLowerCase();
    return ext == "pdf";
  }
}
