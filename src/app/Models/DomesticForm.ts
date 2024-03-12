import {
    Address,
    AnnualTurnOver,
    Bank_Detail,
    CommercialProfile,
    Contact,
    DomesticVendorPersonalData,
    ProprietorOrPartner,
    TechnicalProfile,
    VendorBranch,
    VendorOrganizationProfile
} from "./Dtos";

export class DomesticForm {
    DomesticVendorPersonalData: DomesticVendorPersonalData;
    VendorOrganizationProfile: VendorOrganizationProfile;
    TechnicalProfile: TechnicalProfile;
    CommercialProfile: CommercialProfile;
    BankDetail: Bank_Detail;
    Addresses: Address[];
    Contacts: Contact[];
    VendorBranches: VendorBranch[];
    ProprietorOrPartners: ProprietorOrPartner[];
    AnnualTurnOvers: AnnualTurnOver[];
}