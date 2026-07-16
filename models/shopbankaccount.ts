export interface ShopBankAccountRequestBody {
  shop_id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  promptpay_id?: string;
}

export interface ShopBankAccountPatchRequest {
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  promptpay_id?: string;
  is_active?: boolean;
}

export interface ShopBankAccount {
  id: number;
  shop_id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  promptpay_id: string;
  is_active: boolean;
}

// NOTE: total_page/total_items keys are swapped due to a backend bug in
// presenters.ResponseSuccessListData (see models/shop.ts for details).
export interface Pagination {
  current_page: number;
  current_page_total_item: number;
  total_page: number;
  total_items: number;
}

export interface ShopBankAccountListResponse {
  timestamp: string;
  status: number;
  items: {
    list_data: ShopBankAccount[];
    pagination: Pagination;
  };
}

export interface ShopBankAccountDetailResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ShopBankAccount[];
}
