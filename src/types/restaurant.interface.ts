export interface ISocialLink {
  name: string;
  handle: string;
}

export interface IMenu {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  price?: number;
  category?: string;
  dietaryRestrictions?: string[];
}

export interface IResAdditionalInfo {
  delivery: boolean;
  reservations: boolean;
  socialMedia?: ISocialLink[];
}
