import { useState, useContext } from "react";
import {
  Table,
  Tag,
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
  InputNumber,
  Badge,
} from "antd";
import { Div } from "@/components/panda/css";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import ChooseMapAddr from "@/components/manage/ChooseMapAddr";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { get, post, put } from "@/common/fetch";
import { trim } from "@/utils/utils";
import { BaseContext } from "@/common/context";
import { useBrandList } from "@/hooks/useManaApi";
import SearchInput from "@/components/manage/SearchInput";

function Brand() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const base = useContext(BaseContext);

  const [r, setR] = useState(0);
  const [show, setShow] = useState(false);
  const info = useBrandList(page, size, r);
  const [form] = Form.useForm();
  const [searchOptions, setSearchOptions] = useState<Options[]>([]);

  function clearInput() {
    form.setFieldsValue({
      brand_code: 0,
      brand_des: "",
      brand_name: null,
      brand_sec_name: null,
      brand_logo: null,
      sort: 0,
      status: 0,
    });
  }

  // function onSearch(keyword: string) {
  //   if (!keyword) return;
  //   if (!trim(keyword)) return;
  //   get("/manage/mall/brand/search/" + trim(keyword)).then((res) => {
  //     setSearchOptions(res.objects);
  //   });
  // }

  function onFinish(values: any) {
    console.log("信33息。。。。", values);
    post("/manage/mall/brand/add", {
      brand_code: values.brand_code,
      brand_des: values.brand_des,
      brand_logo: values.brand_logo,
      brand_name: values.brand_name,
      brand_sec_name: values.brand_sec_name,
      sort: values.sort,
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
    put("/manage/mall/brand/status", { brand_code: id, status }).then((res) => {
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
    put("/manage/mall/brand/del", { brand_code: id }).then((res) => {
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
      title: "品牌编号",
      dataIndex: "brand_code",
      key: "brand_code",
      width: 120,
    },
    {
      title: "品牌名称",
      dataIndex: "brand_name",
      key: "brand_name",
      width: 180,
    },
    {
      title: "品牌描述",
      dataIndex: "brand_des",
      key: "brand_des",
      width: 180,
    },
    {
      title: "品牌英文名",
      dataIndex: "brand_sec_name",
      key: "brand_sec_name",
      width: 180,
    },
    {
      title: "品牌logo",
      dataIndex: "brand_logo",
      key: "brand_logo",
      width: 120,
      render: (_r: any, i: any) => <Image src={i.brand_logo || null} />,
    },
    {
      title: "品牌排序",
      dataIndex: "sort",
      key: "sort",
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
              change_status(i.brand_code, v);
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
              // if (i.brand_des) {
              //   onSearch(`${i.brand_des}`);
              // }
              form.setFieldsValue({
                brand_code: i.brand_code,
                brand_des: i.brand_des,
                brand_name: i.brand_name,
                brand_sec_name: i.brand_sec_name,
                brand_logo: i.brand_logo,
                sort: i.sort,
              });
              setShow(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.brand_code)}
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
      <Title title="品牌管理" />
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
        title="品牌新增编辑"
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
          name="brand"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="品牌编号" name="brand_code">
                <Input disabled placeholder="品牌的唯一编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="品牌名称"
                name="brand_name"
                rules={[{ required: true, message: "请输入品牌名称" }]}
              >
                {/* <SearchInput
                  options={searchOptions}
                  onSearch={(text) => onSearch(text)}
                  placeholder="输入关键字搜索品牌名称"
                /> */}
                <Input placeholder="请输入品牌名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="品牌描述" name="brand_des">
                <Input placeholder="请输入品牌描述" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="品牌英文名" name="brand_sec_name">
                <Input placeholder="请输入品牌英文名" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="排序" name="sort">
                <InputNumber placeholder="请输入排序" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="品牌logo"
                name="brand_logo"
                // rules={[{ required: true, message: "请上传产品封面图" }]}
              >
                <UploadOne category={FileCategory.Brand} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Brand;
