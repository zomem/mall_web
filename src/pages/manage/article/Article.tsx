import { useState, useContext, useEffect } from "react";
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
  InputNumber,
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import RichText from "@/components/manage/RichText";

import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { BaseContext } from "@/common/context";
import { post, get, put } from "@/common/fetch";
import { message } from "antd/lib";

interface ArticleInfo {
  id: number;
  title: string;
  cover_img: string;
  html: string;
  article_cat_id: number;
  status: number;
  sort: number;
  views: number;
  praise: number;
  created_at: string;
}

const Article = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  const base = useContext(BaseContext);

  const [show, setShow] = useState(false);

  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      id: 0,
      title: "",
      cover_img: "",
      html: "",
      article_cat_id: null,
      sort: 0,
    });
  }

  useEffect(() => {
    if (page > 0) {
      get("/manage/article/article/list/" + page + "/" + size).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r]);

  function onFinish(values: any) {
    console.log("信息。。。。", values);
    post("/manage/article/article/add", {
      id: values.id,
      title: values.title,
      cover_img: values.cover_img || "",
      html: values.html,
      article_cat_id: values.article_cat_id,
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
    put("/manage/article/article/status", { id, status }).then((res) => {
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
    put("/manage/article/article/del", { id }).then((res) => {
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
      title: "文章封面图",
      dataIndex: "cover_img",
      key: "cover_img",
      width: 120,
      render: (r: any, i: any) => <Image src={i.cover_img || null} />,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 220,
    },
    {
      title: "分类",
      dataIndex: "cat_name",
      key: "cat_name",
      width: 120,
    },
    {
      title: "浏览量",
      dataIndex: "views",
      key: "views",
      width: 80,
    },
    {
      title: "点赞量",
      dataIndex: "praise",
      key: "praise",
      width: 80,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 80,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: ArticleInfo[], i: ArticleInfo) => (
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
      render: (r: ArticleInfo[], i: ArticleInfo) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (r: ArticleInfo[], i: ArticleInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                id: i.id,
                title: i.title,
                cover_img: i.cover_img,
                html: i.html,
                article_cat_id: i.article_cat_id,
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
      <Title title="文章管理" />
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
        title="文章新增编辑"
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
              <Form.Item label="ID" name="id">
                <Input disabled placeholder="文章编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: "请输入文章标题" }]}
              >
                <Input placeholder="请输入文章标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="分类"
                name="article_cat_id"
                rules={[{ required: true, message: "请选择分类" }]}
              >
                <Select options={base.article_cat} placeholder="请选择分类" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="文章封面图（一张）"
                name="cover_img"
                rules={[{ required: true, message: "请上传文章封面图" }]}
              >
                <UploadOne category={FileCategory.Article} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="排序（数值越大，越靠前）" name="sort">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="内容"
                name="html"
                rules={[{ required: true, message: "文章内容不能为空" }]}
              >
                <RichText category={FileCategory.Article} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Article;
