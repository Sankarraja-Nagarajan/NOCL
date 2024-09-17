import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { NbMenuService, NbSidebarService } from "@nebular/theme";
import { ActivatedRoute } from "@angular/router";
import { NbRouteTab } from "@nebular/theme";
import { getSession } from "../../../Utils";
import { MasterService } from "../../../Services/master.service";
import { VendorProfile } from "../../../Models/Master";
import { AppConfigService } from "../../../Services/app-config.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { GradeDialogComponent } from "../../../Dialogs/grade-dialog/grade-dialog.component";
import { RequestEditReasonDialogComponent } from "../../../Dialogs/request-edit-reason-dialog/request-edit-reason-dialog.component";
import { EditRequestService } from "../../../Services/edit-request.service";
import { CommonService } from "../../../Services/common.service";
import { snackbarStatus } from "../../../Enums/snackbar-status";

@Component({
  selector: "ngx-profile-layout",
  templateUrl: "./profile-layout.component.html",
  styleUrls: ["./profile-layout.component.scss"],
})
export class ProfileLayoutComponent implements OnInit {
  tabs: NbRouteTab[] = [
    {
      title: "Users",
      icon: "person",
      route: "./tab1",
    },
    {
      title: "Orders",
      icon: "paper-plane-outline",
      responsive: true,
      route: ["./tab2"],
    },
    {
      title: "Query params",
      icon: "flash-outline",
      responsive: true,
      disabled: false,
      route: "./tab3",
      queryParams: { param1: 123456, param2: "test" },
    },
    {
      title: "Transaction",
      icon: "flash-outline",
      responsive: true,
      disabled: true,
    },
  ];

  allTabs: any;
  openTab: string = "";
  btnEnable: any = {};
  visibleTabs = [];
  formToShow: any;
  isPopupVisible: boolean = false;

  userDetails: any;
  vendorInfo: any;
  vendorProfile: VendorProfile = new VendorProfile();

  constructor(
    private _master: MasterService,
    private _config: AppConfigService,
    private _dialog: MatDialog,
    private _editRequest: EditRequestService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    let vInfo = getSession("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this.getVendorPrfile();

    let user = getSession("userDetails");
    this.userDetails = JSON.parse(user);
    this.formToShow = this._config.getSubItem(
      "FormsToShow",
      this.vendorInfo.VT_Id
    );

    this.renderTabs();
  }

  getVendorPrfile() {
    this._master
      .getVendorProfile(Number.parseInt(this.vendorInfo.FormId))
      .subscribe({
        next: (res) => {
          this.vendorProfile = res as VendorProfile;
          console.log(this.vendorProfile)
        },
      });
  }

  renderTabs() {
    this.btnEnable = {
      "Transport Vendor Profile": {
        isVisible: this.formToShow.transportPersonalData,
        hasData: true,
      },
      "Tanker Details": {
        isVisible: this.formToShow.tankerDetails,
        hasData: true,
      },
      Address: {
        isVisible: this.formToShow.address,
        hasData: true,
      },
      Contact: {
        isVisible: this.formToShow.contact,
        hasData: true,
      },
      "Technical Profile": {
        isVisible: this.formToShow.technicalProfile,
        hasData: true,
      },
      "Commercial Profile": {
        isVisible: this.formToShow.commercialProfile,
        hasData: true,
      },
      "Organization Profile": {
        isVisible: this.formToShow.organizationData,
        hasData: true,
      },
      "Annual Turnover": {
        isVisible: this.formToShow.annualTurnOver,
        hasData: true,
      },
      "Bank Detail": {
        isVisible: this.formToShow.bankDetails,
        hasData: true,
      },
      "Vendor Branches": {
        isVisible: this.formToShow.vendorBranches,
        hasData: true,
      },
      Documents: {
        isVisible: this.formToShow.attachments,
        hasData: true,
      },
    };

    Object.entries(this.btnEnable).forEach(([key, value]) => {
      if (this.btnEnable[key].isVisible) {
        this.visibleTabs.push(key);
      }
    });
    this.openTab = this.visibleTabs[0];
  }

  mouseScroll(evt: any) {
    let index = this.visibleTabs.findIndex((value) => value === this.openTab);

    if (evt.deltaY < 0) {
      if (index == 0) {
        return;
      }
      index -= 1;
    } else {
      if (index == this.visibleTabs.length - 1) {
        return;
      }
      index += 1;
    }

    this.openTab = this.visibleTabs[index % this.visibleTabs.length];
  }

  changeTab(tabName: string) {
    this.openTab = tabName;
  }
  enableBtn(event: boolean, btnName: string) {
    this.btnEnable[btnName].hasData = event;
  }

  openGradeDialog() {
    const dialogConfig: MatDialogConfig = {
      data: {
        vendorProfile: this.vendorProfile,
      },
      minWidth: 400,
      panelClass: "dialog-box-document",
      autoFocus: false,
    };
    this._dialog.open(GradeDialogComponent, dialogConfig);
    this._dialog.afterAllClosed.subscribe({
      next: () => {
        this.getVendorPrfile();
      },
    });
  }

  openRequestDialog() {
    const dialogConfig: MatDialogConfig = {
      data: {
        FormId: this.vendorProfile.Grade.FormId,
        VendorCode: this.vendorProfile.Grade.Vendor_Code
      },
      disableClose: true,
      width: "400px",
      height: "250px",
    }
    const DIALOF_REF = this._dialog.open(RequestEditReasonDialogComponent, dialogConfig);
    DIALOF_REF.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          console.log(res.request);
          this._editRequest.editRequest(res.request).subscribe({
            next: (res) => {

              if (res && res.Status == 200) {
                this._commonService.openSnackbar(
                  res.Message,
                  snackbarStatus.Success
                );
              }
            },
            error: (err) => {
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
      },
    });
  }
}
