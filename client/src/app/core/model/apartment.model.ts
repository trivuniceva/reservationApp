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
}
