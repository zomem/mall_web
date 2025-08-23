import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Avatar,
  Popconfirm,
  Badge,
  Tag,
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { NormalStatus, NormalStatusOptions, Role } from "@/common/constants";
import { get, put } from "@/common/fetch";
import { message } from "antd/lib";

interface RoleUserInfo {
  id: number;
  nickname: string;
  avatar_url: string;
  phone: string | null;
  gender: number;
  created_at: string;
  role: number[];
}

const MainSaleList = () => {
  const [showUid, setShowUid] = useState(-1);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });
  const [info2, setInfo2] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });

  useEffect(() => {
    if (page > 0) {
      get(
        "/manage/user/roles/list/" +
          Role.MainSale +
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
  }, [page, size]);

  useEffect(() => {
    if (showUid > 0) {
      get(
        "/manage/sales/main_sale_sub/list/" + showUid + "/" + 1 + "/" + 1000
      ).then((res) => {
        setInfo2(res.objects);
      });
    }
  }, [r, showUid]);

  // 修改状态
  function change_status(id: number, status: NormalStatus) {
    put("/manage/sales/main_sale/status", { id, status }).then((res) => {
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
    put("/manage/sales/main_sale/del", { id }).then((res) => {
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
    // {
    //   title: "所有角色",
    //   dataIndex: "role",
    //   key: "role",
    //   width: 160,
    //   render: (_r: RoleUserInfo[], i: RoleUserInfo) => (
    //     <div>
    //       {base.roles
    //         .filter((x) => i.role.includes(x.value as number))
    //         .map((r) => (
    //           <Tag key={r.value}>{r.label}</Tag>
    //         ))}
    //     </div>
    //   ),
    // },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (_r: RoleUserInfo[], i: RoleUserInfo) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setShowUid(i.id);
            }}
          >
            查看
          </Button>
        </>
      ),
    },
  ];

  const columns2: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "头像",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 100,
      render: (_r: any, i: any) => <Avatar src={i.avatar_url || null} />,
    },
    {
      title: "昵称",
      dataIndex: "name",
      key: "name",
      width: 180,
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
      render: (_: any, i: RoleUserInfo) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (_r: RoleUserInfo[], i: RoleUserInfo) => (
        <>
          <Popconfirm
            title="提示"
            description="确定解除绑定吗？"
            onConfirm={() => delete_confirm(i.id)}
            okText="解除绑定"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              解除绑定
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="总销售列表" />
      <Card bg="null">
        <Input
          style={{ width: "180px" }}
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

      <Modal
        title={"总销售【" + showUid + "】的销售列表"}
        open={showUid > -1 ? true : false}
        onCancel={() => {
          setInfo2({
            list: [],
            total: 0,
          });
          setShowUid(-1);
        }}
        maskClosable={false}
        width={1000}
        onOk={() => {
          setInfo2({
            list: [],
            total: 0,
          });
          setShowUid(-1);
        }}
      >
        <Table
          rowKey={(record: any) => record.id}
          columns={columns2}
          dataSource={info2.list}
          pagination={{
            style: { marginRight: "10px" },
            total: info2.total,
          }}
          scroll={{ y: `calc(100vh - 223px)` }}
        />
      </Modal>
    </>
  );
};

export default MainSaleList;
