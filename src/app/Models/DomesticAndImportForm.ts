import {
    Address,
    AnnualTurnOver,
    Bank_Detail,
    CommercialProfile,
    Contact,
    VendorPersonalData,
    MajorCustomer,
    NocilRelatedEmployee,
    ProprietorOrPartner,
    Subsideries,
    TechnicalProfile,
    VendorBranch,
    VendorOrganizationProfile,
    GST_Filing_Dto
} from "./Dtos";

export class DomesticAndImportForm {
    VendorPersonalData: VendorPersonalData;
    VendorOrganizationProfile: VendorOrganizationProfile;
    TechnicalProfile: TechnicalProfile;
    Subsideries: Subsideries[];
    MajorCustomers: MajorCustomer[];
    CommercialProfile: CommercialProfile;
    BankDetail: Bank_Detail;
    Addresses: Address[];
    Contacts: Contact[];
    VendorBranches: VendorBranch[];
    ProprietorOrPartners: ProprietorOrPartner[];
    AnnualTurnOvers: AnnualTurnOver[];
    NocilRelatedEmployees: NocilRelatedEmployee[];
    GstFilingDetails: GST_Filing_Dto;
}