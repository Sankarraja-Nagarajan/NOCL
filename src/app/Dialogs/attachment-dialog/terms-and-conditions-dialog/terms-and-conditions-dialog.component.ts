import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../../Services/app-config.service';

@Component({
  selector: 'ngx-terms-and-conditions-dialog',
  templateUrl: './terms-and-conditions-dialog.component.html',
  styleUrls: ['./terms-and-conditions-dialog.component.scss']
})
export class TermsAndConditionsDialogComponent implements OnInit {
  listOfPdfSrc: any[] = [];
  currentIndex: number = 0;
  sustainableProcPolicyPdfSrc: string;
  codeOfConductPdfSrc: string;
  zoom: number = 0.9;

  constructor(private _config: AppConfigService) {
    this.listOfPdfSrc = this._config.get('Terms_And_Conditions');
  }

  ngOnInit(): void {
    this.sustainableProcPolicyPdfSrc = this._config.get('Sustainable_proc_Policy_File_Path');
    this.codeOfConductPdfSrc = this._config.get('Code_Of_Conduct_File_Path');
  }

  adjustZoom(zoomSize: number) {
    this.zoom += zoomSize;
  }

  nextOrPreviousPdf(num:number){
    this.currentIndex+=num;
  }
}
