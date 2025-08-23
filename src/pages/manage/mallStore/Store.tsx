import { useState, useContext } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Image,
  message,
  Cascader,
  Badge,
} from "antd";
import { Div } from "@/components/panda/css";
import css from "@/components/panda/css";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import ChooseMapAddr from "@/components/manage/ChooseMapAddr";
import Employee from "@/components/manage/Employee";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { post, put } from "@/common/fetch";
import { BaseContext } from "@/common/context";
import { useStoreList } from "@/hooks/useManaApi";

function Store() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const base = useContext(BaseContext);

  // 产品的商品显示
  const [showEmployee, setShowEmployee] = useState(0);

  const [r, setR] = useState(0);
  const [show, setShow] = useState(false);
  const info = useStoreList(page, size, r);
  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      code: 0,
      name: "",
      com_store_type: null,
      des: null,
      cover_img: null,
      imgs: [],
      addr_info: null,
      province_info: null,
    });
  }

  function onFinish(values: any) {
    console.log("信33息。。。。", values);
    post("/manage/mall/store/add", {
      code: values.code,
      name: values.name,
      com_store_type: values.com_store_type,
      des: values.des,
      cover_img: values.cover_img,
      imgs: values.imgs,
      addr_info: values.addr_info,
      province_info: values.province_info,
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

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/store/status", { code: id, status }).then((res) => {
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
    put("/manage/mall/store/del", { code: id }).then((res) => {
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
      title: "编号",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: "封面图",
      dataIndex: "cover_img",
      key: "cover_img",
      width: 120,
      render: (_r: any, i: any) => <Image src={i.cover_img || null} />,
    },
    {
      title: "图片列表",
      dataIndex: "imgs",
      key: "imgs",
      width: 250,
      render: (_r: any, i: any) => (
        <>
          {i.imgs.map((o: any, ix: number) => (
            <Div key={ix} margin="0 5px 0 0" display="inline-block">
              <Image width={56} src={o} />
            </Div>
          ))}
        </>
      ),
    },
    {
      title: "地址",
      dataIndex: "address_info",
      key: "address_info",
      width: 160,
      render: (_r: any, i: any) => (
        <div>{i.province + i.city + i.area + i.addr_detail}</div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (_r: any[], i: any) => (
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
              change_status(i.code, v);
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
      render: (_r: any, i: any) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 180,
      render: (_r: any, i: any) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                code: i.code,
                name: i.name,
                com_store_type: i.com_store_type,
                des: i.des,
                cover_img: i.cover_img,
                imgs: i.imgs,
                addr_info: {
                  detail: i.addr_detail,
                  lat: i.lat,
                  lng: i.lng,
                },
                province_info: i.province ? [i.province, i.city, i.area] : null,
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
              setShowEmployee(i.code);
            }}
          >
            员工
          </a>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.code)}
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
      <Title title="店铺/公司管理" />
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
        title="店铺/公司新增编辑"
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
          name="stroe"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="编号" name="code">
                <Input disabled placeholder="店铺公司的唯一编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="类型" name="com_store_type">
                <Select
                  options={base.com_store_type}
                  placeholder="请选择类型"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="省市区" name="province_info">
                <Cascader options={base.province} placeholder="请选择地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="详细地址" name="addr_info">
                <ChooseMapAddr />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="封面图"
                name="cover_img"
                // rules={[{ required: true, message: "请上传产品封面图" }]}
              >
                <UploadOne category={FileCategory.Unit} />
              </Form.Item>
            </Col>
            <Col span={20}>
              <Form.Item
                label="展示图片"
                name="imgs"
                // rules={[{ required: true, message: "请上传产品详情图" }]}
              >
                <UploadMult category={FileCategory.Unit} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="介绍" name="des">
                <Input.TextArea placeholder="请输入店铺介绍" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        forceRender
        title={
          (info.list.length > 0
            ? info.list.find((o) => o.code == showEmployee)?.name
            : "") + "的员工"
        }
        open={!!showEmployee}
        onCancel={() => setShowEmployee(0)}
        width="90%"
        onOk={() => setShowEmployee(0)}
        maskClosable={false}
      >
        <Employee code={showEmployee} />
      </Modal>
    </>
  );
}

export default Store;
