export interface AuthUser {
  user_info: UserInfo;
}
export interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
  profile_url: string;
  force_password_change: boolean;
  password_retries: number;
  created_at: string;
}

export interface InitResponse {
  expires_in: string;
}
