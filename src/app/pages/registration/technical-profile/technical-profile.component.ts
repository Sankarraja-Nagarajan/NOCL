import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-technical-profile',
  templateUrl: './technical-profile.component.html',
  styleUrls: ['./technical-profile.component.scss']
})
export class TechnicalProfileComponent {

  technicalProfileForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.technicalProfileForm = this._fb.group({
      Id: [''],
      Form_Id: [''],
      Is_ISO_Certified: [''],
      Other_Qms_Certified: [''],
      Planning_for_Qms: [''],
      Is_Statutory_Provisions_Adheard: [''],
      Initiatives_for_Development: [''],
    });
  }
}
