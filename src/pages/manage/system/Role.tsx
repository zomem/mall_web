import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Table,
  Form,
  Input,
  message,
  InputNumber,
  Popconfirm,
  Modal,
  Avatar,
} from "antd";

import { get, post, put } from "@/common/fetch";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { Div } from "@/components/panda/css";

function Role() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [infos, setInfos] = useState({
    list: [],
  });

  const [selectId, setSelectId] = useState("");

  const [form] = Form.useForm();

  const [showRole, setShowRole] = useState(""); // 显示角色列表
  const [roleUsers, setRoleUsers] = useState<
    {
      id: number;
      username: string;
      avatar_url?: string;
      nickname?: string;
    }[]
  >([]);

  useEffect(() => {
    get("/manage/system/role/list").then((res) => {
      setInfos({
        list: res.objects,
      });
    });
  }, [refresh]);

  const onShowDrawer = () => {
    setShowDrawer(true);
  };
  const onCloseDrawer = () => {
    setShowDrawer(false);
    setSelectId("");
  };

  const clearInput = () => {
    form.setFieldsValue({
      name: "",
      identifier: null,
      api_paths: "",
    });
  };

  const onFinish = (values: any) => {
    setLoading(true);
    if (selectId) {
      put("/manage/system/role/update", {
        id: selectId,
        name: values.name,
        identifier: +values.identifier,
        api_paths: values.api_paths ? values.api_paths.replace(/\n/g, ",") : "",
      }).then((res) => {
        if (res.status === 1) {
          message.success(res.message);
          onCloseDrawer();
          setRefresh((prev) => prev + 1);
          clearInput();
        } else {
          message.error(res.message || "操作失败");
        }
        setLoading(false);
      });
    } else {
      post("/manage/system/role/add", {
        name: values.name,
        identifier: values.identifier,
        api_paths: values.api_paths ? values.api_paths.replace(/\n/g, ",") : "",
      }).then((res) => {
        if (res.status === 1) {
          message.success(res.message);
          onCloseDrawer();
          setRefresh((prev) => prev + 1);
          clearInput();
        } else {
          message.error(res.message || "操作失败");
        }
        setLoading(false);
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (selectId) {
      get("/manage/system/role/info/" + selectId).then((res) => {
        form.setFieldsValue({
          name: res.objects.name,
          identifier: res.objects.identifier,
          api_paths: res.objects.api_paths
            ? res.objects.api_paths.replace(/,/g, "\n")
            : "",
        });
      });
    }
  }, [selectId]);

  const columns = [
    {
      title: "角色名",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "角色编号",
      dataIndex: "identifier",
      key: "identifier",
      width: 150,
    },
    {
      title: "api权限",
      dataIndex: "api_paths",
      key: "api_paths",
      width: 250,
    },
    {
      title: "查看授权",
      width: 150,
      dataIndex: "user_info",
      key: "user_info",
      render: (record: any, item: any) => (
        <Button
          onClick={() => {
            setShowRole(item.name);
            get("/manage/system/role/" + item.identifier + "/users").then(
              (res: any) => {
                setRoleUsers(res.objects);
              },
            );
          }}
        >
          已授权用户
        </Button>
      ),
    },
    {
      title: "操作",
      width: 150,
      key: "operation",
      render: (record: any) => (
        <Div
          display="flex"
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Div
            pr="12px"
            onClick={() => {
              setSelectId(record.id);
              onShowDrawer();
            }}
          >
            <a href="#">编辑</a>
          </Div>
          <Popconfirm
            title={`确定删除【${record.name}】吗？`}
            onConfirm={() => {
              post("/manage/system/role/del", { id: record.id }).then((res) => {
                if (res.status === 1) {
                  message.success(res.message);
                  setRefresh((prev) => prev + 1);
                } else {
                  message.error(res.message);
                }
              });
            }}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Div>
      ),
    },
  ];

  // 用户角色列表
  const columns_role = [
    {
      title: "uid",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "用户头像",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 100,
      render: (r: any, i: any) => (
        <Avatar
          src={i.avatar_url}
          style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          U
        </Avatar>
      ),
    },
    {
      title: "用户昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 150,
    },
  ];

  return (
    <>
      <Title title="角色管理" />
      <Card bg="null">
        <Button type="primary" onClick={onShowDrawer}>
          新增
        </Button>
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: any) => record.id}
          columns={columns}
          dataSource={infos.list}
          scroll={{ y: `calc(100vh - 223px)` }}
        />
      </Card>

      <Drawer
        title="角色新增编辑"
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
          <Form.Item
            label="角色名"
            name="name"
            rules={[{ required: true, message: "请输入角色名" }]}
          >
            <Input placeholder="请输入角色名" />
          </Form.Item>

          <Form.Item
            label="角色编号"
            name="identifier"
            rules={[{ required: true, message: "请输入角色编号" }]}
          >
            <InputNumber min={1000} max={9999} />
          </Form.Item>

          <Form.Item
            label="api权限"
            name="api_paths"
            rules={[
              { required: false, message: "请输入该角色可调用的api权限" },
            ]}
          >
            <Input.TextArea
              autoSize
              placeholder="请输入该角色可调用的api权限，以换行分隔，如：/users/list。"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={showRole}
        width={600}
        open={showRole ? true : false}
        onCancel={() => {
          setShowRole("");
          setRoleUsers([]);
        }}
        footer={null}
      >
        <Table
          rowKey={(record: any) => record.id}
          columns={columns_role}
          dataSource={roleUsers}
          scroll={{ y: `550px` }}
        />
      </Modal>
    </>
  );
}

export default Role;
