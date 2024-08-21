import { Address, Bank_Detail, CommercialProfile, Contact, TankerDetail, TransportVendorPersonalData, VehicleDetails, VendorBranch } from "./Dtos";

export class TransportForm{
    TransportVendorPersonalData:TransportVendorPersonalData;
    Addresses: Address[];
    Contacts: Contact[];
    TankerDetails:TankerDetail[];
    VehicleDetails:VehicleDetails[];
    BankDetail:Bank_Detail;
    CommercialProfile:CommercialProfile;
    VendorBranches:VendorBranch[];
}