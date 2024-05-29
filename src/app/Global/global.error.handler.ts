import { ErrorHandler, Injectable } from "@angular/core";
import { CommonService } from "../Services/common.service";
import { snackbarStatus } from "../Enums/snackbar-status";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private _common: CommonService) {}
  handleError(error: any): void {
    if(!(error instanceof HttpErrorResponse)){
      console.error("Global Error Handler - An unexpected error occurred: \n", error);
    }
    
    // this._common.openSnackbar(error.toString(), snackbarStatus.Danger);
  }
}
