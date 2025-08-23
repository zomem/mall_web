import { useState, useContext } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Cascader,
  message,
} from "antd";

import { BaseContext } from "@/common/context";
import { post, get } from "@/common/fetch";
import { trim } from "@/utils/utils";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import SearchInput from "@/components/manage/SearchInput";
import {
  useCouponConditionList,
  CouponCondition as CouponConditionItem,
} from "@/hooks/useManaApi";

function CouponCondition() {
  const base = useContext(BaseContext);
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const [show, setShow] = useState(false);
  const [searchStore, setSearchStore] = useState<Options[]>([]);
  const [searchProduct, setSearchProduct] = useState<Options[]>([]);
  const [searchUnit, setSearchUnit] = useState<Options[]>([]);
  const [form] = Form.useForm();

  const [r, setR] = useState(0);

  const info = useCouponConditionList(page, size, r);

  function clearInput() {
    form.setFieldsValue({
      id: null,
      title: null,
      store_code: null,
      product_sn: null,
      unit_sn: null,
      full_amount: null,
      product_brand: null,
      product_cat: null,
    });
  }
  function onFinish(values: any) {
    console.log("信息。。。。", values);
    if (
      !values.full_amount &&
      !values.product_brand &&
      !values.product_sn &&
      !values.store_code &&
      !values.product_cat &&
      !values.unit_sn
    ) {
      return message.error("至少需要输入一个条件");
    }

    post("/manage/mall/coupon/condition/add", {
      id: values.id,
      full_amount: values.full_amount,
      product_brand: values.product_brand,
      product_cat: values.product_cat
        ? values.product_cat.length > 0
          ? values.product_cat.toString()
          : null
        : null,
      product_sn: values.product_sn,
      store_code: values.store_code,
      title: values.title,
      unit_sn: values.unit_sn,
    }).then((res: Res<string>) => {
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
  function onSearchStore(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/store/search/" + trim(keyword)).then((res) => {
      setSearchStore(res.objects);
    });
  }
  function onSearchProduct(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/product/search/" + trim(keyword)).then((res) => {
      setSearchProduct(res.objects);
    });
  }
  function onSearchUnit(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/product/unit/search/" + trim(keyword)).then((res) => {
      setSearchUnit(res.objects);
    });
  }

  // 删除
  function delete_confirm(item: CouponConditionItem) {}
  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "满多少（¥）",
      dataIndex: "full_amount",
      key: "full_amount",
      width: 150,
    },
    {
      title: "为哪个店铺ID",
      dataIndex: "store_code",
      key: "store_code",
      width: 150,
    },
    {
      title: "为哪个品牌ID",
      dataIndex: "product_brand",
      key: "product_brand",
      width: 150,
    },
    {
      title: "为哪个产品类别ID",
      dataIndex: "product_cat",
      key: "product_cat",
      width: 150,
    },
    {
      title: "为哪个产品ID",
      dataIndex: "product_sn",
      key: "product_sn",
      width: 150,
    },
    {
      title: "为哪个商品ID",
      dataIndex: "unit_sn",
      key: "unit_sn",
      width: 150,
    },
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (r: any, i: any) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 180,
      render: (r: CouponConditionItem[], i: CouponConditionItem) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (i.store_code) {
                onSearchStore(`${i.store_code}`);
              }
              if (i.product_sn) {
                onSearchProduct(`${i.product_sn}`);
              }
              if (i.unit_sn) {
                onSearchUnit(`${i.unit_sn}`);
              }
              form.setFieldsValue({
                id: i.id,
                title: i.title,
                store_code: i.store_code,
                product_sn: i.product_sn,
                unit_sn: i.unit_sn,
                full_amount: i.full_amount,
                product_brand: i.product_brand,
                product_cat: i.product_cat,
              });
              setShow(true);
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="优惠券条件管理" />
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
          rowKey={(record) => record.id}
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
        title="优惠券条件新增编辑"
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
          name="product"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="ID" name="id">
                <Input disabled defaultValue={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: "请输入条件标题" }]}
              >
                <Input placeholder="请输入条件标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="满多少时触发" name="full_amount">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入满减金额"
                  step={0.01}
                  min={0}
                  max={50000}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="为哪个店铺/公司时触发" name="store_code">
                <SearchInput
                  options={searchStore}
                  onSearch={(text) => onSearchStore(text)}
                  placeholder="输入关键字搜索店铺/公司"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="为哪个品牌时触发" name="product_brand">
                <Select
                  options={base.brand}
                  placeholder="请选择品牌"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="为哪个产品类别时触发" name="product_cat">
                <Cascader
                  options={base.product_cat}
                  changeOnSelect
                  placeholder="请选择产品类别"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="为哪个产品时触发" name="product_sn">
                <SearchInput
                  options={searchProduct}
                  onSearch={(text) => onSearchProduct(text)}
                  placeholder="输入关键字搜索产品"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="为哪个商品时触发" name="unit_sn">
                <SearchInput
                  options={searchUnit}
                  onSearch={(text) => onSearchUnit(text)}
                  placeholder="输入关键字搜索产品"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default CouponCondition;
