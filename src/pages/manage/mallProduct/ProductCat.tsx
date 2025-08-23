import { useState, useEffect, useContext } from "react";
import {
  Button,
  Avatar,
  Form,
  message,
  Drawer,
  AutoComplete,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { ThemeContext } from "@/common/context";
import { get, post, put } from "@/common/fetch";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import css, { Div } from "@/components/panda/css";
import UploadOne from "@/components/manage/UploadOne";
import { FileCategory } from "@/common/constants";

interface ProductCat {
  icon: string | null;
  id: number;
  name: string;
  children: ProductCat[];
}

const ProductCat = () => {
  const [info, setInfo] = useState<ProductCat[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);

  const { themeCtx } = useContext(ThemeContext);

  const [form] = Form.useForm();
  const priName = Form.useWatch("pri_name", form);
  const secName = Form.useWatch("sec_name", form);
  const terName = Form.useWatch("ter_name", form);
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(0);

  const [selectP, setSelectP] = useState<ProductCat>({
    id: 0,
    name: "",
    icon: "",
    children: [],
  });

  const [selectS, setSelectS] = useState<ProductCat>({
    id: 0,
    name: "",
    icon: "",
    children: [],
  });

  const [selectT, setSelectT] = useState<ProductCat>({
    id: 0,
    name: "",
    icon: "",
    children: [],
  });

  const clearInput = () => {
    form.setFieldsValue({
      pri_name: "",
      sec_name: "",
      ter_name: "",
      icon: "",
    });
  };

  useEffect(() => {
    get("/manage/mall/cat/list").then((res) => {
      setInfo(res.objects);
    });
  }, [r]);

  useEffect(() => {
    form.setFieldValue("icon", "");
    if (priName) {
      let item = info.find((o) => o.name == priName);
      if (item?.icon) {
        form.setFieldValue("icon", item.icon);
      }
    }
  }, [priName]);
  useEffect(() => {
    form.setFieldValue("icon", "");
    if (secName) {
      let item = info
        .find((o) => o.name == priName)
        ?.children.find((o) => o.name == secName);
      if (item?.icon) {
        form.setFieldValue("icon", item.icon);
      }
    }
  }, [secName]);
  useEffect(() => {
    form.setFieldValue("icon", "");
    if (terName) {
      let item = info
        .find((o) => o.name == priName)
        ?.children.find((o) => o.name == secName)
        ?.children.find((o) => o.name == terName);
      if (item?.icon) {
        form.setFieldValue("icon", item.icon);
      }
    }
  }, [terName]);

  function onFinish(values: any) {
    interface ProductCatAdd {
      primary_id: number;
      secondary_id: number;
      tertiary_id: number;
      product_cat_type: "Primary" | "Secondary" | "Tertiary";
      name: string;
      icon: string | null;
    }
    let data: ProductCatAdd = {
      primary_id: -1,
      secondary_id: -1,
      tertiary_id: -1,
      product_cat_type: "Primary",
      name: "",
      icon: null,
    };
    if (!values.pri_name) {
      return message.error("一级分类不能为空");
    }
    let p_item = info.find((o) => o.name == values.pri_name);
    if (p_item) {
      data.primary_id = p_item.id;
      let s_item = p_item.children.find((o) => o.name == values.sec_name);
      if (s_item) {
        data.secondary_id = s_item.id;
        let t_item = s_item.children.find((o) => o.name == values.ter_name);
        if (t_item) {
          data.tertiary_id = t_item.id;
          data.product_cat_type = "Tertiary";
          data.name = values.ter_name;
        } else {
          if (!values.ter_name) {
            return message.error("请输入三级分类名");
          }
          data.product_cat_type = "Tertiary";
          data.name = values.ter_name;
        }
      } else {
        if (!values.sec_name) {
          return message.error("请输入二级分类名");
        }
        data.product_cat_type = "Secondary";
        data.name = values.sec_name;
      }
    } else {
      if (!values.pri_name) {
        return message.error("请输入一级分类名");
      }
      data.product_cat_type = "Primary";
      data.name = values.pri_name;
    }
    if (values.icon) {
      data.icon = values.icon;
    }
    setLoading(true);
    post("/manage/mall/cat/add", data)
      .then((res: Res<String>) => {
        setLoading(false);
        if (res.status === 1) {
          setShowDrawer(false);
          message.success("新增成功");
          setR((prev) => prev + 1);
          setSelectP({ id: 0, name: "", icon: "", children: [] });
          setSelectS({ id: 0, name: "", icon: "", children: [] });
          setSelectT({ id: 0, name: "", icon: "", children: [] });
          clearInput();
        } else {
          message.error(res.message);
        }
      })
      .catch((_e) => {
        setLoading(false);
      });
  }

  function onDel(name: string) {
    put("/manage/mall/cat/del", { name }).then((res) => {
      if (res.status === 1) {
        message.success("删除成功");
        setR((prev) => prev + 1);
        setSelectP({ id: 0, name: "", icon: "", children: [] });
        setSelectS({ id: 0, name: "", icon: "", children: [] });
        setSelectT({ id: 0, name: "", icon: "", children: [] });
        clearInput();
      } else {
        message.error(res.message);
      }
    });
  }

  return (
    <>
      <Title title="产品类别" />
      <Card bg="null">
        <Button type="primary" onClick={() => setShowDrawer(true)}>
          新增
        </Button>
      </Card>
      <Div
        display="flex"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        margin="10px 0 0 0"
      >
        <Card
          title="一级分类"
          width="260px"
          maxConHeight={"calc(100vh - 155px)"}
          margin="0 10px 0 0"
          overflowY="scroll"
          padding="8px"
        >
          {info.length > 0 &&
            info.map((item: ProductCat, index: number) => (
              <Div
                w="100%"
                borderRadius="8px"
                cursor="pointer"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                key={index}
                onClick={() => {
                  setSelectP(item);
                  setSelectS({ id: 0, name: "", icon: "", children: [] });
                  setSelectT({ id: 0, name: "", icon: "", children: [] });
                }}
                bg={
                  selectP.id === item.id
                    ? themeCtx === "dark"
                      ? "#3f739d"
                      : "#bae0ff"
                    : themeCtx === "dark"
                      ? "#3a3a3a"
                      : "#f2f2f2"
                }
                marginBottom="5px"
              >
                <Div
                  display="flex"
                  flexDir="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="5px"
                >
                  <Avatar
                    src={item.icon || null}
                    style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    Pri
                  </Avatar>
                  <Div
                    display="flex"
                    flexDir="column"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    margin="0 0 0 10px"
                    overflow="hidden"
                    color={
                      themeCtx == "dark" ? "rgba(255, 255, 255, 0.85)" : "#000"
                    }
                    fontSize="14px"
                  >
                    {item.name}
                  </Div>
                </Div>
                {selectP.id == item.id && (
                  <Popconfirm
                    title="提示"
                    description="确定删除吗？"
                    onConfirm={() => onDel(item.name)}
                    okText="删除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <div
                      className={css({ height: "100%", paddingRight: "5px" })}
                    >
                      <DeleteOutlined style={{ color: "#8a8a8a" }} />
                    </div>
                  </Popconfirm>
                )}
              </Div>
            ))}
        </Card>

        <Card
          title={"二级分类" + (selectP.id ? `【${selectP.name}】` : "")}
          width="260px"
          maxConHeight={"calc(100vh - 155px)"}
          margin="0 10px 0 0"
          padding="8px"
        >
          {selectP.children.length > 0 &&
            selectP.children.map((item: ProductCat, index: number) => (
              <Div
                w="100%"
                borderRadius="8px"
                cursor="pointer"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                key={index}
                onClick={() => {
                  setSelectS(item);
                  setSelectT({ id: 0, name: "", icon: "", children: [] });
                }}
                bg={
                  selectS.id === item.id
                    ? themeCtx === "dark"
                      ? "#3f739d"
                      : "#bae0ff"
                    : themeCtx === "dark"
                      ? "#3a3a3a"
                      : "#f2f2f2"
                }
                marginBottom="5px"
              >
                <Div
                  display="flex"
                  flexDir="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="5px"
                >
                  <Avatar
                    src={item.icon || null}
                    style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    Sec
                  </Avatar>
                  <Div
                    display="flex"
                    flexDir="column"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    margin="0 0 0 10px"
                    overflow="hidden"
                    color={
                      themeCtx == "dark" ? "rgba(255, 255, 255, 0.85)" : "#000"
                    }
                    fontSize="14px"
                  >
                    {item.name}
                  </Div>
                </Div>
                {selectS.id == item.id && (
                  <Popconfirm
                    title="提示"
                    description="确定删除吗？"
                    onConfirm={() => onDel(item.name)}
                    okText="删除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <div
                      className={css({ height: "100%", paddingRight: "5px" })}
                    >
                      <DeleteOutlined style={{ color: "#8a8a8a" }} />
                    </div>
                  </Popconfirm>
                )}
              </Div>
            ))}
        </Card>

        <Card
          title={"三级分类" + (selectS.id ? `【${selectS.name}】` : "")}
          width="260px"
          maxConHeight={"calc(100vh - 155px)"}
          margin="0 10px 0 0"
          padding="8px"
        >
          {selectS.children.length > 0 &&
            selectS.children.map((item: ProductCat, index: number) => (
              <Div
                w="100%"
                borderRadius="8px"
                cursor="pointer"
                display="flex"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                key={index}
                onClick={() => setSelectT(item)}
                bg={
                  selectT.id === item.id
                    ? themeCtx === "dark"
                      ? "#3f739d"
                      : "#bae0ff"
                    : themeCtx === "dark"
                      ? "#3a3a3a"
                      : "#f2f2f2"
                }
                marginBottom="5px"
              >
                <Div
                  display="flex"
                  flexDir="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="5px"
                >
                  <Avatar
                    src={item.icon || null}
                    style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    Ter
                  </Avatar>
                  <Div
                    display="flex"
                    flexDir="column"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    margin="0 0 0 10px"
                    overflow="hidden"
                    color={
                      themeCtx == "dark" ? "rgba(255, 255, 255, 0.85)" : "#000"
                    }
                    fontSize="14px"
                  >
                    {item.name}
                  </Div>
                </Div>
                {selectT.id == item.id && (
                  <Popconfirm
                    title="提示"
                    description="确定删除吗？"
                    onConfirm={() => onDel(item.name)}
                    okText="删除"
                    okType="danger"
                    cancelText="取消"
                  >
                    <div
                      className={css({ height: "100%", paddingRight: "5px" })}
                    >
                      <DeleteOutlined style={{ color: "#8a8a8a" }} />
                    </div>
                  </Popconfirm>
                )}
              </Div>
            ))}
        </Card>

        <Drawer
          title="产品类别新增编辑"
          placement="right"
          closable={false}
          width={430}
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
        >
          <Form
            name="path"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="一级分类"
              name="pri_name"
              rules={[{ required: true, message: "请输入一级分类名" }]}
            >
              <AutoComplete
                options={info.map((o) => ({
                  value: o.name,
                }))}
                placeholder="一级分类名"
              />
            </Form.Item>
            <Form.Item
              label="二级分类名"
              name="sec_name"
              style={{
                display:
                  info.findIndex((o) => o.name == priName) > -1 ? "" : "none",
              }}
            >
              <AutoComplete
                options={info
                  .find((o) => o.name == priName)
                  ?.children.map((o) => ({
                    value: o.name,
                  }))}
                placeholder="二级分类名"
              />
            </Form.Item>
            <Form.Item
              label="三级分类"
              name="ter_name"
              style={{
                display:
                  (
                    info.find((o) => o.name == priName) || { children: [] }
                  ).children.findIndex((o) => o.name == secName) > -1
                    ? ""
                    : "none",
              }}
            >
              <AutoComplete
                options={info
                  .find((o) => o.name == priName)
                  ?.children.find((o) => o.name == secName)
                  ?.children.map((o) => ({
                    value: o.name,
                  }))}
                placeholder="三级分类名"
              />
            </Form.Item>

            <Form.Item
              label="图标"
              name="icon"
              rules={[{ required: false, message: "请上传图片" }]}
            >
              <UploadOne category={FileCategory.ProductCat} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Div>
    </>
  );
};

export default ProductCat;
