import { useState } from "react";
import { Table, Tag, Button, Avatar } from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { useAllUsers } from "@/hooks/useManaApi";

const AllUsers = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const info = useAllUsers(page, size);

  // 用户角色列表
  const columns = [
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
      render: (_r: any, i: any) => (
        <Avatar
          src={i.avatar_url || null}
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
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      width: 150,
      render: (_r: UserItem[], i: UserItem) => (
        <div>
          {
            {
              "0": <Tag>未知</Tag>,
              "1": <Tag color="blue">男</Tag>,
              "2": <Tag color="red">女</Tag>,
            }[`${i.gender}`]
          }
        </div>
      ),
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (_r: any, i: any) => <div>{i.created_at}</div>,
    },
  ];

  return (
    <>
      <Title title="注册用户" />
      <Card bg="null">
        <Button type="primary" onClick={() => {}}>
          功能
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
    </>
  );
};

export default AllUsers;
