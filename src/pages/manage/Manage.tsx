import { useState, useEffect, useContext, Suspense } from "react";
import { Switch, MenuProps, Menu, Empty, Affix, Flex } from "antd";
import { useTheme } from "ahooks";

import css from "@/components/panda/css";
import { useBaseInfo, useMenuList } from "@/hooks/useManaApi";
import { UserContext } from "@/common/context";
import UserInfo from "@/components/manage/UserInfo";
import GetPath, { PathKeyList } from "@/components/manage/GetPath";
import { ThemeContext, BaseContext } from "@/common/context";
import { THEME } from "@/common/constants";
import { MoonSvg, SunSvg } from "@/components/Icons";

// const socket = new WebSocket("ws://localhost:3060/ws");
const Manage = () => {
  const user_context = useContext(UserContext);
  const items = useMenuList();
  const [current, setCurrent] = useState<PathKeyList | null>(null);

  const base = useBaseInfo();
  const { themeCtx, setThemeCtx } = useContext(ThemeContext);
  // const { darkAlgorithm, defaultAlgorithm, getDesignToken } = theme;
  // const token =
  //   themeCtx == "dark"
  //     ? getDesignToken({
  //         algorithm: darkAlgorithm,
  //       })
  //     : getDesignToken({
  //         algorithm: defaultAlgorithm,
  //       });

  const { setThemeMode } = useTheme({ localStorageKey: THEME });

  const onSelectItem: MenuProps["onClick"] = (e) => {
    setCurrent(e.key as PathKeyList);
  };

  // useEffect(() => {
  //   socket.onopen = () => {
  //     console.log("WebSocket连接已建立1111"); // 在握手阶段添加Authorization头
  //     socket.send("Authorization: Bearer " + "1111");
  //   };

  //   socket.onmessage = (e) => {
  //     console.log("socket 收到：", e);
  //   };

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  // 修改主题
  function changeTheme(value: boolean) {
    if (value) {
      setThemeCtx("dark");
      setThemeMode("dark");
    } else {
      setThemeCtx("light");
      setThemeMode("light");
    }
  }

  return (
    <>
      {/* <div
        onClick={() => {
          socket.send("abc");
        }}
      >
        3333
      </div> */}
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: themeCtx == "dark" ? "#000" : "#f6f6f6",
        })}
      >
        <div
          className={css({
            width: "206px",
            height: "100%",
            backgroundColor: themeCtx == "dark" ? "#141414" : "#fff",
          })}
        >
          <UserInfo />
          <div
            className={css({
              height: "calc(100% - 54px)",
              overflowY: "scroll",
              overflowX: "hidden",
            })}
          >
            <Menu
              onClick={onSelectItem}
              style={{ borderInlineEnd: "none" }}
              selectedKeys={[current || ""]}
              mode="inline"
              items={items}
            />
          </div>
        </div>
        <BaseContext.Provider value={base}>
          {items.length > 0 ? (
            <div
              className={css({
                width: "calc(100vw - 206px)",
                height: "100%",
                padding: "10px 10px 10px 10px",
              })}
            >
              {current && <GetPath path={current} />}
            </div>
          ) : (
            <div
              className={css({
                width: "calc(100vw - 206px)",
                height: "100%",
                padding: "10px 10px 10px 10px",
              })}
            >
              {!user_context.user.authority && <Empty description="权限不足" />}
            </div>
          )}
        </BaseContext.Provider>
      </div>

      <div
        className={css({
          position: "fixed",
          top: "12px",
          right: "20px",
        })}
      >
        <Switch
          checked={themeCtx == "dark" ? true : false}
          onChange={changeTheme}
          checkedChildren={
            <div
              style={{
                boxSizing: "border-box",
                width: "18px",
                height: "18px",
                paddingTop: "2px",
              }}
            >
              <MoonSvg />
            </div>
          }
          unCheckedChildren={
            <div
              style={{
                boxSizing: "border-box",
                width: "18px",
                height: "18px",
                paddingTop: "2px",
              }}
            >
              <SunSvg />
            </div>
          }
          defaultChecked
        />
      </div>
    </>
  );
};

export default Manage;
