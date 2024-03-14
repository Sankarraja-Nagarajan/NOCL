import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span></span>
    <div class="socials">
    <span> <b><a href="https://www.nocil.com/wp-content/uploads/2023/11/Privacy-Policy.pdf" target="_blank">Privacy policy</a></b>
    </span>
    <span class="center-line">|</span>
    <a href="https://www.linkedin.com/company/nocil-limited/" target="_blank" class="ion ion-social-linkedin linked-icon"></a>
    </div>
  `,
})
export class FooterComponent {
}
