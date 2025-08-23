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

import css from "@/components/panda/css";
import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import ChooseMapAddr from "@/components/manage/ChooseMapAddr";
import ChooseProductAttr, {
  ChooseProductAttrValue,
} from "@/components/manage/ChooseProductAttr";
import ChooseProductCat, {
  ChooseProductCatValue,
} from "@/components/manage/ChooseProductCat";
import SearchInput from "@/components/manage/SearchInput";
import UnitAttrAdd from "@/components/manage/UnitAttrAdd";

import { useQueList } from "@/hooks/useManaApi";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import { BaseContext } from "@/common/context";
import { post, get, put } from "@/common/fetch";
import { message } from "antd/lib";
import { trim } from "@/utils/utils";
import FormListUnit from "@/components/manage/FormListUnit";

interface QueFormInfo {
  id: number;
  form_name: string;
  json: string;
  que_items: string[];
  remark: string;
  submit_prompts: string;
  tips: string;
  title: string;
}

const FormList = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const base = useContext(BaseContext);

  const info = useQueList(page, size);

  const [show, setShow] = useState(false);
  const [searchOptions, setSearchOptions] = useState<Options[]>([]);
  const [searchUserOptions, setSearchUserOptions] = useState<Options[]>([]);

  // 产品的商品显示
  const [showUnitPsn, setShowUnitPsn] = useState(0);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "问卷表单标题",
      dataIndex: "title",
      key: "title",
      width: 120,
    },
    {
      title: "问卷表单唯一名",
      dataIndex: "form_name",
      key: "form_name",
      width: 180,
    },
    {
      title: "提示，描述",
      dataIndex: "tips",
      key: "tips",
      width: 150,
    },
    {
      title: "提交成功后提示内容",
      dataIndex: "submit_prompts",
      key: "submit_prompts",
      width: 180,
    },
    {
      title: "备注内容",
      dataIndex: "remark",
      key: "remark",
      width: 180,
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
          {/* <Popconfirm
            title="提示"
            description="确定删除吗？"
            onConfirm={() => delete_confirm(i.product_sn)}
            okText="删除"
            okType="danger"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm> */}
        </>
      ),
    },
  ];

  return (
    <>
      <Title title="列表管理" />
      <Card bg="null"></Card>

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
            ? info.list.find((o) => o.product_sn == showUnitPsn)?.product_name
            : "") + "的回答列表"
        }
        open={!!showUnitPsn}
        onCancel={() => {
          setShowUnitPsn(0);
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
