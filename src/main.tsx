import { useEffect, useState } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { BrowserRouter, Routes, Route } from "react-router";
import { useTheme } from "ahooks";
import zhCN from "antd/lib/locale/zh_CN";

import Manage from "@/pages/manage/Manage";
import Login from "@/pages/login/Login";
import NotFound from "@/pages/not_found/NotFound";
import Test from "@/pages/test/Test";

import { ThemeContext, UserContext, init_user } from "@/common/context";
import { THEME } from "@/common/constants";
import { CONFIG } from "@/common/fetch";

export function Main() {
  const [themeCtx, setThemeCtx] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User>(init_user);
  const { theme } = useTheme({
    localStorageKey: THEME,
  });

  useEffect(() => {
    let userinfo = JSON.parse(
      localStorage.getItem(CONFIG.ZM_USER_INFO) || "null",
    );
    if (userinfo) {
      setUser(userinfo);
    }
    setThemeCtx(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeCtx, setThemeCtx }}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm:
            themeCtx == "dark"
              ? antTheme.darkAlgorithm
              : antTheme.defaultAlgorithm,
        }}
      >
        <UserContext.Provider value={{ user, setUser }}>
          <BrowserRouter basename={CONFIG.BASE_NAME}>
            <Routes>
              <Route path="/" element={<Manage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<Test />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
