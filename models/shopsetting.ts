export interface ShopSettingRequestBody {
  shop_id: number;
  currency?: string;
  vat_rate?: number;
  auto_reply_msg?: string;
  business_hours?: string;
}

export interface ShopSettingPatchRequest {
  currency?: string;
  vat_rate?: number;
  auto_reply_msg?: string;
  business_hours?: string;
}

export interface ShopSetting {
  id: number;
  shop_id: number;
  currency: string;
  vat_rate: number;
  auto_reply_msg: string;
  business_hours: string;
  created_at: string;
  updated_at: string;
}

export interface ShopSettingResponse {
  timestamp: string;
  status: number;
  message: string;
  items: ShopSetting;
}
