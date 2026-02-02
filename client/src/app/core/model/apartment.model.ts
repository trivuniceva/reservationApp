export interface SpecialPrice {
  startDate: Date;
  endDate: Date;
  price: number;
}

export interface AvailabilityInterval {
  startDate: Date;
  endDate: Date;
}

export interface Apartment {
  id?: number;
  name: string;
  description: string;
  location: string;
  amenities: string[];
  images: string[];
  minGuests: number;
  maxGuests: number;
  type: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  approved?: boolean;
  ownerId?: number;
  status: 'PENDING' | 'APPROVED';
  autoConfirm: boolean;
  pricingStrategy: 'PER_GUEST' | 'PER_UNIT';
  cancellationDeadline: number;
  specialPrices: SpecialPrice[];
  availability: AvailabilityInterval[];

}
