import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CommonService } from "../../../Services/common.service";
import { RegistrationService } from "../../../Services/registration.service";

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

  constructor(
    private _commonService: CommonService,
    private _registration: RegistrationService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;

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
}
