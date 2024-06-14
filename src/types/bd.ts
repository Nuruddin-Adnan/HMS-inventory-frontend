export type IDivision = {
  _id?: string;
  id: string;
  name: string;
  bn_name: string;
  lat: string;
  long: string;
  createdBy?: string;
  updatedBy?: string;
};

export type IDistrict = {
  _id?: string;
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat: string;
  long: string;
  createdBy?: string;
  updatedBy?: string;
};

export type IUpazila = {
  _id?: string;
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  district?: any;
  createdBy?: string;
  updatedBy?: string;
};
