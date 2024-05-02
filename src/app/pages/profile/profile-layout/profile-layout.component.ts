import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NbRouteTab } from "@nebular/theme";

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

  vendorInfo: any;
  loader: boolean = false;
  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let vInfo = sessionStorage.getItem("vendorInfo");
    this.vendorInfo = JSON.parse(vInfo);
  }
}
