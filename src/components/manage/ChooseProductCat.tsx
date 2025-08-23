import { useContext } from "react";
import { Cascader, Popconfirm } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import css from "@/components/panda/css";

import { BaseContext } from "@/common/context";

export interface ChooseProductCatValue {
  primary_id: number;
  primary_name: string;
  secondary_id: number;
  secondary_name: string;
  tertiary_id: number;
  tertiary_name: string;
}
interface ChooseProductCatProps {
  value?: ChooseProductCatValue[];
  onChange?: (v: ChooseProductCatValue[]) => void;
}
const ChooseProductCat = ({
  value = [],
  onChange = () => {},
}: ChooseProductCatProps) => {
  const base = useContext(BaseContext);
  const init = [
    {
      primary_id: 0,
      primary_name: "",
      secondary_id: 0,
      secondary_name: "",
      tertiary_id: 0,
      tertiary_name: "",
    },
  ];
  return (
    <div>
      {(value.length > 0 ? value : init).map((item, index) => (
        <div key={index} className={css({ display: "block" })}>
          {index > 0 && (
            <div className={css({ width: "100%", height: "8px" })} />
          )}
          <div
            className={css({
              display: "flex",
              flexDir: "row",
              justifyContent: "space-between",
              alignItems: "center",
            })}
          >
            <Cascader
              value={
                item.primary_id == 0 ||
                item.secondary_id == 0 ||
                item.tertiary_id == 0
                  ? []
                  : [item.primary_id, item.secondary_id, item.tertiary_id]
              }
              options={base.product_cat}
              onChange={(v) => {
                if (!v) return;
                let p_item = base.product_cat.find((o) => o.value == v[0]);
                if (p_item && p_item.children) {
                  let s_item = p_item.children.find((o) => o.value == v[1]);
                  if (s_item && s_item.children) {
                    let t_item = s_item.children.find((o) => o.value == v[2]);
                    if (t_item) {
                      let temp = value.length == 0 ? init : [...value];
                      temp[index].primary_id = p_item.value as number;
                      temp[index].primary_name = p_item.label;
                      temp[index].secondary_id = s_item.value as number;
                      temp[index].secondary_name = s_item.label;
                      temp[index].tertiary_id = t_item.value as number;
                      temp[index].tertiary_name = t_item.label;
                      onChange(temp);
                    }
                  }
                }
              }}
              placeholder="请选择"
            />
            <div className={css({ width: "20px" })} />
            <div
              className={css({ cursor: "pointer" })}
              onClick={() => {
                let temp = value.length == 0 ? init : [...value];
                temp.push({
                  primary_id: 0,
                  primary_name: "",
                  secondary_id: 0,
                  secondary_name: "",
                  tertiary_id: 0,
                  tertiary_name: "",
                });
                onChange(temp);
              }}
            >
              <PlusCircleOutlined
                style={{ fontSize: "18px", color: "#1677ff" }}
              />
            </div>
            <div className={css({ width: "20px" })} />
            <Popconfirm
              title="提示"
              description="确定删除该条记录吗？"
              onConfirm={() => {
                let temp = [...value];
                if (temp.length <= 1) return;
                temp.splice(index, 1);
                onChange(temp);
              }}
              okText="删除"
              okType="danger"
              cancelText="取消"
            >
              <div className={css({ cursor: "pointer" })}>
                <MinusCircleOutlined
                  style={{ fontSize: "18px", color: "#ff4d4f" }}
                />
              </div>
            </Popconfirm>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChooseProductCat;
