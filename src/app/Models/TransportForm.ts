import { Address, Bank_Detail, CommercialProfile, Contact, GST_Filing_Dto, TankerDetail, TransportVendorPersonalData, VehicleDetails, VendorBranch } from "./Dtos";

export class TransportForm {
    TransportVendorPersonalData: TransportVendorPersonalData;
    Addresses: Address[];
    Contacts: Contact[];
    TankerDetails: TankerDetail[];
    VehicleDetails: VehicleDetails[];
    BankDetail: Bank_Detail;
    CommercialProfile: CommercialProfile;
    VendorBranches: VendorBranch[];
    GstFilingDetails: GST_Filing_Dto;
}