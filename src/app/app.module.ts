/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
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
import { PdfViewerModule } from "ng2-pdf-viewer";
import { RejectReasonDialogComponent } from "./Dialogs/reject-reason-dialog/reject-reason-dialog.component";
import { DocumentViewDialogComponent } from "./Dialogs/document-view-dialog/document-view-dialog.component";
import { TermsAndConditionsDialogComponent } from "./Dialogs/terms-and-conditions-dialog/terms-and-conditions-dialog.component";
import { CommonAddDataDialogComponent } from "./Dialogs/common-add-data-dialog/common-add-data-dialog.component";
import { ConfirmationDialogComponent } from "./Dialogs/confirmation-dialog/confirmation-dialog.component";
import { ChangePasswordComponent } from "./Dialogs/change-password/change-password.component";
import { ForgotPasswordComponent } from "./Dialogs/forgot-password/forgot-password.component";
import { ApiInterceptor } from "./Interceptor/api.interceptor";
import { GlobalErrorHandler } from "./Global/global.error.handler";

@NgModule({
  declarations: [
    AppComponent,
    AttachmentDialogComponent,
    CommonAddDataDialogComponent,
    TermsAndConditionsDialogComponent,
    RejectReasonDialogComponent,
    DocumentViewDialogComponent,
    ConfirmationDialogComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
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
    PdfViewerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
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
