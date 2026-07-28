export interface UserLoginRequest {
  user_name: string;
  password: string;
}

export interface UserLoginResponseItems {
  id: number;
  full_name: string;
  user_name: string;
  email?: string;
  role_id: number;
  token?: string;
}

export interface UserLoginResponse {
  timestamp: string;
  status: number;
  message: string;
  items: UserLoginResponseItems;
}

export interface UserRequestBody {
  shop_id?: number | null;
  role_id: number;
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone?: string;
  profile_image?: string;
}

export interface UserRequestBodyPatch {
  shop_id?: number | null;
  role_id?: number | null;
  username?: string | null;
  password?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  profile_image?: string;
}


export interface User {
  id: number;
  shop_id: number | null;
  role_id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// NOTE: go-echo-template's presenters.ResponseSuccessListData has a known bug
// where the "total_page" and "total_items" json keys are swapped: total_page
// actually holds the record count, total_items actually holds the page count.
export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface UserListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: User[];
    pagination: Pagination;
  };
}

// GetUserService always returns a []UserDBSchema (even for a single id lookup
// without pagination), so the non-paginated response wraps an array, not a
// single object.
export interface UserDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: User[];
}
