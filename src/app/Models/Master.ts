export class CompanyCode {
  Company_Code: string;
  Description: string;
}

export class Department {
  Department_Id: number;
  Description: string;
}

export class VendorType {
  Id: number;
  Vendor_Type: string;
}

export class OrganizationType {
  Id: number;
  Type_of_Organization: string;
}

export class CompanyStatus {
  Id: number;
  Company_Status: string;
}

export class AddressType {
  Address_Type_Id: number;
  Address_Type: string;
}

export class ContactType {
  Contact_Type_Id: number;
  Contact_Type: string;
}

export class TankerType {
  Tanker_Type_Id: number;
  Tanker_Type: string;
}

export class VendorProfile {
  Vendor_Name: string;
  Year: string;
  Grade: VendorGrade;
}

export class VendorGrade {
  GradeId: number;
  FormId: number;
  Vendor_Code: string;
  Grade: number;
  Last_Audit_Date: Date | string | null;
  Last_Audited_By: string;
  Location: string;
}
