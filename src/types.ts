export interface IFormInput {
  avatar: File[] | null;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface IContact {
  avatar: string;
  createdAt: string;
  updatadAt: string;
  email?: string;
  name: string;
  phoneNumber: string;
  _id: string;
  address: string;
}
