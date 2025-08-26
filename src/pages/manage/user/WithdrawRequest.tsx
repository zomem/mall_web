import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Avatar,
  Space,
  Popconfirm,
  message,
  Select,
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { useWithdrawRequestList } from "@/hooks/useManaApi";
import { put } from "@/common/fetch";
import { ReqAmountStatusOptions } from "@/common/constants";

const WithdrawRequest = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<number | string>("-1");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const info = useWithdrawRequestList(page, size, status, refreshTrigger);

  // 状态更新（通过/拒绝）
  const handleStatusChange = async (id: number, status: number) => {
    try {
      const res = await put("/manage/user/withdraw_req/status", { id, status });
      if (res.status !== 0) {
        message.success(res.message);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("操作失败");
    }
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const res = await put("/manage/user/withdraw_req/del", { id });
      if (res.status !== 0) {
        message.success("删除成功");
        setRefreshTrigger((prev) => prev + 1);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 获取状态显示
  const getStatusTag = (status: number) => {
    const statusOption = ReqAmountStatusOptions.find(
      (item) => item.value === status
    );
    const colors = ["red", "orange", "green", "gray"];
    return (
      <Tag color={colors[status] || "default"}>
        {statusOption?.label || "未知"}
      </Tag>
    );
  };

  // 提现申请列表
  const columns = [
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
      render: (_: any, record: WithdrawRequest) => (
        <Avatar
          src={record.avatar_url || null}
          style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          {record.nickname?.[0]?.toUpperCase() || "U"}
        </Avatar>
      ),
    },
    {
      title: "用户昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
    },
    {
      title: "提现金额",
      dataIndex: "req_amount",
      key: "req_amount",
      width: 120,
      render: (amount: number) => (
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          ¥{amount?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      title: "审核状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (time: string) => time || "-",
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 180,
      render: (time: string) => time || "-",
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: any, record: WithdrawRequest) => (
        <Space size="small">
          {[0, 1, 4].includes(record.status) && (
            <Popconfirm
              title="确定要通过这个提现申请吗？"
              onConfirm={() => handleStatusChange(record.id, 2)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" size="small">
                通过
              </Button>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm
              title="确定要拒绝这个提现申请吗？"
              onConfirm={() => handleStatusChange(record.id, 0)}
              okText="拒绝"
              okType="danger"
              cancelText="取消"
            >
              <Button danger size="small">
                拒绝
              </Button>
            </Popconfirm>
          )}
          {record.status === 0 && (
            <Popconfirm
              title="确定要删除这条记录吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="删除"
              okType="danger"
              cancelText="取消"
            >
              <Button danger size="small" type="text">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title title="提现申请" />
      <Card bg="null">
        <Space>
          <Select
            style={{ width: 120 }}
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1); // 重置到第一页
            }}
            options={[
              { label: "全部", value: "-1" },
              ...ReqAmountStatusOptions,
            ]}
          />
        </Space>
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: WithdrawRequest) => record.id}
          columns={columns}
          dataSource={info.list}
          pagination={{
            style: { marginRight: "10px" },
            total: info.total,
            pageSize: size,
            current: page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
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

export default WithdrawRequest;
