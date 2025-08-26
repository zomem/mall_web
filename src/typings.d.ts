declare module "*.svg";
declare module "*.png";
declare module "*.css";

interface Options {
  label: string;
  value: string | number;
  children?: Options[];
}

interface Res<T> {
  status: number;
  message: string;
  objects: T;
}
interface PagData<T> {
  total: number;
  list: T;
}
interface Base {
  com_store_type: Options[];
  unit_attr: Options[];
  product_cat: Options[];
  product_attr: Options[];
  brand: Options[];
  province: Options[];
  delivery_type: Options[];
  delivery: Options[];
  product_layout: Options[];
  article_cat: Options[];
  roles: Options[];
}

interface User {
  authority: string;
  avatar_url: string;
  gender: number;
  id: number;
  nickname: string;
  phone: string | null;
  role: string;
  token: string;
  username: string;
}

/// 管理后台，用记列表
interface UserItem {
  id: number;
  username: string;
  nickname: string;
  avatar_url: string;
  gender: 0 | 1 | 2;
}
interface FeedbackRes {
  id: number;
  nickname: string;
  imgs: string[];
  content: string;
  created_at: string;
}

interface UnitAttrInfo {
  primary_name: string;
  secondary_name: string;
}

interface Credential {
  id: number;
  uid: number;
  nickname: string;
  phone: string;
  gender: number;
  title: string;
  role: string;
  role_name: string;
  content: string;
  imgs: string[];
  reason: string;
  status: number;
  created_at: string;
}

interface WithdrawRequest {
  id: number;
  avatar_url: string;
  nickname: string;
  req_amount: number;
  status: number;
  created_at: string;
  updated_at: string;
}
