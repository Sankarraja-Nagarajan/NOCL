import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "ngx-contact-profile",
  templateUrl: "./contact-profile.component.html",
  styleUrls: ["./contact-profile.component.scss"],
})
export class ContactProfileComponent implements OnInit {
  @Input() formId: number = 17;
  constructor() {}

  ngOnInit(): void {}
}
