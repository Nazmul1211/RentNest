

export interface IPropertyPayload  {
categoryId: string;
title: string;
description: string;
rentAmount: number;
securityDeposit?: number;
address: string; 
city: string;
area?: string;
country: string;
postalCode?: string;
bedrooms?: number; 
bathrooms?: number;
sizeSqft?: number; 
images: string[];
amenities: string[];
availableFrom?: Date;
landlordId?: string,
slug: string;
}

export interface IPropertyUpdatePayload  {
categoryId?: string;
title?: string;
description?: string;
rentAmount?: number;
securityDeposit?: number;
address?: string; 
city?: string;
area?: string;
country?: string;
postalCode?: string;
bedrooms?: number; 
bathrooms?: number;
sizeSqft?: number; 
images?: string[];
amenities?: string[];
availableFrom?: Date;
landlordId?: string,
slug?: string;
}