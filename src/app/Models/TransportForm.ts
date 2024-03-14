import { Bank_Detail, CommercialProfile, TankerDetail, TransportVendorPersonalData, VendorBranch } from "./Dtos";

export class TransportForm{
    TransportVendorPersonalData:TransportVendorPersonalData;
    TankerDetails:TankerDetail[];
    BankDetail:Bank_Detail;
    CommercialProfile:CommercialProfile;
    VendorBranches:VendorBranch[];
}