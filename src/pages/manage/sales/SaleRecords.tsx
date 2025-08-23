import { useState, useContext, useEffect } from "react";
import { Table, Button, Avatar, Tag, Input, Flex } from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { BaseContext } from "@/common/context";
import { post, get, put } from "@/common/fetch";

interface SaleRecord {
  id: number;
  avatar_url: string;
  nickname: string;
  tran_amount: number;
  tran_type: string;
  info: any;
}

const Article = () => {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const [r, setR] = useState(0);
  const [info, setInfo] = useState<PagData<any[]>>({
    list: [],
    total: 0,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (page > 0) {
      get(
        "/manage/sales/records/list/" +
          page +
          "/" +
          size +
          "?search_nickname=" +
          search
      ).then((res) => {
        setInfo(res.objects);
      });
    }
  }, [page, size, r, search]);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "nickname",
      key: "nickname",
      width: 120,
    },
    {
      title: "用户头像",
      dataIndex: "avatar_url",
      key: "avatar_url",
      width: 120,
      render: (_r: any, i: any) => <Avatar src={i.avatar_url || null} />,
    },
    {
      title: "金额(¥)",
      dataIndex: "tran_amount",
      key: "tran_amount",
      width: 120,
      render: (r: SaleRecord[], i: SaleRecord) => (
        <div
          style={{
            color: i.tran_amount > 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {i.tran_amount > 0 ? "+" + i.tran_amount : i.tran_amount}
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "tran_type",
      key: "tran_type",
      width: 120,
      render: (r: SaleRecord[], i: SaleRecord) => (
        <div>
          {
            // @ts-ignore
            {
              MAIN_SALE_SPLIT: <Tag color="gold">总销售分成</Tag>,
              SALE_SPLIT: <Tag color="blue">销售分成</Tag>,
            }[`${i.tran_type}`]
          }
        </div>
      ),
    },
    {
      title: "订单号",
      dataIndex: "order_sn",
      key: "order_sn",
      width: 220,
      render: (_: SaleRecord[], i: SaleRecord) => <div>{i.info.order_sn}</div>,
    },
    {
      title: "商品",
      dataIndex: "order_sn",
      key: "order_sn",
      width: 220,
      render: (_: SaleRecord[], i: SaleRecord) => (
        <div>
          {i.info.prepare.user_buy &&
            i.info.prepare.user_buy.map((o: any) => (
              <>
                {/* <Image src={o.unit_cover} /> */}
                <div>
                  <div>【{o.unit_sn}】</div>
                  <div>{o.unit_name}</div>
                  <div>
                    ¥{o.price} x{o.buy_quantity}
                  </div>
                </div>
              </>
            ))}
        </div>
      ),
    },
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
    },
  ];

  return (
    <>
      <Title title="分销记录" />
      <Card bg="null">
        <Flex>
          <Input
            style={{ width: "200px", marginRight: "15px" }}
            placeholder="请输入昵称搜索"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="primary" onClick={() => {}}>
            搜索
          </Button>
        </Flex>
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

export default Article;
