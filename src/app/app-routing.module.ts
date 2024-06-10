import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./Guards/auth.guard";
import { SuccessMessageComponent } from "./Components/success-message/success-message.component";

export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./Pages/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "masters",
    loadChildren: () =>
      import("./Pages/masters/masters.module").then((m) => m.MastersModule),
    canActivate: [AuthGuard],
    data: {
      allowed: ["Admin"],
      notAllowed: ["PO", "RM", "Manager", "Vendor"],
    },
  },
  {
    path: "onboarding",
    loadChildren: () =>
      import("./Pages/onboarding/onboarding.module").then(
        (m) => m.OnboardingModule
      ),
    canActivate: [AuthGuard],
    data: {
      allowed: ["Admin", "PO", "RM", "Manager"],
      notAllowed: ["Vendor"],
    },
  },
  {
    path: "registration",
    loadChildren: () =>
      import("./Pages/registration/registration.module").then(
        (m) => m.RegistrationModule
      ),
    canActivate: [AuthGuard],
    data: {
      allowed: ["Vendor", "PO", "RM", "Manager"],
      notAllowed: ["Admin"],
    },
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./Pages/profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
    data: {
      allowed: ["Admin", "Vendor"],
      notAllowed: ["PO", "RM", "Manager"],
    },
  },
  {
    path: "",
    redirectTo: "auth",
    pathMatch: "full",
  },
  {
    path: "success",
    component: SuccessMessageComponent,
  },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
