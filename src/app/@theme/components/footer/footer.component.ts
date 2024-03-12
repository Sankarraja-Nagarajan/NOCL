import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="powered-by">
      Powered by <b><a href="https://exalca.com" target="_blank">Exalca Technologies</a></b> | 
      <b><a href="https://www.nocil.com/wp-content/uploads/2023/11/Privacy-Policy.pdf" target="_blank">Privacy policy</a></b>
    </span>
    <div class="socials">
    <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
