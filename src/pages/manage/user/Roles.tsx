import { useState, useContext, useEffect } from "react";
import { Table, Input, Select, Avatar, Tag } from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { BaseContext } from "@/common/context";
import { get } from "@/common/fetch";

interface RoleUserInfo {
  id: number;
  nickname: string;
  avatar_url: string;
  phone: string | null;
  gender: number;
  created_at: string;
  role: number[];
}

const Roles = () => {
  const [select, setSelect] = useState(null);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  const base = useContext(BaseContext);

  useEffect(() => {
    if (page > 0 && select) {
      get(
        "/manage/user/roles/list/" +
          select +
          "/" +
          page +
          "/" +
          size +
          "?name=" +
          search
      ).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, select, search]);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户头像",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 100,
      render: (_r: any, i: any) => <Avatar src={i.avatar_url || null} />,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 180,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      width: 120,
      render: (_r: any, i: RoleUserInfo) => (
        <div>
          {
            // @ts-ignore
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
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (_: any, i: RoleUserInfo) => <div>{i.created_at}</div>,
    },
    {
      title: "所有角色",
      dataIndex: "role",
      key: "role",
      width: 160,
      render: (_r: RoleUserInfo[], i: RoleUserInfo) => (
        <div>
          {base.roles
            .filter((x) => i.role.includes(x.value as number))
            .map((r) => (
              <Tag key={r.value}>{r.label}</Tag>
            ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <Title title="角色列表" />
      <Card bg="null">
        <Select
          style={{ width: "150px" }}
          value={select}
          options={base.roles}
          placeholder="请选择角色"
          onChange={(v) => setSelect(v)}
        />

        <Input
          style={{ width: "180px", marginLeft: "25px" }}
          value={search || ""}
          placeholder="请输入用户昵称搜索"
          onInput={(e: any) => setSearch(e.target.value)}
        />
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

export default Roles;
