import {
    Address,
    AnnualTurnOver,
    Bank_Detail,
    CommercialProfile,
    Contact,
    DomesticVendorPersonalData,
    MajorCustomer,
    ProprietorOrPartner,
    Subsideries,
    TechnicalProfile,
    VendorBranch,
    VendorOrganizationProfile
} from "./Dtos";

export class DomesticAndImportForm {
    DomesticVendorPersonalData: DomesticVendorPersonalData;
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
}