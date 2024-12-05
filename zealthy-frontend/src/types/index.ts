export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface User {
  id?: number;
  email: string;
  password: string;
  aboutMe?: string;
  birthdate?: string; 
  address?: Address;
}

export interface PageConfig {
  page2: string[];
  page3: string[];
}
