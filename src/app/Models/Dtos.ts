export class DomesticVendorPersonalData{
    Domestic_Personal_Info_Id:number;
    Form_Id:number;
    Organization_Name:string;
    Plant_Installation_Year:number;
}

export class VendorOrganizationProfile{
    Id:number;
    Form_Id:number;
    Type_of_Org_Id:number;
    Status_of_Company_Id:number;
}

export class TechnicalProfile{
    Id:number;
    Form_Id:number;
    Is_ISO_Cerified:boolean;
    Other_Qms_Certified:boolean;
    Planning_for_Qms:boolean;
    Is_Statutory_Provisions_Adheard:boolean;
    Initiatives_for_Development:string;
}

export class CommercialProfile{
    Id:number;
    Form_Id:number;
    Financial_Credit_Rating:string;
    Agency_Name:string;
    PAN:string;
    GSTIN:string;
    MSME_Type:string;
    MSME_Number:string;
}

export class Bank_Detail{
    Id:number;
    Form_Id:number;
    AccountHolder:string;
    Bank:string;
    Branch:string;
    Address:string;
    Account_Number:string;
    IFSC:string;
    SWIFT:string;
    IBAN:string;
}

export class Address{
    Address_Id:number;
    Form_Id:number;
    Address_Type_Id:number;
    AddressData:string;
    Tel:string;
    Fax:string;
    Website:string;
}

export class Contact{
    Contact_Id:number;
    Form_Id:number;
    Contact_Type_Id:number;
    Name:string;
    Designation:string;
    Email_Id:string;
    Phone_Number:string;
    Mobile_Number:string;
}

export class VendorBranch{
    Branch_Id:number;
    Form_Id:number;
    Name:string;
    Designation:string;
    Email_Id:string;
    Mobile_No:string;
    Location:string;
}

export class ProprietorOrPartner{
    Id:number;
    Form_Id:number;
    Name:string;
    PercentageShare:number;
}

export class AnnualTurnOver{
    TurnOver_Id:number;
    Form_Id:number;
    Year:number;
    SalesTurnOver:number;
    OperatingProfit:number;
    NetProfit:number;
}