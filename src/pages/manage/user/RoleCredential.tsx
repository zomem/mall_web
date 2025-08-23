import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Image,
  Select,
  Tag,
  Modal,
  Descriptions,
  Divider,
  Input,
  message,
} from "antd";
import { Div } from "@/components/panda/css";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { get, put } from "@/common/fetch";
import _default from "antd/lib/_util/wave/style";

function RoleCredential() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const [screen, setScreen] = useState({ status: 1 });

  const [show, setShow] = useState(false);
  const [select, setSelect] = useState<Credential | null>(null);
  const [info, setInfo] = useState<PagData<Credential[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get(
        "/manage/user/credential/" + screen.status + "/" + page + "/" + size
      ).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r, screen.status]);

  // 审核操作
  function on_check() {
    if (!select?.id) {
      return message.error("请选择要审核的内容");
    }
    put("/manage/user/credential/status", {
      id: select?.id,
      status: select?.status,
      reason: select?.reason,
    }).then((res) => {
      if (res.status === 1) {
        message.success(res.message);
        setR((p) => p + 1);
        setShow(false);
        setSelect(null);
      } else {
        message.error(res.message);
      }
    });
  }
  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "申请角色",
      dataIndex: "role_name",
      key: "role_name",
      width: 150,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 150,
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
      width: 220,
      render: (_r: any, i: Credential) => (
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
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_r: Credential[], i: Credential) => (
        <div>
          {
            // @ts-ignore
            {
              "0": <Tag color="red">未通过</Tag>,
              "1": <Tag color="orange">待审核</Tag>,
              "2": <Tag color="green">已通过</Tag>,
              "3": <Tag color="default">已撤销</Tag>,
            }[`${i.status}`]
          }
        </div>
      ),
    },
    {
      title: "审核说明",
      dataIndex: "reason",
      key: "reason",
      width: 250,
    },
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (_r: any, i: any) => <div>{i.created_at}</div>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 100,
      render: (_r: Credential[], i: Credential) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelect(i);
              setShow(true);
            }}
          >
            审核
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="角色申请" />
      <Card bg="null">
        <Select
          value={screen.status}
          style={{ width: 120 }}
          onChange={(v) => {
            setScreen((p) => ({ ...p, status: v }));
          }}
          options={[
            { label: "未通过", value: 0 },
            { label: "待审核", value: 1 },
            { label: "已通过", value: 2 },
            { label: "已撤销", value: 3 },
          ]}
        />
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          rowKey={(record: Credential) => record.id}
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
        width={800}
        open={show}
        onCancel={() => {
          setSelect(null);
          setShow(false);
        }}
        onOk={on_check}
      >
        <Descriptions title="审核信息" bordered>
          <Descriptions.Item label="用户昵称">
            {select?.nickname}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">{select?.phone}</Descriptions.Item>
          <Descriptions.Item label="角色">
            {select?.role_name}
          </Descriptions.Item>
          <Descriptions.Item label="标题">{select?.title}</Descriptions.Item>
          <Descriptions.Item label="图片">
            {select?.imgs.map((o) => (
              <Image
                src={o}
                style={{ width: "50px", height: "50px", marginRight: "5px" }}
              />
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="内容">{select?.content}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions title="审核操作">
          <Descriptions.Item label="状态">
            <Select
              value={select?.status}
              style={{ width: 120 }}
              onChange={(v) => {
                if (select) {
                  let temp = { ...select };
                  temp.status = v;
                  setSelect(temp);
                }
              }}
              options={[
                { label: "未通过", value: 0 },
                { label: "待审核", value: 1 },
                { label: "已通过", value: 2 },
                { label: "已撤销", value: 3 },
              ]}
            />
          </Descriptions.Item>
          <Descriptions.Item label="说明">
            <Input.TextArea
              placeholder="请输入补充说明"
              onChange={(e) => {
                if (select) {
                  let temp = { ...select };
                  temp.reason = e.target.value;
                  setSelect(temp);
                }
              }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}

export default RoleCredential;
