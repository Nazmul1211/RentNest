

export interface IRentalRequestPayload {
    propertyId: string;
    moveInDate: Date;
    moveOutDate: Date;
    totalMonths: number;
    tenantMessage: string;
    
    monthlyRent?: number;
    totalAmount?: number;
}