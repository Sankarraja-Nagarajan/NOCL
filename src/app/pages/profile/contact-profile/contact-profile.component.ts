import { Component, Input, OnInit } from "@angular/core";
import { Contact } from "../../../Models/Dtos";
import { ContactType } from "../../../Models/Master";
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from "../../../Services/common.service";
import { MasterService } from "../../../Services/master.service";
import { RegistrationService } from "../../../Services/registration.service";
import { ConfirmationDialogComponent } from "../../../Dialogs/confirmation-dialog/confirmation-dialog.component";
import { snackbarStatus } from "../../../Enums/snackbar-status";
import { forkJoin } from "rxjs/internal/observable/forkJoin";

@Component({
  selector: "ngx-contact-profile",
  templateUrl: "./contact-profile.component.html",
  styleUrls: ["./contact-profile.component.scss"],
})
export class ContactProfileComponent implements OnInit {
 // @Input() formId: number = 17;
  contacts: Contact[] = [];
  contactTypes: ContactType[] = [];
  vendorInfo:any;
  formId:number;
  constructor(private _registration: RegistrationService,
    private _master: MasterService,
    private _commonService: CommonService,
    private _dialog:MatDialog) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo    = JSON.parse(vInfo);
    this.formId = this.vendorInfo.FormId;
    this.getMasterData();
  }

  getContactTypeById(contactTypeId: number): string {
    const type = this.contactTypes.find(
      (type) => type.Contact_Type_Id === contactTypeId
    );
    return type ? type.Contact_Type : "";
  }

  getMasterData() {
    forkJoin([
      this._master.getContactTypes(),
      this._registration.getFormData(this.formId, "Contacts"),
    ]).subscribe({
      next: (res) => {
        if (res[0]) {
          this.contactTypes = res[0] as ContactType[];
       
        }
        if (res[1]) {
          this.contacts = res[1] as Contact[];
        
        }
      },
      error: (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    });
  }

  deleteContact(){
    const DIALOGREF = this._dialog.open(ConfirmationDialogComponent, {
      width: "500px",
      height: "200px",
      data:'delete contact'
    });
    DIALOGREF.afterClosed().subscribe({
      next:(res)=>{
        if(res){
          
        }
      }
    });
  }
}
