import AllUsers from "@/pages/manage/user/AllUsers";
import RoleCredential from "@/pages/manage/user/RoleCredential";
import Roles from "@/pages/manage/user/Roles";
import RolesAdd from "@/pages/manage/user/RolesAdd";
import Banner from "@/pages/manage/common/Banner";
import FormList from "@/pages/manage/common/FormList";
import Authority from "@/pages/manage/system/Authority";
import Paths from "@/pages/manage/system/Paths";
import Role from "@/pages/manage/system/Role";
import ModuleSwitch from "@/pages/manage/system/ModuleSwitch";
import Feedback from "@/pages/manage/user/Feedback";
import ProductCat from "@/pages/manage/mallProduct/ProductCat";
import ProductAttr from "@/pages/manage/mallProduct/ProductAttr";
import Product from "@/pages/manage/mallProduct/Product";
import ProductFile from "@/pages/manage/mallProduct/ProductFile";
import Store from "@/pages/manage/mallStore/Store";
import Order from "@/pages/manage/mallOrder/Order";
import Express from "@/pages/manage/mallOrder/Express";
import Coupon from "@/pages/manage/mallPromotion/Coupon";
import CouponCondition from "@/pages/manage/mallPromotion/CouponCondition";
import Brand from "@/pages/manage/mallBrand/Brand";
import Article from "@/pages/manage/article/Article";
import ArticleCat from "@/pages/manage/article/ArticleCat";
import SaleList from "@/pages/manage/sales/SaleList";
import MainSaleList from "@/pages/manage/sales/MainSaleList";
import SaleRecords from "@/pages/manage/sales/SaleRecords";

export type PathKeyList =
  | "user/AllUsers"
  | "user/Feedback"
  | "user/Roles"
  | "user/RoleCredential"
  | "user/RolesAdd"
  | "common/Banner"
  | "common/FormList"
  | "system/Authority"
  | "system/Role"
  | "system/ModuleSwitch"
  | "system/Paths"
  | "mallProduct/Product"
  | "mallProduct/ProductCat"
  | "mallProduct/ProductAttr"
  | "mallProduct/ProductFile"
  | "mallStore/Store"
  | "mallOrder/Order"
  | "mallPromotion/Coupon"
  | "mallPromotion/CouponCondition"
  | "mallBrand/Brand"
  | "article/Article"
  | "article/ArticleCat"
  | "sales/SaleList"
  | "sales/MainSaleList"
  | "sales/SaleRecords";
interface GetPathProps {
  path: PathKeyList;
}
const GetPath = ({ path }: GetPathProps): JSX.Element => {
  return (
    <>
      {
        {
          "user/AllUsers": <AllUsers />,
          "user/Feedback": <Feedback />,
          "user/Roles": <Roles />,
          "user/RoleCredential": <RoleCredential />,
          "user/RolesAdd": <RolesAdd />,
          "common/Banner": <Banner />,
          "common/FormList": <FormList />,
          "system/Authority": <Authority />,
          "system/Paths": <Paths />,
          "system/ModuleSwitch": <ModuleSwitch />,
          "system/Role": <Role />,
          "mallProduct/Product": <Product />,
          "mallProduct/ProductCat": <ProductCat />,
          "mallProduct/ProductAttr": <ProductAttr />,
          "mallProduct/ProductFile": <ProductFile />,
          "mallStore/Store": <Store />,
          "mallOrder/Order": <Order />,
          "mallOrder/Express": <Express />,
          "mallPromotion/Coupon": <Coupon />,
          "mallPromotion/CouponCondition": <CouponCondition />,
          "mallBrand/Brand": <Brand />,
          "article/Article": <Article />,
          "article/ArticleCat": <ArticleCat />,
          "sales/SaleList": <SaleList />,
          "sales/MainSaleList": <MainSaleList />,
          "sales/SaleRecords": <SaleRecords />,
        }[path]
      }
    </>
  );
};

export default GetPath;
