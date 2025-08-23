import { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form } from "antd";

import css from "@/components/panda/css";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { useQueList } from "@/hooks/useManaApi";
import FormListUnit from "@/components/manage/FormListUnit";

interface QueFormInfo {
  id: number;
  form_name: string;
  json: string;
  que_items: [];
  remark: string;
  submit_prompts: string;
  tips: string;
  title: string;
}

const FormList = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  // 详情显示
  const [showUnitPsn, setShowUnitPsn] = useState(0);

  const info = useQueList(page, size);
  console.log("useQueList", info);

  const [form] = Form.useForm();

  function clearInput() {
    form.setFieldsValue({
      form_name: "",
      title: "",
      tips: "",
      id: 0,
      submit_prompts: "",
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
      title: "问卷表单唯一名",
      dataIndex: "form_name",
      key: "form_name",
      width: 120,
    },
    {
      title: "问卷表单标题",
      dataIndex: "title",
      key: "title",
      width: 120,
    },
    {
      title: "json控制内容",
      dataIndex: "json",
      key: "json",
      width: 150,
    },
    {
      title: "备注内容",
      dataIndex: "remark",
      key: "remark",
      width: 150,
    },
    {
      title: "提交成功后提示内容",
      dataIndex: "submit_prompts",
      key: "submit_prompts",
      width: 150,
    },
    {
      title: "提示/描述",
      dataIndex: "tips",
      key: "tips",
      width: 150,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 160,
      fixed: "right",
      render: (r: QueFormInfo[], i: QueFormInfo) => (
        <>
          <a
            className={css({
              color: "#48b014 !important",
              marginLeft: "5px",
              marginRight: "5px",
              _hover: {
                color: "#59d81a !important",
              },
            })}
            onClick={() => {
              setShowUnitPsn(i.id);
            }}
          >
            回答列表
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="表单列表管理" />
      <Card bg="null">
        <Button
          type="primary"
          onClick={() => {
            clearInput();
            // setShow(true);
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
        forceRender
        title={
          (info.list.length > 0
            ? info.list.find((o) => o.id == showUnitPsn)?.form_name
            : "") + "的回答列表"
        }
        open={!!showUnitPsn}
        onCancel={() => {
          setShowUnitPsn(0);
        }}
        width="90%"
        onOk={() => setShowUnitPsn(0)}
        maskClosable={false}
      >
        <FormListUnit form_id={showUnitPsn} />
      </Modal>
    </>
  );
};

export default FormList;
