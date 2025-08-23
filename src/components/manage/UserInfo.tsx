import { useContext } from "react";
import { useNavigate } from "react-router";
import { Popconfirm } from "antd";

import { init_user } from "@/common/context";
import css from "@/components/panda/css";
import { CONFIG } from "@/common/fetch";
import { VERSION } from "@/common/constants";
import { UserContext } from "@/common/context";
import { ThemeContext } from "@/common/context";

const UserInfo = () => {
  const { themeCtx } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user_context = useContext(UserContext);
  // 退出登录
  const loginout = () => {
    localStorage.setItem(CONFIG.ZM_USER_INFO, JSON.stringify(init_user));
    localStorage.setItem(CONFIG.ZM_LOGIN_TOKEN, "");
    user_context.setUser(init_user);
    navigate("/login");
  };

  return (
    <div
      className={css({
        width: "100%",
        height: "53px",
        boxSizing: "border-box",
        padding: "6px 15px",
        backgroundColor: themeCtx === "dark" ? "#141414" : "white",
        borderBottom:
          themeCtx === "dark" ? "1px solid #2a2a2a" : "1px solid #f2f2f2",
      })}
    >
      <div
        className={css({
          fontSize: "14px",
          color: themeCtx === "dark" ? "rgba(255, 255, 255, 0.85)" : "#000",
        })}
      >
        管理后台 v{VERSION}
      </div>
      <Popconfirm
        title="提示"
        description="确定退出登录吗？"
        onConfirm={loginout}
        okText="退出"
        okType="danger"
        cancelText="取消"
      >
        <div
          className={css({
            fontSize: "14px",
            cursor: "pointer",
            color: "#1677ff",
          })}
        >
          {user_context.user.nickname}
        </div>
      </Popconfirm>
    </div>
  );
};

export default UserInfo;
