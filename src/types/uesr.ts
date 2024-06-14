export type IUser = {
  _id?: string;
  password?: string;
  department: any;
  role: string;
  permission?: string[];
  name: string;
  phoneNumber?: string;
  email: string;
  imgPath?: string;
  address?: string;
  seal?: string;
  signature?: string;
  status?: string;
  createdBy?: string | IUser;
  updatedBy?: string | IUser | null;
};
