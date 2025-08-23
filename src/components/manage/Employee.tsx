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
  message,
  Select,
  Badge,
  Switch,
  Avatar,
} from "antd";

import Card from "@/components/manage/Card";
import { NormalStatus, NormalStatusOptions } from "@/common/constants";
import SearchInput from "@/components/manage/SearchInput";
import { trim } from "@/utils/utils";
import { get, post, put } from "@/common/fetch";

interface EmployeeInfo {
  id: number;
  com_store_code: number;
  com_store_name: string;
  uid: number;
  nickname: string;
  avatar_url: string | null;
  status: number;
  created_at: string;
}

interface EmployeeProps {
  code: number;
}
const Employee = ({ code }: EmployeeProps) => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const [r, setR] = useState(0);
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();

  const [searchUserOptions, setSearchUserOptions] = useState<Options[]>([]);
  const [info, setInfo] = useState<PagData<EmployeeInfo[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0 && code > 0) {
      get(
        "/manage/mall/store/employee/list/" + code + "/" + page + "/" + size
      ).then((res) => {
        setInfo(res.objects);
      });
    }
    if (code == 0) {
      setInfo({
        list: [],
        total: 0,
      });
    }
  }, [code, page, size, r]);

  function clearInput() {
    form.setFieldsValue({
      id: 0,
      uid: null,
    });
  }

  function onSearchUser(keyword: string) {
    if (!keyword) return;
    if (!trim(keyword)) return;
    get("/manage/user/search/phone/" + trim(keyword)).then((res) => {
      setSearchUserOptions(res.objects);
    });
  }
  function onFinish(values: any) {
    console.log("信33息。。。。", values);

    post("/manage/mall/store/employee/add", {
      id: values.id,
      com_store_code: code,
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

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/mall/store/employee/status", { id: id, status }).then(
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
    put("/manage/mall/store/employee/del", { id: id }).then((res) => {
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
      title: "店铺公司编号",
      dataIndex: "com_store_code",
      key: "com_store_code",
      width: 120,
    },
    {
      title: "店铺公司名称",
      dataIndex: "com_store_name",
      key: "com_store_name",
      width: 150,
    },
    {
      title: "用户ID",
      dataIndex: "uid",
      key: "uid",
      width: 100,
    },
    {
      title: "用户头像",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 120,
      render: (_r: any, i: any) => <Avatar src={i.avatar_url || null} />,
    },
    {
      title: "用户昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (_: EmployeeInfo[], i: EmployeeInfo) => (
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
      render: (_r: EmployeeInfo[], i: EmployeeInfo) => (
        <div>{i.created_at}</div>
      ),
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 120,
      fixed: "right",
      render: (_r: EmployeeInfo[], i: EmployeeInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.setFieldsValue({
                id: i.id,
                uid: i.uid,
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
      <Card bg="null">
        <Button
          type="primary"
          onClick={() => {
            clearInput();
            setShow(true);
          }}
        >
          添加员工
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
        title="员工新增编辑"
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
          name="employee"
          layout="vertical"
          form={form}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="ID" name="id">
                <Input disabled placeholder="ID" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="关联的员工手机号" name="uid">
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
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Employee;
