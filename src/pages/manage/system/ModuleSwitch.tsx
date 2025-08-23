import { useState, useContext } from "react";
import { Switch, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
// @ts-ignore
import Highlighter from "react-highlight-words";

import { ThemeContext } from "@/common/context";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import css, { Div } from "@/components/panda/css";
import { useModuleSwitchList } from "@/hooks/useManaApi";
import { put } from "@/common/fetch";

const ModuleSwitch = () => {
  const [r, setR] = useState(0);
  const { themeCtx } = useContext(ThemeContext);

  const list = useModuleSwitchList(r);

  function on_change(id: number, s: boolean) {
    put("/manage/system/module/switch_change", {
      id,
      is_on: s ? 1 : 0,
    }).then((res) => {
      if (res.status == 1) {
        message.success(res.message);
        setR(r + 1);
      } else {
        message.error(res.message);
      }
    });
  }

  return (
    <>
      <Title title="模块控制" />
      <Div
        display="flex"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        margin="10px 0 0 0"
      >
        <Card
          title="功能模块启用或关闭"
          width="auto"
          maxConHeight={"calc(100vh - 155px)"}
          margin="0 10px 0 0"
          overflowY="hidden"
          padding="8px 0 0 8px"
        >
          <div
            className={css({
              width: "540px",
              display: "flex",
              flexWrap: "wrap",
            })}
          >
            {list.map((item) => (
              <div
                key={item.id}
                className={css({
                  border:
                    themeCtx == "dark" ? "1px solid #333" : "1px solid #f2f2f2",
                  borderRadius: "8px",
                  padding: "8px",
                  width: "260px",
                  marginRight: "10px",
                  marginBottom: "10px",
                })}
              >
                <div
                  className={css({
                    fontSize: "14px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                    color:
                      themeCtx == "dark" ? "rgba(255, 255, 255, 0.85)" : "#000",
                  })}
                >
                  {item.name}
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    value={!!item.is_on}
                    onChange={(v) => {
                      on_change(item.id, v);
                    }}
                  />
                </div>
                <div
                  className={css({
                    fontSize: "13px",
                    color: "#8a8a8a",
                  })}
                >
                  {item.des}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Div>
    </>
  );
};

export default ModuleSwitch;
