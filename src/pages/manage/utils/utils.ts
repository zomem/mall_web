import { DeliveryType } from "@/common/constants";

//返回产品支持的物流名
export const getDeliveryName = (data: Options[], d: string) => {
  let d_list = d.split(",");
  let name: string[] = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < d_list.length; j++) {
      if (data[i].value === d_list[j]) {
        name.push(data[i].label);
      }
    }
  }
  return name.join(",");
};

// 判断当前产品，是不是支持手动物流
export const isDoDelivery = (d: string) => {
  let d_list = d.split(",");
  for (let i = 0; i < d_list.length; i++) {
    if (d_list[i] == DeliveryType.DoDelivery) {
      return true;
    }
  }
  return false;
};
