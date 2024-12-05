import {
    Address,
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

export class ServiceForm {
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
    NocilRelatedEmployees: NocilRelatedEmployee[];
    GstFilingDetails: GST_Filing_Dto[];
}