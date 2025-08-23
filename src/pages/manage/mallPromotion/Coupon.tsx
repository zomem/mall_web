import { useState } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  message,
  Select,
  Badge,
} from "antd";
import dayjs from "dayjs";

import { Div } from "@/components/panda/css";
import SearchInput from "@/components/manage/SearchInput";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { post, get, put } from "@/common/fetch";
import { trim } from "@/utils/utils";
import {
  DATE_TIME_FORMAT,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { useCouponList } from "@/hooks/useManaApi";

function Coupon() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const [show, setShow] = useState(false);
  const [search, setSearch] = useState<Options[]>([]);
  const [form] = Form.useForm();

  const [r, setR] = useState(0);
  const info = useCouponList(page, size, r);

  function clearInput() {
    form.setFieldsValue({
      id: null,
      coupon_name: null,
      coupon_condition_id: null,
      reduce_amount: null,
      discount: null,
      coupon_num: null,
      expire_time: null,
    });
  }

  function onFinish(values: any) {
    console.log("信息。。。。", values);
    let date_time;
    if (values.expire_time) {
      date_time = values.expire_time.format(DATE_TIME_FORMAT);
    }
    // let day = values.expire_time.format(DATE_TIME_FORMAT);
    post("/manage/mall/coupon/add", {
      id: values.id,
      coupon_name: values.coupon_name,
      coupon_condition_id: values.coupon_condition_id,
      reduce_amount: values.reduce_amount,
      discount: values.discount,
      coupon_num: values.coupon_num,
      expire_time: date_time,
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

  function onSearch(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/coupon/condition/search/" + trim(keyword)).then((res) => {
      setSearch(res.objects);
    });
  }

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/coupon/status", { id: id, status }).then((res) => {
      if (res.status == 1) {
        message.success(res.message);
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }
  // 删除
  function delete_confirm(id: number) {
    put("/manage/mall/coupon/del", { id: id }).then((res) => {
      if (res.status == 1) {
        message.success(res.message);
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }

  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "优惠券名称",
      dataIndex: "coupon_name",
      key: "coupon_name",
      width: 160,
    },
    {
      title: "优惠券条件",
      dataIndex: "coupon_condition_name",
      key: "coupon_condition_name",
      width: 250,
    },
    {
      title: "优惠金额（¥）",
      dataIndex: "reduce_amount",
      key: "reduce_amount",
      width: 150,
    },
    {
      title: "折扣",
      dataIndex: "discount",
      key: "discount",
      width: 100,
    },
    {
      title: "数量",
      dataIndex: "coupon_num",
      key: "coupon_num",
      width: 150,
    },
    {
      title: "过期时间",
      dataIndex: "expire_time",
      key: "expire_time",
      width: 180,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: any[], i: any) => (
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
              change_status(i.id, v);
            }}
          />
        </div>
      ),
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
      render: (r: any[], i: any) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (i.coupon_condition_id) {
                onSearch(`${i.coupon_condition_id}`);
              }
              form.setFieldsValue({
                id: i.id,
                coupon_name: i.coupon_name,
                coupon_condition_id: i.coupon_condition_id,
                reduce_amount: i.reduce_amount,
                discount: i.discount,
                coupon_num: i.coupon_num,
                expire_time: i.expire_time ? dayjs(i.expire_time) : null,
              });
              setShow(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.id)}
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
      <Title title="优惠券" />
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
        title="优惠券新增编辑"
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
                label="条件选择"
                name="coupon_condition_id"
                rules={[{ required: true, message: "请输入规则标题" }]}
              >
                <SearchInput
                  options={search}
                  onSearch={(text) => onSearch(text)}
                  placeholder="输入关键字搜索条件"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="coupon_name"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="优惠金额（¥）" name="reduce_amount">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入优惠金额"
                  step={0.01}
                  min={0}
                  max={50000}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="折扣" name="discount">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入折扣"
                  step={0.01}
                  min={0}
                  max={1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="数量"
                name="coupon_num"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请输入数量"
                  min={0}
                  max={50000}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="过期时间"
                name="expire_time"
                rules={[{ required: true, message: "请输入过期时间" }]}
              >
                <DatePicker showTime />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
export default Coupon;
