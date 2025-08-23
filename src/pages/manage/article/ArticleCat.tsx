import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Popconfirm,
  Badge,
  InputNumber,
  Image,
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import {
  NormalStatus,
  FileCategory,
  NormalStatusOptions,
} from "@/common/constants";
import { post, get, put } from "@/common/fetch";
import { message } from "antd/lib";

interface ArticleCatInfo {
  id: number;
  name: string;
  icon: string;
  status: number;
  sort: number;
  created_at: string;
}

const ArticleCat = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });

  const [show, setShow] = useState(false);

  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      id: 0,
      name: "",
      sort: 0,
      icon: "",
    });
  }

  useEffect(() => {
    if (page > 0) {
      get("/manage/article/article_cat/list/" + page + "/" + size).then(
        (res) => {
          setInfo(res.objects);
        }
      );
    }
  }, [page, size, r]);

  function onFinish(values: any) {
    console.log("信息。。。。", values);
    post("/manage/article/article_cat/add", {
      name: values.name,
      id: values.id,
      sort: values.sort,
      icon: values.icon,
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
    put("/manage/article/article_cat/status", { id, status }).then((res) => {
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
    put("/manage/article/article_cat/del", { id }).then((res) => {
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
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 220,
    },
    {
      title: "封面图",
      dataIndex: "icon",
      key: "icon",
      width: 120,
      render: (_r: any, i: any) => <Image src={i.icon || null} />,
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
      render: (r: ArticleCatInfo[], i: ArticleCatInfo) => (
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
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (r: ArticleCatInfo[], i: ArticleCatInfo) => (
        <div>{i.created_at}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (r: ArticleCatInfo[], i: ArticleCatInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                id: i.id,
                name: i.name,
                sort: i.sort,
                icon: i.icon,
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
      <Title title="分类管理" />
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
        title="分类新增编辑"
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
              <Form.Item label="分类ID" name="id">
                <Input disabled placeholder="文章编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="类别名"
                name="name"
                rules={[{ required: true, message: "请输入类别名" }]}
              >
                <Input placeholder="请输入类别名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="排序（数值越大，越靠前）" name="sort">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="封面图" name="icon">
                <UploadOne category={FileCategory.Article} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ArticleCat;
