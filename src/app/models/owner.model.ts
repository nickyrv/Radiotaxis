export interface Owner {
  id: string;
  name: string;
  ci: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  
  vehicleIds: string[];

  joinDate: string;
}