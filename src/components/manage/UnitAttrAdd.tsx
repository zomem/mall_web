import { get, post, put } from "@/common/fetch";
import { Avatar, Form, Modal, message, Popconfirm, AutoComplete } from "antd";
import { Fragment, useEffect, useState, useContext } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import css, { Div } from "@/components/panda/css";
import UploadOne from "@/components/manage/UploadOne";
import { FileCategory } from "@/common/constants";
import { ThemeContext } from "@/common/context";

interface ProductCat {
  icon: string | null;
  id: number;
  name: string;
  children: ProductCat[];
}

interface UnitAttrAddProps {
  product_sn: number;
}
const UnitAttrAdd = ({ product_sn }: UnitAttrAddProps) => {
  const [info, setInfo] = useState<ProductCat[]>([]);
  const [show, setShow] = useState(false);
  const [r, setR] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const { themeCtx } = useContext(ThemeContext);

  const [form] = Form.useForm();
  const priName = Form.useWatch("pri_name", form);
  const secName = Form.useWatch("sec_name", form);

  const clearInput = () => {
    form.setFieldsValue({
      pri_name: "",
      sec_name: "",
      icon: "",
    });
  };

  useEffect(() => {
    if (product_sn) {
      get("/manage/mall/attr/unit/list/" + product_sn).then((res) => {
        setInfo(res.objects);
      });
    } else {
      setInfo([]);
    }
  }, [r, product_sn]);

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

  function onFinish(values: any) {
    interface UnitAttrAdd {
      product_sn: number;
      primary_id: number;
      secondary_id: number;
      product_attr_type: "Primary" | "Secondary";
      name: string;
      icon: string | null;
    }
    if (!product_sn) {
      return message.error("请先选择产品");
    }
    let data: UnitAttrAdd = {
      product_sn: product_sn,
      primary_id: -1,
      secondary_id: -1,
      product_attr_type: "Primary",
      name: "",
      icon: null,
    };
    if (!values.pri_name) {
      return message.error("一级分类不能为空");
    }
    let p_item = info.find((o) => o.name == values.pri_name);
    if (p_item) {
      data.primary_id = p_item.id;
      if (!values.sec_name) {
        return message.error("请输入二级分类名");
      }
      data.product_attr_type = "Secondary";
      data.name = values.sec_name;
    } else {
      if (!values.pri_name) {
        return message.error("请输入一级分类名");
      }
      data.product_attr_type = "Primary";
      data.name = values.pri_name;
    }
    if (values.icon) {
      data.icon = values.icon;
    }
    setLoading(true);
    post("/manage/mall/attr/unit/add", data)
      .then((res: Res<String>) => {
        setLoading(false);
        if (res.status === 1) {
          setShow(false);
          message.success("新增成功");
          setR((prev) => prev + 1);
          setSelectP({ id: 0, name: "", icon: "", children: [] });
          setSelectS({ id: 0, name: "", icon: "", children: [] });
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
    put("/manage/mall/attr/unit/del", { name }).then((res) => {
      if (res.status === 1) {
        message.success("删除成功");
        setR((prev) => prev + 1);
        setSelectP({ id: 0, name: "", icon: "", children: [] });
        setSelectS({ id: 0, name: "", icon: "", children: [] });
        clearInput();
      } else {
        message.error(res.message);
      }
    });
  }

  return (
    <Fragment>
      <div className={css({ width: "100%" })}>
        <div className={css({ width: "100%", marginBottom: "8px" })}>
          产品的商品分类（如：机身颜色 - 红色、蓝色、黑色）
        </div>
        <div
          style={{
            width: "auto",
            boxSizing: "border-box",
            padding: "10px 10px 5px 10px",
            borderRadius: "8px",
            display: "flex",
            flexWrap: "wrap",
            backgroundColor: themeCtx == "dark" ? "#000" : "#f6f6f6",
          }}
        >
          {info.length > 0 &&
            info.map((item: ProductCat, index: number) => (
              <div
                key={index}
                className={css({
                  marginBottom: "5px",
                  backgroundColor: themeCtx == "dark" ? "#141414" : "#fff",
                  padding: "5px",
                  borderRadius: "8px",
                  marginRight: "5px",
                })}
              >
                <Div
                  w="100%"
                  cursor="pointer"
                  display="flex"
                  flexDir="row"
                  borderRadius="8px"
                  justifyContent="space-between"
                  alignItems="center"
                  onClick={() => {
                    setSelectP(item);
                    setSelectS({ id: 0, name: "", icon: "", children: [] });
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
                      1
                    </Avatar>
                    <Div
                      display="flex"
                      flexDir="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      margin="0 0 0 10px"
                      overflow="hidden"
                      color={
                        themeCtx == "dark"
                          ? "rgba(255, 255, 255, 0.85)"
                          : "#000"
                      }
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
                        <DeleteOutlined style={{ color: "#999" }} />
                      </div>
                    </Popconfirm>
                  )}
                </Div>
                <Div height="5px" />

                <div className={css({ marginLeft: "20px" })}>
                  {item.children.length > 0 &&
                    item.children.map((item2: ProductCat, index2: number) => (
                      <Fragment key={index2}>
                        <Div
                          w="100%"
                          cursor="pointer"
                          display="flex"
                          flexDir="row"
                          borderRadius="8px"
                          justifyContent="space-between"
                          alignItems="center"
                          onClick={() => {
                            setSelectP(item);
                            setSelectS(item2);
                          }}
                          bg={
                            selectS.id === item2.id
                              ? themeCtx === "dark"
                                ? "#3f739d"
                                : "#bae0ff"
                              : themeCtx === "dark"
                              ? "#3a3a3a"
                              : "#f2f2f2"
                          }
                        >
                          <Div
                            display="flex"
                            flexDir="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            padding="5px"
                          >
                            <Avatar
                              src={item2.icon || null}
                              style={{
                                color: "#f56a00",
                                backgroundColor: "#fde3cf",
                              }}
                            >
                              2
                            </Avatar>
                            <Div
                              display="flex"
                              flexDir="column"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              margin="0 0 0 10px"
                              overflow="hidden"
                              color={
                                themeCtx == "dark"
                                  ? "rgba(255, 255, 255, 0.85)"
                                  : "#000"
                              }
                            >
                              {item2.name}
                            </Div>
                          </Div>
                          {selectS.id == item2.id ? (
                            <Popconfirm
                              title="提示"
                              description="确定删除吗？"
                              onConfirm={() => onDel(item2.name)}
                              okText="删除"
                              okType="danger"
                              cancelText="取消"
                            >
                              <div
                                className={css({
                                  height: "100%",
                                  paddingRight: "5px",
                                })}
                              >
                                <DeleteOutlined style={{ color: "#999" }} />
                              </div>
                            </Popconfirm>
                          ) : (
                            <div
                              className={css({
                                height: "100%",
                                paddingRight: "5px",
                              })}
                            >
                              <DeleteOutlined style={{ opacity: "0" }} />
                            </div>
                          )}
                        </Div>
                        <Div height="5px" />
                      </Fragment>
                    ))}
                </div>
              </div>
            ))}

          <div
            className={css({
              width: "80px",
              marginBottom: "5px",
              backgroundColor: themeCtx == "dark" ? "#303030" : "#fff",
              padding: "10px",
              borderRadius: "8px",
              marginRight: "5px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            })}
            onClick={() => setShow(true)}
          >
            <EditOutlined style={{ color: "#1677ff" }} />
          </div>
        </div>
      </div>
      <Modal
        maskClosable={false}
        onCancel={() => setShow(false)}
        open={show}
        confirmLoading={loading}
        title="产品的商品分类"
        okText="提交"
        onOk={() => {
          form.submit();
        }}
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
            label="图标"
            name="icon"
            rules={[{ required: false, message: "请上传图片" }]}
          >
            <UploadOne category={FileCategory.UnitAttr} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UnitAttrAdd;
