export const VERSION = "0.5.2";
export const THEME = "THEME";

// 上传的文件的类别
export enum FileCategory {
  Banner = "banner",
  Article = "article",
  ProductCat = "product_cat",
  // 产品图
  Product = "product",
  Unit = "unit",
  UnitAttr = "unit_attr",
  Brand = "brand",
  ProductFile = "product_file",
}

// 地图key
export const AMAP_JS_KEY = "2c9de95";

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

/// 用户订单状态 1 为待支付，2 为已支付，0 为取消支付
export enum OrderStatus {
  /// 0 取消支付
  CancelPayment,
  /// 1 为待支付
  PendingPayment,
  /// 2 为已支付
  Paid,
}

/// 用户商品订单状态 0 为待发货，1 为待收货, 2 为待评价，3 为已完成
export enum OrderItemStatus {
  /// 0 为待发货
  WaitDeliverGoods,
  /// 1 为待收货
  WaitTakeDelivery,
  /// 2 为待评价
  WaitEvaluated,
  /// 3 为已完成
  Complete,
}

export enum NormalStatus {
  /// 0为审核不通过
  NotPass,
  /// 1为审核
  UnderReview,
  /// 2正常上线
  Online,
  /// 3为下架
  OffShelf,
}
export const NormalStatusOptions = [
  { label: "未通过", value: 0 },
  { label: "待审核", value: 1 },
  { label: "已上线", value: 2 },
  { label: "已下架", value: 3 },
];

// 物流状态
export enum DeliveryType {
  NoDelivery = "NO_DELIVERY",
  WxDelivery = "WX_DELIVERY",
  DoDelivery = "DO_DELIVERY",
  WxInstant = "WX_INSTANT",
  DoorPickup = "DOOR_PICKUP",
  StoreWriteOff = "STORE_WRITE_OFF",
}

export enum Role {
  /// 总销售
  MainSale = 1000,
  /// 销售
  Sale = 1001,
  /// 销售
  Agent = 2000,
  /// 无角色
  NoRoles = 0,
}
