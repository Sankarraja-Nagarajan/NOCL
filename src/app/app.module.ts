/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";

import { AppConfigService } from "./Services/app-config.service";
import { AttachmentDialogComponent } from "./Dialogs/attachment-dialog/attachment-dialog.component";
import { MaterialModule } from "./Pages/material/material.module";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RejectReasonDialogComponent } from './Dialogs/reject-reason-dialog/reject-reason-dialog.component';
import { DocumentViewDialogComponent } from './Dialogs/document-view-dialog/document-view-dialog.component';
import { TermsAndConditionsDialogComponent } from "./Dialogs/terms-and-conditions-dialog/terms-and-conditions-dialog.component";
import { CommonAddDataDialogComponent } from './Dialogs/common-add-data-dialog/common-add-data-dialog.component';
import { ConfirmationDialogComponent } from './Dialogs/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AttachmentDialogComponent,
    CommonAddDataDialogComponent,
    TermsAndConditionsDialogComponent,
    RejectReasonDialogComponent,
    DocumentViewDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    MaterialModule,
    PdfViewerModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      },
    },
  ],
})
export class AppModule {}
