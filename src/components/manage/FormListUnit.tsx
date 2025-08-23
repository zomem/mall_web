import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Avatar,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  Image,
  InputNumber,
  message,
  Select,
  Badge,
} from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { useQueAnsList } from "@/hooks/useManaApi";
import UploadOne from "@/components/manage/UploadOne";
import UploadMult from "@/components/manage/UploadMult";
import {
  FileCategory,
  NormalStatus,
  NormalStatusOptions,
} from "@/common/constants";
import ChooseUnitAttr, {
  ChooseUnitAttrValue,
} from "@/components/manage/ChooseUnitAttr";
import { get, post, put } from "@/common/fetch";
import { trim } from "@/utils/utils";
import SearchInput from "@/components/manage/SearchInput";

interface UnitInfo {
  id: number;
  unit_sn: number;
  unit_name: number;
  price: number;
  quantity: number;
  product_sn: number;
  unit_cover: string;
  unit_imgs: string[];
  created_at: string;
  status: number;
  unit_attr: ChooseUnitAttrValue[];
}

interface FormListUnitProps {
  form_id: number;
}
const FormListUnit = ({ form_id }: FormListUnitProps) => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);


  const info = useQueAnsList(form_id, page, size);
  const [show, setShow] = useState(false);

  const [form] = Form.useForm();

  // const base = useContext(BaseContext);

  // const [optionAttr, setOptionAttr] = useState<Options[]>([]);


  // useEffect(() => {
  //   if (form_id) {
  //     get("/manage/mall/product/unit_attr/" + form_id).then((res) => {
  //       setOptionAttr(res.objects);
  //     });
  //   } else {
  //     setOptionAttr([]);
  //   }
  // }, [form_id]);


  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "alias",
      dataIndex: "alias",
      key: "alias",
      width: 100,
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      width: 120,
    },
    {
      title: "disable",
      dataIndex: "disable",
      key: "disable",
      width: 120,
    },
    {
      title: "listening_id",
      dataIndex: "listening_id",
      key: "listening_id",
      width: 120,
    },
    {
      title: "note",
      dataIndex: "note",
      key: "note",
      width: 120,
    },
    {
      title: "placeholder",
      dataIndex: "placeholder",
      key: "placeholder",
      width: 120,
    },
    {
      title: "prompt",
      dataIndex: "prompt",
      key: "prompt",
      width: 120,
    },
    {
      title: "que_type",
      dataIndex: "que_type",
      key: "que_type",
      width: 120,
    },
    {
      title: "required",
      dataIndex: "required",
      key: "required",
      width: 120,
    },
  ];

  return (
    <>
      <Card bg="null">
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

export default FormListUnit;
