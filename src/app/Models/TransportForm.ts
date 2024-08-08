import { Bank_Detail, CommercialProfile, TankerDetail, TransportVendorPersonalData, VehicleDetails, VendorBranch } from "./Dtos";

export class TransportForm{
    TransportVendorPersonalData:TransportVendorPersonalData;
    TankerDetails:TankerDetail[];
    VehicleDetails:VehicleDetails[];
    BankDetail:Bank_Detail;
    CommercialProfile:CommercialProfile;
    VendorBranches:VendorBranch[];
}