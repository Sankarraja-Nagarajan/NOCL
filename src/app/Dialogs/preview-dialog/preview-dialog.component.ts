import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileSaverService } from "../../Services/file-saver.service";
import { AttachmentService } from '../../Services/attachment.service';


@Component({
  selector: 'ngx-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent {

  fileName: string = "";
  loader: boolean = false;
  fileData: any;
  attachmentData: any;
  loopingArrayData = [];
  currentIndex = 0;
  zoom: number = 0.9;




  constructor(
    private _fileSaver: FileSaverService,
    private _docService: AttachmentService,
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loopingArrayData = this.data.attach.map(element => element.File_Name);
    this.loadFileData();
  }



  loadFileData() {
    if (this.currentIndex < this.data.attach.length) {
      let currentAttachment = this.data.attach[this.currentIndex];
      try {
        this._docService.getFileById(currentAttachment.Attachment_Id).subscribe({
          next: async (res) => {
            this.fileData = res;
            this.fileName = res.FileName;
            this.attachmentData = await this._fileSaver.getAttachmentData(this.fileData);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
      catch (err) {
        console.log("Error loading", err);
      }
    }
    else {
      this.fileName = "No more files";
    }
  }


  async downloadFile() {
    await this._fileSaver.downloadFile(this.fileData);
  }


  adjustZoom(zoomSize: number) {
    this.zoom += zoomSize;
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


 


  OnNextClick() {
    if (this.currentIndex < this.loopingArrayData.length - 1) {
      this.currentIndex++;
      this.loadFileData();
    }
  }



  OnPreviousClick() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadFileData();
    }
  }
}
