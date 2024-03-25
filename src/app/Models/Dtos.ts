export class DomesticVendorPersonalData {
  Domestic_Personal_Info_Id: number = 0;
  Form_Id: number;
  Organization_Name: string;
  Plant_Installation_Year: number;
}

export class VendorOrganizationProfile {
  Id: number = 0;
  Form_Id: number;
  Type_of_Org_Id: number;
  Status_of_Company_Id: number;
  Annual_Prod_Capacity: number;
  RelationToNocil: boolean;
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
  AddressData: string;
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
  Name_of_Transporter: string;
  Date_of_Establishment: Date;
  No_of_Own_Vehicles: number;
  No_of_Drivers: number;
  Nicerglobe_Registration: string;
}

export class TankerDetail {
  Id: number = 0;
  Form_Id: number;
  Tanker_Type_Id: number;
  Capacity_of_Tanker: number;
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