import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NbRouteTab } from "@nebular/theme";
import { getSession } from "../../../Utils";
import { MasterService } from "../../../Services/master.service";
import { VendorProfile } from "../../../Models/Master";
import { CheckboxControlValueAccessor } from "@angular/forms";
import { findIndex } from "rxjs/operators";

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

  vendorInfo: any;
  loader: boolean = false;
  vendorProfile: VendorProfile = new VendorProfile();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _master: MasterService
  ) { }

  ngOnInit(): void {
    let vInfo = getSession("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
    this._master
      .getVendorProfile(Number.parseInt(this.vendorInfo.FormId))
      .subscribe({
        next: (res) => {
          this.vendorProfile = res as VendorProfile;
        },
      });
    this.allTabs = [
      'Address',
      'Contact',
      'Technical Profile',
      'Commercial Profile',
      'Bank Detail',
      'Branches',
      'Annual Turnover',
      'Transport Vendor Profile',
      'Tanker Details',
      'Organization Profile',
      'Attachments'
    ]
    this.visibleTabs = [...this.allTabs];
  }

  mouseScroll(evt: any) {
    let index = this.visibleTabs.findIndex(value => value === this.openTab);

    if (evt.deltaY < 0) {
      if (index == 0) {
        return
      }
      index -= 1;
    }
    else {
      if (index == this.visibleTabs.length - 1) {
        return
      }
      index += 1;
    }
    
    this.openTab = this.visibleTabs[index % this.visibleTabs.length];
  }
  changeTab(tabName: string) {
    this.openTab = tabName;
  }

  enableBtn(evt: boolean, btnName: string) {
    this.btnEnable[btnName] = evt;
    if(evt==false){
      let i = this.visibleTabs.findIndex(x=>x===btnName);
      this.visibleTabs.splice(i, 1);
    }
    this.openTab = this.visibleTabs[0];
  }
}
