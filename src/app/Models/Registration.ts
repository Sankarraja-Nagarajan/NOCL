export class Approval {
    Form_Id: number;
    VendorTypeId: number;
    EmployeeId: string;
    RoleId: number;
    RoleName: string;
    RmEmployeeId: string;
    RmRoleId: number;
    RmRoleName: string;
}

export class Form {
    Vendor_Type_Id: number;
    Status_Id: number;
    Vendor_Code: string;
    Vendor_Name: string;
    Vendor_Mail: string;
    Vendor_Mobile: string;
    Company_Code: string;
    Department_Id: string;
    CreatedBy: string;
}

export class FormSubmitTemplate {
    Form_Id: number;
    Vendor_Type_Id: number;
    FormData: any;
}

export class Rejection {
    Form_Id: number;
    Employee_Id: string;
    Reason: string;
}
export class ExpiryDetails {

    Doc_Type: string;
    Valid_Till_Date: string;
    Vendor_Mail: string;
    Vendor_Mobile: string;
    Vendor_Name: string;
}