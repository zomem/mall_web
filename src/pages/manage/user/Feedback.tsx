import { useState } from "react";
import { Button, Table, Image } from "antd";
import { Div } from "@/components/panda/css";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { useFeedback } from "@/hooks/useManaApi";

function Feedback() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);

  const info = useFeedback(page, size);
  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户",
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 250,
    },
    {
      title: "图片",
      dataIndex: "imgs",
      key: "imgs",
      width: 150,
      render: (r: any, i: FeedbackRes) => (
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
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (r: any, i: any) => <div>{i.created_at}</div>,
    },
  ];

  return (
    <>
      <Title title="用户反馈" />
      <Card bg="null">
        <Button type="primary">备用</Button>
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: FeedbackRes) => record.id}
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
}

export default Feedback;
