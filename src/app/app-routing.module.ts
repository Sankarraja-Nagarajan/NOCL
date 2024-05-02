import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './Guards/auth.guard';

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
      canActivate:[AuthGuard]
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import("./Pages/onboarding/onboarding.module").then((m) => m.OnboardingModule),
      canActivate:[AuthGuard]
  },
  {
    path: 'registration',
    loadChildren: () =>
      import("./Pages/registration/registration.module").then((m) => m.RegistrationModule),
      canActivate:[AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () =>
      import("./Pages/profile/profile.module").then((m) => m.ProfileModule),
      canActivate:[AuthGuard]
  },
  {
    path: "",
    redirectTo: "auth",
    pathMatch: "full"
  },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
