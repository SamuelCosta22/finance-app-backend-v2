export type CreateUserParams = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type UpdateUserParams = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
};
