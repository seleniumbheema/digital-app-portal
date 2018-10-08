export interface LoginCredentials {
  email: string;
  password: string;
  blackbox: string;
}

export interface NewPasswordCredentials {
  blackbox: string;
  newPassword: string;
}

export interface MasterCustomerCredentials {
  forename: string;
  surname: string;
  dateOfBirth: string;
  postcode: string;
  policyId: number;
  vehicleRegistrationNumber: string;
}

export interface UserNameRetrievalDetails {
  firstName: string;
  lastName: string;
  postcode: string;
  dob: string;
}

export interface ChangeUserNameDetails {
  email: string;
  password: string;
}

export interface PasswordResetConfirmationDetails {
  confirmationCode: number;
  password: string;
}

export interface ChangePasswordCredentials {
  oldPassword: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
