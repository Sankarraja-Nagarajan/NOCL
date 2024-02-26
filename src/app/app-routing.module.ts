import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./Pages/auth/auth.module").then((m) => m.AuthModule),
  },
  { path: "", redirectTo: "auth", pathMatch: "full" },
  {
    path: 'onboarding',
    loadChildren: () =>
      import("./Pages/onboarding/onboarding.module").then((m) => m.OnboardingModule)
  },
  {
    path: 'registration',
    loadChildren: () =>
      import("./Pages/registration/registration.module").then((m) => m.RegistrationModule)
  }
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
