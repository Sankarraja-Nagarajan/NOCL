import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { CommonService } from "../Services/common.service";
import { catchError } from "rxjs/operators";
import { snackbarStatus } from "../Enums/snackbar-status";
import { getSession } from "../Utils";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _common: CommonService) {}

  getToken() {
    var users = getSession("userDetails");
    if (users) {
      let userData = JSON.parse(users);
      return userData.Token;
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const TOKEN = this.getToken();
    if (TOKEN) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${TOKEN}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        console.log("Error", err);
        if (err instanceof HttpErrorResponse) {
          return this.standardErrorCodeHandler(err);
        } else {
          this._common.openSnackbar(
            "Something went wrong! Please try after sometime.",
            snackbarStatus.Danger
          );
          return throwError(
            new HttpErrorResponse({
              error: "Something went wrong! Please try after sometime.",
              status: 500,
            })
          );
        }
      })
    );
  }

  standardErrorCodeHandler(err: HttpErrorResponse) {
    switch (err.status) {
      case 401:
        this._common.openSnackbar(
          "Session Expired, Please login again",
          snackbarStatus.Warning
        );
        localStorage.clear();
        this._router.navigate(["/auth/login"]);
        return;
      case 403:
        this._common.openSnackbar(
          "Permission Denied. You don't have the access.",
          snackbarStatus.Warning
        );
        break;
      case 0:
        this._common.openSnackbar(
          "Unable to establish connection with the server.",
          snackbarStatus.Danger
        );
        return throwError(
          new HttpErrorResponse({
            error: "Unable to establish connection with the server.",
            status: 0,
          })
        );
      case 404:
        this._common.openSnackbar(
          "Resource/Page Not Found",
          snackbarStatus.Danger
        );
        break;
      case 500:
        this._common.openSnackbar(
          "Internal Server Error",
          snackbarStatus.Danger
        );
        break;
      default:
        this._common.openSnackbar(
          this.errorMessageExtract(err),
          snackbarStatus.Danger
        );
        break;
    }
    return throwError(err);
  }

  errorMessageExtract(error: HttpErrorResponse): string {
    var message = "";
    if (error.error instanceof Object) {
      if (error.error.errors && error.error.errors instanceof Object) {
        Object.keys(error.error.errors).forEach((key) => {
          message += error.error.errors[key][0] + "\n";
        });
      } else {
        message =
          error.error instanceof Object
            ? error.error.Error
              ? error.error.Error
              : error.error.Message
              ? error.error.Message
              : error.error.message
              ? error.error.message
              : error.error
            : error.error || error.message || "Server Error";
      }
    }
    if (message) return message;
    else return error.error || error.message || "Server Error";
  }
}
