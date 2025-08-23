import { useEffect, useState, useContext } from "react";
import {
  Table,
  Tag,
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
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadFile from "@/components/manage/UploadFile";

import SearchInput from "@/components/manage/SearchInput";

import { useProductFileFileList } from "@/hooks/useManaApi";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { post, get, put } from "@/common/fetch";
import { message } from "antd/lib";
import { trim } from "@/utils/utils";

interface ProductFileInfo {
  id: number;
  product_sn: number;
  file_url: string;
  product_name: string;
  title: string;
  status: number;
  created_at: string;
}

const Product = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);

  const info = useProductFileFileList(page, size, r);

  const [show, setShow] = useState(false);
  const [searchProduct, setSearchProduct] = useState<Options[]>([]);

  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      file_url: null,
      id: 0,
      product_sn: null,
      title: "",
    });
  }

  function onFinish(values: any) {
    post("/manage/mall/product_file/add", {
      file_url: values.file_url,
      id: values.id,
      product_sn: values.product_sn,
      title: values.title,
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

  function onSearchProduct(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/mall/product/search/" + trim(keyword)).then((res) => {
      setSearchProduct(res.objects);
    });
  }

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/product_file/status", { id: id, status }).then((res) => {
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
    put("/manage/mall/product_file/del", { id: id }).then((res) => {
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
      title: "文件编号",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    // {
    //   title: "文件地址",
    //   dataIndex: "file_url",
    //   key: "file_url",
    //   width: 180,
    // },
    {
      title: "产品编号",
      dataIndex: "product_sn",
      key: "product_sn",
      width: 180,
    },
    {
      title: "产品名",
      dataIndex: "product_name",
      key: "product_name",
      width: 180,
    },
    {
      title: "文件名",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (r: ProductFileInfo[], i: ProductFileInfo) => (
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
      render: (r: ProductFileInfo[], i: ProductFileInfo) => (
        <div>{i.created_at}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (r: ProductFileInfo[], i: ProductFileInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              if (i.product_name) {
                onSearchProduct(`${i.product_name}`);
              }
              form.setFieldsValue({
                file_url: i.file_url,
                id: i.id,
                product_name: i.product_name,
                product_sn: i.product_sn,
                status: i.status,
                title: i.title,
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
      <Title title="产品文件管理" />
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
        title="产品文件新增编辑"
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
          name="productfile"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="文件id" name="id">
                <Input disabled placeholder="产品编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="文件名称"
                name="title"
                rules={[{ required: true, message: "请输入文件名称" }]}
              >
                <Input placeholder="请输入文件名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="产品名称"
                name="product_sn"
                rules={[{ required: true, message: "请输入产品名称" }]}
              >
                <SearchInput
                  options={searchProduct}
                  onSearch={(text) => onSearchProduct(text)}
                  placeholder="输入关键字搜索产品名称"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="产品文件"
                name="file_url"
                rules={[{ required: true, message: "请上传产品文件" }]}
              >
                <UploadFile category={FileCategory.ProductFile} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Product;
