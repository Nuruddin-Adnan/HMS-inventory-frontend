export type ILoginUser = {
  email?: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IResetPassword = {
  password: string;
};