import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-technical-profile',
  templateUrl: './technical-profile.component.html',
  styleUrls: ['./technical-profile.component.scss']
})
export class TechnicalProfileComponent {

  technicalProfileForm: FormGroup;

  disablePlanningOption: boolean;

  constructor(private _fb: FormBuilder) { }

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

  changeOptions() {
    if (this.technicalProfileForm.get('Is_ISO_Certified').value == true || this.technicalProfileForm.get('Other_Qms_Certified').value) {
      this.technicalProfileForm.get('Planning_for_Qms').disable();
    }
    else if (this.technicalProfileForm.get('Planning_for_Qms').value == true) {
      this.technicalProfileForm.get('Is_ISO_Certified').disable();
      this.technicalProfileForm.get('Other_Qms_Certified').disable();
    }
    else {
      this.technicalProfileForm.get('Planning_for_Qms').enable();
      this.technicalProfileForm.get('Is_ISO_Certified').enable();
      this.technicalProfileForm.get('Other_Qms_Certified').enable();
    }
  }
}
