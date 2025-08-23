import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Table,
  Image,
  Popconfirm,
  Badge,
  Select,
} from "antd";
import { Div } from "@/components/panda/css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import UploadMult from "@/components/manage/UploadMult";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { get, post, CONFIG, put } from "@/common/fetch";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";

interface BannerItem {
  id: number;
  imgs: string[];
  path_urls?: string;
  name: string;
  status: number;
  color?: string;
  page?: string;
}

function Banner() {
  const [infos, setInfos] = useState({
    list: [],
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState(1);

  const [list, setList] = useState<BannerItem[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    get("/manage/common/banner/list").then((res) => {
      setList(res.objects);
      clearInput();
    });
  }, [r]);

  // /manage/banner/del

  const clearInput = () => {
    form.setFieldsValue({
      id: 0,
      img_urls: [],
      path_urls: "",
      name: "",
      page: "",
      color: "",
    });
  };

  const onShowDrawer = () => {
    setShowDrawer(true);
  };
  const onCloseDrawer = () => {
    clearInput();
    setShowDrawer(false);
  };

  const onFinish = (values: any) => {
    setLoading(true);
    post("/manage/common/banner/add", {
      id: values.id,
      img_urls: values.img_urls,
      path_urls: values.path_urls ? values.path_urls.replace(/\n/g, ",") : "",
      name: values.name,
      page: values.page,
      color: values.color || "",
    }).then((res) => {
      if (res.status === 1) {
        message.success(res.message);
        setShowDrawer(false);
        clearInput();
        setR((prev) => prev + 1);
      } else {
        message.error("操作失败");
      }
      setLoading(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/common/banner/status", { id, status }).then((res) => {
      if (res.status == 1) {
        message.success(res.message);
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }
  const delete_confirm = (i: BannerItem) => {
    put("/manage/common/banner/del", { id: i.id }).then((res) => {
      if (res.status === 1) {
        message.success("删除成功");
        setR((prev) => prev + 1);
      }
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "图片",
      dataIndex: "images",
      key: "images",
      width: 300,
      render: (r: any, i: BannerItem) => (
        <>
          {i.imgs.map((o, ix) => (
            <Div key={ix} margin="0 5px 0 0" display="inline-block">
              <Image width={56} src={o} />
            </Div>
          ))}
        </>
      ),
    },
    {
      title: "页面",
      dataIndex: "page",
      key: "page",
      width: 150,
    },
    {
      title: "跳转路径",
      dataIndex: "path_urls",
      key: "path_urls",
      width: 250,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: BannerItem[], i: BannerItem) => (
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
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 180,
      render: (r: any, i: BannerItem) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                id: i.id,
                img_urls: i.imgs,
                path_urls: i.path_urls ? i.path_urls.replace(/,/g, "\n") : "",
                name: i.name,
                page: i.page,
                color: i.color,
              });
              setShowDrawer(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i)}
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
      <Title title="Banner管理" />
      <Card bg="null">
        <Button type="primary" onClick={() => onShowDrawer()}>
          新增
        </Button>
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: BannerItem) => record.id}
          columns={columns}
          dataSource={list}
          scroll={{ y: `calc(100vh - 223px)` }}
        />
      </Card>

      <Drawer
        title="Banner新增编辑"
        placement="right"
        closable={false}
        width={430}
        onClose={onCloseDrawer}
        open={showDrawer}
      >
        <Form
          name="path"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入banner名称" }]}
          >
            <Input placeholder="请输入banner名称" />
          </Form.Item>

          <Form.Item
            label="页面"
            name="page"
            rules={[{ required: true, message: "请输入banner所在页面" }]}
          >
            <Input placeholder="哪个页面的banner" />
          </Form.Item>

          <Form.Item
            label="主色"
            name="color"
            rules={[{ required: false, message: "请输入banner的主色色值" }]}
          >
            <Input placeholder="请输入banner的主色色值" />
          </Form.Item>

          <Form.Item
            label="图片"
            name="img_urls"
            rules={[{ required: false, message: "请上传图片" }]}
          >
            <UploadMult category={FileCategory.Banner} />
          </Form.Item>

          <Form.Item label="跳转路径" name="path_urls">
            <Input.TextArea autoSize placeholder="请输入跳转路径，以换行分隔" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default Banner;
