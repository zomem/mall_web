import { createContext, Dispatch, SetStateAction } from "react";

export const ThemeContext = createContext<{
  themeCtx: "light" | "dark";
  setThemeCtx: Dispatch<SetStateAction<"light" | "dark">>;
}>({
  themeCtx: "light",
  setThemeCtx: () => {},
});

export const init_user: User = {
  id: 0,
  username: "",
  nickname: "",
  authority: "",
  avatar_url: "",
  gender: 0,
  phone: "",
  role: "",
  token: "",
};
export const UserContext = createContext<{
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}>({
  user: init_user,
  // @ts-ignore
  setUser: (value: any) => {},
});

const init_base: Base = {
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
};
export const BaseContext = createContext<Base>(init_base);
