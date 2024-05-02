export class LoginDetail {
  UserName: string;
  Password: string;
}

export class AuthResponse {
  Employee_Id: string;
  Role: string;
  Role_Id: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DisplayName: string;
  Email: string;
  Mobile: string;
  Token: string;
  RmEmployee_Id: string;
  RmRole_Id: number;
  RmRole: string;
}

export class RequestOtp {
  FormId: number;
  Mobile: string;
}

export class VerifyOtp {
  Otp: string;
  Mobile: string;
  FormId: number;
  TxId: string;
}

export class UpdatePassword {
  EmployeeId: string;
  CurrentPassword: string;
  NewPassword: string;
}

export class ForgotPassword {
  Employee_Id: string;
  Otp: string;
  Password: string;
}
