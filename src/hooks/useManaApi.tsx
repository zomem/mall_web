import { useEffect, useState } from "react";
import { MenuProps } from "antd";

import ExcIcons from "@/components/iconsList/excIcons";
import { get } from "@/common/fetch";

type MenuItem = Required<MenuProps>["items"][number];

export const useMenuList = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  useEffect(() => {
    get("/manage/system/menu/list").then((res) => {
      let items_list: MenuItem[] = [];
      for (let i = 0; i < res.objects.length; i++) {
        let sub_i: MenuItem[] = [];
        for (let j = 0; j < res.objects[i].sub_list.length; j++) {
          sub_i.push(
            getItem(
              res.objects[i].sub_list[j].sub_name,
              res.objects[i].sub_list[j].sub_path
            )
          );
        }
        items_list.push(
          getItem(
            res.objects[i].name,
            res.objects[i].path,
            <ExcIcons name={res.objects[i].icon_name} />,
            sub_i
          )
        );
      }
      setItems(items_list);
    });
  }, []);

  return items;
};

export const useAllUsers = (page: number, size: number) => {
  const [info, setInfo] = useState<PagData<UserItem[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/user/all_users/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size]);

  return info;
};

export const useFeedback = (page: number, size: number) => {
  const [info, setInfo] = useState<PagData<FeedbackRes[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/user/feedback/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size]);

  return info;
};

export const useBaseInfo = () => {
  const [info, setInfo] = useState<Base>({
    com_store_type: [],
    unit_attr: [],
    product_cat: [],
    product_attr: [],
    brand: [],
    province: [],
    delivery_type: [],
    delivery: [],
    product_layout: [],
    article_cat: [],
    roles: [],
  });
  useEffect(() => {
    get("/manage/common/base_info").then((res) => {
      setInfo(res.objects);
    });
  }, []);

  return info;
};

export const useProductList = (page: number, size: number, r: number) => {
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/product/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  return info;
};

export const useUnitList = (
  product_sn: number,
  page: number,
  size: number,
  r: number
) => {
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0 && product_sn > 0) {
      get(
        "/manage/mall/product/unit/list/" + product_sn + "/" + page + "/" + size
      ).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [product_sn, page, size, r]);

  return info;
};

export interface StoreInfo {
  id: number;
  code: number;
  name: string;
  des: string | null;
  cover_img: string | null;
  imgs: string[] | null;
  province: string | null;
  city: string | null;
  area: string | null;
  addr_detail: string | null;
  lat: number | null;
  lng: number | null;
  com_store_type: number | null;
  status: number;
  created_at: String;
}
export const useStoreList = (page: number, size: number, r: number) => {
  const [info, setInfo] = useState<PagData<StoreInfo[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/store/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  return info;
};

export interface CouponCondition {
  id: number;
  full_amount: number | null;
  product_brand: number | null;
  product_cat: string | null;
  product_sn: number | null;
  store_code: number | null;
  title: string;
  unit_sn: number | null;
  created_at: string;
}
export const useCouponConditionList = (
  page: number,
  size: number,
  r: number
) => {
  const [info, setInfo] = useState<PagData<CouponCondition[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/coupon/condition/list/" + page + "/" + size).then(
        (res) => {
          setInfo(res.objects);
        }
      );
    }
  }, [page, size, r]);

  return info;
};

export interface Coupon {
  id: number;
  coupon_name: string;
  coupon_condition_id: number;
  coupon_condition_name: string;
  reduce_amount: number | null;
  discount: number | null;
  coupon_num: number;
  expire_time: string | null;
  status: number;
  created_at: string;
}
export const useCouponList = (page: number, size: number, r: number) => {
  const [info, setInfo] = useState<PagData<Coupon[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/coupon/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  return info;
};

export interface ModuleSwitch {
  id: number;
  name: string;
  is_on: number;
  des: string | null;
}
export const useModuleSwitchList = (r: number) => {
  const [info, setInfo] = useState<ModuleSwitch[]>([]);
  useEffect(() => {
    get("/manage/system/module/switch_list").then((res) => {
      setInfo(res.objects);
    });
  }, [r]);

  return info;
};

//品牌管理

export const useBrandList = (page: number, size: number, r: number) => {
  const [info, setInfo] = useState<PagData<StoreInfo[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/brand/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  return info;
};

//产品文件

export const useProductFileFileList = (
  page: number,
  size: number,
  r: number
) => {
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/mall/product_file/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  return info;
};

//获取表单列表
export const useQueList = (page: number, size: number) => {
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get("/manage/que_form/que/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size]);

  return info;
};

//单个表单回答列表
export const useQueAnsList = (form_id: number, page: number, size: number) => {
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0 && form_id > 0) {
      get(
        "/manage/que_form/ans/list/" + form_id + "/" + page + "/" + size
      ).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [form_id, page, size]);

  return info;
};
