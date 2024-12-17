export class VendorPersonalData {
  Personal_Info_Id: number = 0;
  Title_Id: string;
  Form_Id: number;
  Organization_Name: string;
  Plant_Installation_Year: number;
  GSTVenClass_Id: number;
}

export class VendorOrganizationProfile {
  Id: number = 0;
  Form_Id: number;
  Type_of_Org_Id: number;
  Status_of_Company_Id: number;
  Annual_Prod_Capacity: number;
  RelationToNocil: boolean;
  Unit: string;
}

export class TechnicalProfile {
  Id: number = 0;
  Form_Id: number;
  Is_ISO_Certified: boolean;
  Other_Qms_Certified: boolean;
  Planning_for_Qms: boolean;
  Is_Statutory_Provisions_Adheard: boolean;
  Initiatives_for_Development: string;
}

export class CommercialProfile {
  Id: number = 0;
  Form_Id: number;
  Financial_Credit_Rating: string;
  Agency_Name: string;
  PAN: string;
  GSTIN: string;
  Is_MSME_Type: boolean;
  MSME_Type: string;
  MSME_Number: string;
  ServiceCategory: string;
}

export class Bank_Detail {
  Id: number = 0;
  Form_Id: number;
  AccountHolder: string;
  Bank: string;
  Branch: string;
  Address: string;
  Account_Number: string;
  IFSC: string;
  SWIFT: string;
  IBAN: string;
}

export class Address {
  Address_Id: number = 0;
  Form_Id: number;
  Address_Type_Id: number;
  House_No: string;
  Street_2: string;
  Street_3: string;
  Street_4: string;
  District: string;
  Postal_Code: string;
  City: string;
  Country_Code: string;
  Region_Id: number;
  Country_Name: string;
  Region_Name: string;
  Tel: string;
  Fax: string;
  Website: string;
}

export class Contact {
  Contact_Id: number = 0;
  Form_Id: number;
  Contact_Type_Id: number;
  Name: string;
  Designation: string;
  Email_Id: string;
  Phone_Number: string;
  Mobile_Number: string;
}

export class VendorBranch {
  Branch_Id: number = 0;
  Form_Id: number;
  Name: string;
  Designation: string;
  Email_Id: string;
  Mobile_No: string;
  Location: string;
}

export class VehicleDetails {
  VehicleTypeId: number = 0;
  Vehicle_Type: string;
  Form_Id: number;
  Capacity: number;
}

export class ProprietorOrPartner {
  Id: number = 0;
  Form_Id: number;
  Name: string;
  PercentageShare: number;
}

export class AnnualTurnOver {
  TurnOver_Id: number = 0;
  Form_Id: number;
  Year: number;
  SalesTurnOver: number;
  OperatingProfit: number;
  NetProfit: number;
}

export class TransportVendorPersonalData {
  Id: number = 0;
  Form_Id: number;
  Title: string;
  Name_of_Transporter: string;
  Date_of_Establishment: Date;
  GSTVenClass: string;
  No_of_Own_Vehicles: number;
  No_of_Drivers: number;
  Nicerglobe_Registration: boolean;
}

export class TankerDetail {
  Id: number = 0;
  Form_Id: number;
  Tanker_Type_Id: number;
  Capacity_of_Tanker: number;
  Unit: string;
  IsGPSRegistered: boolean;
}

export class Subsideries {
  Id: number = 0;
  Subsidery_Name: string;
  Form_Id: number;
}

export class MajorCustomer {
  Id: number = 0;
  Customer_Name: string;
  Location: string;
  Form_Id: number;
}

export class Attachment {
  Attachment_Id: number = 0;
  Form_Id: number;
  File_Name: string;
  File_Path: string;
  File_Extension: string;
  File_Type: string;
  Is_Expiry_Available: boolean;
  Expiry_Date: Date;
}

export class Dashboard {
  FormId: number;
  VendorTypeId: number;
  VendorType: string;
  Name: string;
  Mobile: string;
  Email: string;
  CreatedOn: Date;
  Status: string;
  PendingWith: string;
}

export class InitialData {
  Data: Dashboard[];
  Open: number;
  Pending: number;
  Approved: number;
  Rejected: number;
  SAP: number;
}

export class User {
  Employee_Id: string;
  Role_Id: number;
  First_Name: string;
  Middle_Name: string;
  Last_Name: string;
  Email: string;
  Mobile_No: string;
  Reporting_Manager_EmpId: string;
  IsActive: boolean;
  Display_Name: string;
}

export class Role {
  Role_Id: number;
  Role_Name: string;
}

export class NocilRelatedEmployee {
  Id: number;
  Form_Id: number;
  Employee_Name: string;
  Type_Of_Relation: string;
}

export class AttachmentResponse {
  FileName: string;
  DocType: string;
  Extension: string;
  FilePath: string;
  FileContent: any;
}

export class ReasonDetail {
  RejectedBy: string;
  RejectedOn: Date;
  Reason: string;
}

export class Reason {
  IsRejected: boolean;
  Reasons: ReasonDetail[];
}

export class VendorMaster {
  Vendor_Name: string;
  Vendor_Mail: string;
  Vendor_Mobile: string;
  Vendor_Code: string;
  Vendor_Type: string;
  Form_Id: number;
  VT_Id: number;
}

export class GstDetail {
  Name: string;
  RegistrationDate: string;
  Addresses: TaxPayerAddress[];
}

export class TaxPayerAddress {
  House_No: string;
  Street_2: string;
  Street_3: string;
  Street_4: string;
  Street_5: string;
  City: string;
  Postal_Code: string;
  District: string;
  Country_Code: string;
  Region_Id: string;
}

export class Region {
  Id: number;
  Country_Code: string;
  Code: string;
  Name: string;
}

export class FormsToShow {
  personalData: boolean = false;
  transportPersonalData: boolean = false;
  address: boolean = false;
  tankerDetails: boolean = false;
  contact: boolean = false;
  organizationData: boolean = false;
  proprietorOrPartner: boolean = false;
  annualTurnOver: boolean = false;
  technicalProfile: boolean = false;
  attachments: boolean = false;
  bankDetails: boolean = false;
  commercialProfile: boolean = false;
  vendorBranches: boolean = false;
  gstFilingDetails: boolean = false;
}

export class VendorReport {
  Vendor_Category?: boolean;
  Country_Code?: string;
  Region_Id?: number;
  Category_Vendor?: number[];
  Type_of_Vendor?: number[];
  ISO_Due_Date?: Date;
  Nicerglobe_Registration?: boolean;
}

export class GST_Filing_Dto {
  GST_History_Id: number;
  Form_Id: number;
  Last_FetchOn: Date | string;
  GST_Filing_Details: GST_Filing_Details[];
}

export class GST_Filing_Details {
  arn: string;
  mof: string;
  status: string;
  rtntype: string;
  ret_prd: string;
  dof: string;
  valid: string;
}
