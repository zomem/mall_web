import { useState, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Image,
  Popconfirm,
  Badge,
  Cascader,
  InputNumber,
} from "antd";

import css from "@/components/panda/css";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import RichText from "@/components/manage/RichText";
import ChooseMapAddr from "@/components/manage/ChooseMapAddr";
import ChooseProductAttr, {
  ChooseProductAttrValue,
} from "@/components/manage/ChooseProductAttr";
import ChooseProductCat, {
  ChooseProductCatValue,
} from "@/components/manage/ChooseProductCat";
import SearchInput from "@/components/manage/SearchInput";
import UnitAttrAdd from "@/components/manage/UnitAttrAdd";

import { useProductList } from "@/hooks/useManaApi";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { BaseContext } from "@/common/context";
import { post, get, put } from "@/common/fetch";
import { message } from "antd/lib";
import { trim } from "@/utils/utils";
import ProductUnit from "@/components/manage/ProductUnit";

interface ProductInfo {
  id: number;
  store_code: number;
  product_sn: number;
  product_name: string;
  product_sec_name: string;
  product_des: string;
  product_cover_img: string;
  product_imgs: string[];
  product_brand: string | null;
  created_at: string;
  status: number;
  product_cat: ChooseProductCatValue[];
  product_attr: ChooseProductAttrValue[];
  delivery_type: string;
  addr_detail?: string;
  combined_price?: number;
  lat?: number;
  lng?: number;
  uid: string | null;
  phone: string | null;
  province: string | null;
  city: string | null;
  area: string | null;
  product_layout: string;
  sort: number;
  html: string;
  peculiarity_html: string;
}

const Product = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const base = useContext(BaseContext);

  const info = useProductList(page, size, r);

  const [show, setShow] = useState(false);
  const [searchOptions, setSearchOptions] = useState<Options[]>([]);
  const [searchUserOptions, setSearchUserOptions] = useState<Options[]>([]);

  // 产品的商品显示
  const [showUnitPsn, setShowUnitPsn] = useState(0);

  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      store_code: null,
      product_sn: 0,
      product_name: null,
      product_des: "",
      product_brand: null,
      product_imgs: "",
      product_cover_img: "",
      delivery_type: null,
      combined_price: null,
      product_cat: [],
      product_attr: [],
      addr_info: null,
      uid: null,
      province_info: null,
      product_layout: null,
    });
  }

  function onFinish(values: any) {
    console.log("信息。。。。", values);

    post("/manage/mall/product/add", {
      addr_info: values.addr_info,
      delivery_type: values.delivery_type.join(","),
      html: values.html,
      peculiarity_html: values.peculiarity_html,
      product_attr: values.product_attr.filter((o: any) => !!o.primary_id),
      product_brand: values.product_brand,
      product_cat: values.product_cat.filter((o: any) => !!o.primary_id),
      product_cover_img: values.product_cover_img || "",
      product_des: values.product_des || "",
      product_imgs: values.product_imgs || [],
      product_layout: values.product_layout,
      product_name: trim(values.product_name),
      product_sec_name: values.product_sec_name
        ? trim(values.product_sec_name)
        : null,
      product_sn: values.product_sn,
      province_info: values.province_info,
      combined_price: values.combined_price,
      sort: values.sort,
      store_code: values.store_code,
      uid: values.uid,
    }).then((res) => {
      if (res.status === 1) {
        message.success(res.message);
        setShow(false);
        clearInput();
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }

  function onSearch(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/store/search/" + trim(keyword)).then((res) => {
      setSearchOptions(res.objects);
    });
  }

  function onSearchUser(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/user/search/phone/" + trim(keyword)).then((res) => {
      setSearchUserOptions(res.objects);
    });
  }

  // function onSearchProduct(keyword: string) {
  //   if (!keyword) return;
  //   if (!trim(keyword)) return;
  //   get("/manage/mall/product/search/" + trim(keyword)).then((res) => {
  //     setSearchProduct(res.objects);
  //   });
  // }

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/product/status", { product_sn: id, status }).then(
      (res) => {
        if (res.status == 1) {
          message.success(res.message);
          setR((p) => p + 1);
        } else {
          message.error(res.message);
        }
      }
    );
  }
  // 删除
  function delete_confirm(id: number) {
    put("/manage/mall/product/del", { product_sn: id }).then((res) => {
      if (res.status == 1) {
        message.success(res.message);
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "产品编号",
      dataIndex: "product_sn",
      key: "product_sn",
      width: 120,
    },
    {
      title: "产品名称",
      dataIndex: "product_name",
      key: "product_name",
      width: 180,
    },
    {
      title: "产品英文名",
      dataIndex: "product_sec_name",
      key: "product_sec_name",
      width: 180,
    },
    {
      title: "产品封面图",
      dataIndex: "product_cover_img",
      key: "product_cover_img",
      width: 120,
      render: (r: any, i: any) => <Image src={i.product_cover_img || null} />,
    },
    {
      title: "产品价格",
      dataIndex: "combined_price",
      key: "combined_price",
      width: 120,
      render: (r: any, i: any) => (
        <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          {i.combined_price ? `¥${i.combined_price}` : "-"}
        </div>
      ),
    },
    {
      title: "关联用户手机号",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "布局方式",
      dataIndex: "product_layout",
      key: "product_layout",
      width: 150,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: ProductInfo[], i: ProductInfo) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {
            // @ts-ignore
            {
              "0": <Badge status="error" />,
              "1": <Badge status="processing" />,
              "2": <Badge status="success" />,
              "3": <Badge status="default" />,
            }[`${i.status}`]
          }
          <Select
            value={i.status}
            style={{ width: 100, marginLeft: 10 }}
            options={NormalStatusOptions}
            onChange={(v) => {
              change_status(i.product_sn, v);
            }}
          />
        </div>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (r: ProductInfo[], i: ProductInfo) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (r: ProductInfo[], i: ProductInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (i.store_code) {
                onSearch(`${i.store_code}`);
              }
              // if (i.product_name) {
              //   onSearchProduct(`${i.product_name}`);
              // }
              if (i.phone) {
                onSearchUser(i.phone);
              }
              form.setFieldsValue({
                addr_info: {
                  detail: i.addr_detail,
                  lat: i.lat,
                  lng: i.lng,
                },
                delivery_type: i.delivery_type
                  ? i.delivery_type.split(",")
                  : null,
                html: i.html,
                peculiarity_html: i.peculiarity_html,
                product_attr: i.product_attr,
                product_brand: i.product_brand,
                product_cat: i.product_cat,
                product_cover_img: i.product_cover_img,
                product_des: i.product_des,
                product_imgs: i.product_imgs,
                product_layout: i.product_layout,
                product_name: i.product_name,
                product_sec_name: i.product_sec_name,
                product_sn: i.product_sn,
                province_info: i.province ? [i.province, i.city, i.area] : null,
                sort: i.sort,
                combined_price: i.combined_price,
                store_code: i.store_code,
                uid: i.uid,
              });
              setShow(true);
            }}
          >
            编辑
          </Button>
          <a
            className={css({
              color: "#48b014 !important",
              marginLeft: "5px",
              marginRight: "5px",
              _hover: {
                color: "#59d81a !important",
              },
            })}
            onClick={() => {
              setShowUnitPsn(i.product_sn);
            }}
          >
            商品
          </a>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.product_sn)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="产品管理" />
      <Card bg="null">
        <Button
          type="primary"
          onClick={() => {
            clearInput();
            setShow(true);
          }}
        >
          新增
        </Button>
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: any) => record.id}
          columns={columns}
          dataSource={info.list}
          pagination={{
            style: { marginRight: "10px" },
            total: info.total,
            pageSize: size,
            current: page,
            showSizeChanger: true,
            onChange: (p) => {
              setPage(p);
            },
            onShowSizeChange: (p, s) => {
              setPage(p);
              setSize(s);
            },
          }}
          scroll={{ y: `calc(100vh - 223px)` }}
        />
      </Card>

      <Modal
        title="产品新增编辑"
        open={show}
        onCancel={() => {
          clearInput();
          setShow(false);
        }}
        maskClosable={false}
        width={900}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          name="product"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="所属店铺/公司" name="store_code">
                <SearchInput
                  options={searchOptions}
                  onSearch={(text) => onSearch(text)}
                  placeholder="输入关键字搜索店铺/公司"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="产品编号"
                name="product_sn"
                // rules={[{ required: true, message: "请输入产品编号" }]}
              >
                <Input disabled placeholder="产品编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="产品名称"
                name="product_name"
                rules={[{ required: true, message: "请输入产品名称" }]}
              >
                <Input placeholder="请输入产品英文名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="产品英文名"
                name="product_sec_name"
                // rules={[{ required: true, message: "请输入产品英文名" }]}
              >
                <Input placeholder="请输入产品英文名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属品牌" name="product_brand">
                <Select options={base.brand} placeholder="请选择品牌" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="布局方式"
                name="product_layout"
                // rules={[{ required: true, message: "请上选择布局方式" }]}
              >
                <Select
                  options={base.product_layout}
                  placeholder="请选择布局方式"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="产品描述"
                name="product_des"
                rules={[{ required: true, message: "请输入产品描述" }]}
              >
                <Input.TextArea placeholder="请输入产品描述" autoSize />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="物流类型"
                name="delivery_type"
                rules={[{ required: true, message: "请上选择物流类型" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择物流类型"
                  options={base.delivery_type}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="关联的用户手机号" name="uid">
                <SearchInput
                  options={searchUserOptions}
                  onSearch={(text) => {
                    if (text.length >= 6) {
                      onSearchUser(text);
                    }
                  }}
                  placeholder="输入手机号搜索"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="产品价格（¥）" name="combined_price">
                <InputNumber step={0.01} min={0.01} max={10000} />
              </Form.Item>
            </Col>
            {/* <Col span={8}></Col> */}

            <Col span={8}>
              <Form.Item label="产品详情" name="html">
                <RichText />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="产品特色" name="peculiarity_html">
                <RichText />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="产品封面图（一张）"
                name="product_cover_img"
                rules={[{ required: true, message: "请上传产品封面图" }]}
              >
                <UploadOne category={FileCategory.Product} />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                label="产品详情图（可多张）"
                name="product_imgs"
                // rules={[{ required: true, message: "请上传产品详情图" }]}
              >
                <UploadMult category={FileCategory.Product} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="产品省市区" name="province_info">
                <Cascader options={base.province} placeholder="请选择地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="产品详细地址" name="addr_info">
                <ChooseMapAddr />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="产品分类（可多选）"
                name="product_cat"
                rules={[{ required: true, message: "请选择产品分类" }]}
              >
                <ChooseProductCat />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="产品属性（可多选）（如：处理器/CPU型号：麒麟9010）"
                name="product_attr"
                rules={[{ required: true, message: "请填写产品属性" }]}
              >
                <ChooseProductAttr />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <UnitAttrAdd product_sn={form.getFieldValue("product_sn")} />
      </Modal>

      <Modal
        forceRender
        title={
          (info.list.length > 0
            ? info.list.find((o) => o.product_sn == showUnitPsn)?.product_name
            : "") + "的商品"
        }
        open={!!showUnitPsn}
        onCancel={() => setShowUnitPsn(0)}
        width="90%"
        onOk={() => setShowUnitPsn(0)}
        maskClosable={false}
      >
        <ProductUnit product_sn={showUnitPsn} />
      </Modal>
    </>
  );
};

export default Product;
