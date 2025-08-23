import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Image,
  InputNumber,
  message,
  Select,
  Badge,
  Switch,
} from "antd";

import Card from "@/components/manage/Card";
import { useUnitList } from "@/hooks/useManaApi";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import ChooseUnitAttr, {
  ChooseUnitAttrValue,
} from "@/components/manage/ChooseUnitAttr";
import { get, post, put } from "@/common/fetch";

interface UnitInfo {
  id: number;
  unit_sn: number;
  unit_name: number;
  price: number;
  quantity: number;
  product_sn: number;
  unit_cover: string;
  unit_imgs: string[];
  created_at: string;
  status: number;
  unit_attr: ChooseUnitAttrValue[];
  is_split: boolean;
  main_sale_split?: number;
  sale_split?: number;
}

interface ProductUnitProps {
  product_sn: number;
}
const ProductUnit = ({ product_sn }: ProductUnitProps) => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const [r, setR] = useState(0);

  const [show, setShow] = useState(false);

  const [form] = Form.useForm();

  // const base = useContext(BaseContext);

  const [optionAttr, setOptionAttr] = useState<Options[]>([]);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0 && product_sn > 0) {
      get(
        "/manage/mall/product/unit/list/" + product_sn + "/" + page + "/" + size
      ).then((res) => {
        setInfo(res.objects);
      });
    }
    if (product_sn == 0) {
      setInfo({
        list: [],
        total: 0,
      });
    }
  }, [product_sn, page, size, r]);

  function clearInput() {
    form.setFieldsValue({
      unit_sn: 0,
      unit_name: null,
      price: 0,
      quantity: 0,
      unit_cover: "",
      unit_imgs: [],
      unit_attr: [],
      is_split: false,
      main_sale_split: null,
      sale_split: null,
    });
  }

  function onFinish(values: any) {
    console.log("信33息。。。。", values);

    if (values.unit_attr.length > 0) {
      let primary_ids: any[] = [];
      for (let i = 0; i < values.unit_attr.length; i++) {
        primary_ids.push(values.unit_attr[i].primary_id);
      }
      let primary_ids_new = Array.from(new Set(primary_ids));
      if (primary_ids.length !== primary_ids_new.length) {
        return message.error("商品属性的一级分类不能重复");
      }
    }
    post("/manage/mall/product/unit/add", {
      product_sn: product_sn,
      unit_sn: values.unit_sn,
      unit_name: values.unit_name,
      price: values.price,
      quantity: values.quantity,
      unit_imgs: values.unit_imgs || [],
      unit_cover: values.unit_cover || "",
      unit_attr: values.unit_attr.filter((o: any) => !!o.primary_id),
      main_sale_split: values.main_sale_split,
      sale_split: values.sale_split,
      is_split: values.is_split,
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

  useEffect(() => {
    if (product_sn) {
      get("/manage/mall/product/unit_attr/" + product_sn).then((res) => {
        setOptionAttr(res.objects);
      });
    } else {
      setOptionAttr([]);
    }
  }, [r, product_sn]);

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/product/unit/status", { unit_sn: id, status }).then(
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
    put("/manage/mall/product/unit/del", { unit_sn: id }).then((res) => {
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
      width: 100,
    },
    {
      title: "商品编号",
      dataIndex: "unit_sn",
      key: "unit_sn",
      width: 120,
    },
    {
      title: "商品名",
      dataIndex: "unit_name",
      key: "unit_name",
      width: 150,
    },
    {
      title: "商品封面图",
      dataIndex: "unit_cover",
      key: "unit_cover",
      width: 120,
      render: (_r: any, i: any) => <Image src={i.unit_cover || null} />,
    },
    {
      title: "商品价格",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (_r: any, i: any) => (
        <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>¥{i.price}</div>
      ),
    },
    {
      title: "库存",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_r: any, i: any) => (
        <div style={{ color: "#52c41a", fontWeight: "bold" }}>{i.quantity}</div>
      ),
    },
    {
      title: "分成",
      dataIndex: "split",
      key: "split",
      width: 150,
      render: (_r: any, i: any) => (
        <div style={{ fontWeight: "bold" }}>
          总销售：¥{i.main_sale_split || "-"} | 销售：{i.sale_split || "-"}
        </div>
      ),
    },
    {
      title: "开启分成",
      dataIndex: "is_split",
      key: "is_split",
      width: 150,
      render: (_r: any, i: any) => (
        <div>
          <Switch disabled value={i.is_split} />
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: UnitInfo[], i: UnitInfo) => (
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
              change_status(i.unit_sn, v);
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
      render: (_r: UnitInfo[], i: UnitInfo) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 120,
      fixed: "right",
      render: (_r: UnitInfo[], i: UnitInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                unit_sn: i.unit_sn,
                unit_name: i.unit_name,
                price: i.price,
                quantity: i.quantity,
                unit_cover: i.unit_cover,
                unit_imgs: i.unit_imgs,
                unit_attr: i.unit_attr,
                main_sale_split: i.main_sale_split,
                sale_split: i.sale_split,
                is_split: i.is_split,
              });
              setShow(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.unit_sn)}
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
      <Card bg="null">
        <Button
          type="primary"
          onClick={() => {
            clearInput();
            setShow(true);
          }}
        >
          新增商品
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
        title="商品新增编辑"
        open={show}
        onCancel={() => {
          clearInput();
          setShow(false);
        }}
        width={900}
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
      >
        <Form
          name="unit"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="商品编号" name="unit_sn">
                <Input disabled placeholder="商品编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="商品名"
                name="unit_name"
                rules={[{ required: true, message: "请输入商品名" }]}
              >
                <Input placeholder="请输入商品名" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="商品价格（¥）" name="price">
                <InputNumber step={0.01} min={0.01} max={10000} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="商品数量" name="quantity">
                <InputNumber max={10000} min={0} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="总销售分成（¥）" name="main_sale_split">
                <InputNumber step={0.01} min={0.01} max={10000} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="销售分成（¥）" name="sale_split">
                <InputNumber step={0.01} min={0.01} max={10000} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="是否开启分成" name="is_split">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="商品封面图"
                name="unit_cover"
                // rules={[{ required: true, message: "请上传产品封面图" }]}
              >
                <UploadOne category={FileCategory.Unit} />
              </Form.Item>
            </Col>
            <Col span={20}>
              <Form.Item
                label="商品详情图"
                name="unit_imgs"
                // rules={[{ required: true, message: "请上传产品详情图" }]}
              >
                <UploadMult category={FileCategory.Unit} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="商品类别" name="unit_attr">
                <ChooseUnitAttr options={optionAttr} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ProductUnit;
