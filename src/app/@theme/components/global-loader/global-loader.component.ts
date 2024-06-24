import { Component } from '@angular/core';
import { GlobalLoaderService } from '../../../Services/global-loader.service';

@Component({
  selector: 'ngx-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss']
})
export class GlobalLoaderComponent {

  loading$ = this.loadingService.loading$;

  constructor(private loadingService: GlobalLoaderService) {
    
  }
}
