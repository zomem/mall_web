import { useEffect, useState, useContext } from "react";
import {
  Button,
  Table,
  Image,
  Badge,
  Tag,
  message,
  Select,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Descriptions,
  Divider,
} from "antd";
import { Div } from "@/components/panda/css";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";

import { get, post } from "@/common/fetch";
import { OrderItemStatus, OrderStatus, DeliveryType } from "@/common/constants";
import { BaseContext } from "@/common/context";
import { isDoDelivery, getDeliveryName } from "../utils/utils";

interface OrderProduct {
  unit_sn: number;
  delivery_type: string;
}
export interface OrderInfo {
  id: number;
  uid: number;
  nickname: string | null;
  order_sn: string;
  total_amount: number;
  pay_amount: number;
  total_quantity: number;
  reduce_amount: number | null;
  reduce_des: string | null;
  notes: string | null;
  appointment_time: string | null;
  province: string;
  city: string;
  area: string;
  addr_detail: string;
  contact_user: string;
  contact_phone: string;
  status: number;
  created_at: string;
  delivery_type: string;
  subs?: OrderItemInfo[];
}
export interface OrderItemInfo {
  id: number;
  uid: number;
  order_item_id: string;
  order_sn: string;
  unit_sn: number;
  unit_name: string;
  unit_cover: string;
  unit_attr_info: UnitAttrInfo[];
  buy_quantity: number;
  amount: number;
  product_name: string;
  status: number;
  created_at: string;

  delivery_code?: string;
  waybill_id?: string;
  delivery_id?: string;
  delivery_type?: string;
}

function Order() {
  const [size, setSize] = useState<number>(20);
  const [page, setPage] = useState(1);
  const base = useContext(BaseContext);

  const [selectSn, setSelectSn] = useState<OrderInfo | null>(null);

  const [form] = Form.useForm();
  const [show, setShow] = useState(false);

  const [r, setR] = useState(0);

  // 筛选条件
  const [screen, setScreen] = useState({
    status: 2,
    item_status: 0,
  });

  // 选择的行
  const [selectRows, setSelectRows] = useState<string[]>([]);
  const [selectList, setSelectList] = useState<OrderItemInfo[]>([]);

  const [info, setInfo] = useState<PagData<OrderInfo[]>>({
    list: [],
    total: 0,
  });
  useEffect(() => {
    if (page > 0) {
      get(
        "/manage/mall/order/list/" +
          screen.status +
          "/" +
          screen.item_status +
          "/" +
          page +
          "/" +
          size
      ).then((res) => {
        setInfo(res.objects);
        setSelectSn(null);
      });
    }
  }, [page, size, r, screen.status, screen.item_status]);

  useEffect(() => {
    if (selectSn?.order_sn) {
      let index = info.list.findIndex((o) => o.order_sn == selectSn?.order_sn);
      get(
        "/manage/mall/order/item/list/" +
          selectSn?.order_sn +
          "/" +
          screen.item_status
      ).then((res: Res<PagData<OrderItemInfo[]>>) => {
        let temp_info: PagData<OrderInfo[]> = JSON.parse(JSON.stringify(info));
        temp_info.list[index].subs = res.objects.list;
        setInfo(temp_info);
      });
    }
  }, [selectSn?.order_sn, screen.item_status]);

  const rowSelection = {
    onChange: (selectedRowKeys: string[], selectedRows: OrderItemInfo[]) => {
      setSelectRows(selectedRowKeys);
      setSelectList(selectedRows);
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {},
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {},
  };

  // 发货
  function deliverGoods() {
    if (selectSn?.delivery_type != DeliveryType.DoDelivery) {
      return message.error("当前订单不支持手动发货");
    }
    if (selectRows.length == 0) {
      return message.error("请先选择要发货的商品");
    }
    let order_sn_list: string[] = [];
    for (let n = 0; n < selectList.length; n++) {
      if (selectList[n].status != OrderItemStatus.WaitDeliverGoods) {
        return message.error("有商品不是待发货状态");
      }
      if (!order_sn_list.includes(selectList[n].order_sn)) {
        order_sn_list.push(selectList[n].order_sn);
      }
    }
    if (order_sn_list.length > 1 || order_sn_list.length <= 0) {
      return message.error("商品不是来自同一个订单");
    }
    let s_order;
    for (let i = 0; i < info.list.length; i++) {
      if (info.list[i].subs) {
        // @ts-ignore
        for (let j = 0; j < info.list[i].subs?.length; j++) {
          // @ts-ignore
          if (selectRows.includes(info.list[i].subs[j].order_item_id)) {
            s_order = info.list[i];
            break;
          }
        }
      }
    }
    if (s_order && s_order.status != OrderStatus.Paid) {
      return message.error("订单未支付");
    }
    // let unit_sn_list = selectList.map((o) => o.unit_sn);
    // post("/manage/mall/order/product/info", {
    //   unit_sns: unit_sn_list,
    // }).then((res) => {
    //   let temp = [...selectList];
    //   for (let i = 0; i < res.objects.length; i++) {
    //     let index = temp.findIndex((o) => o.unit_sn == res.objects[i].unit_sn);
    //     temp[index].delivery_type = res.objects[i].delivery_type;
    //     // TODO以后，这里还要加上，微信自动物流的信息 delivery_id waybill_id
    //   }
    //   setSelectList(temp);
    // });

    setShow(true);
  }

  // 手动物流发货
  function onSendDelivery() {
    for (let i = 0; i < selectList.length; i++) {
      if (
        selectList[i].delivery_type == DeliveryType.DoDelivery ||
        selectList[i].delivery_type == DeliveryType.WxDelivery
      ) {
        if (!selectList[i].delivery_id || !selectList[i].waybill_id) {
          return message.error("快递信息不能为空");
        }
      }
    }

    let data = {
      order_sn: selectOrder?.order_sn,
      orders: selectList.map((o) => ({
        waybill_id: o.waybill_id,
        delivery_id: o.delivery_id,
        order_item_id: o.order_item_id,
        delivery_type: o.delivery_type,
      })),
    };

    post("/manage/mall/order/do_delivery/start", data).then((res) => {
      console.log(res);
      if (res.status == 1) {
        setShow(false);
        message.success(res.message);
        setR((p) => p + 1);
      } else {
        message.error(res.message);
      }
    });
  }

  // 到店核销
  function onStoreWriteOff() {}

  // 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "订单号",
      dataIndex: "order_sn",
      key: "order_sn",
      width: 200,
      render: (_r: any, i: any) => <div style={{}}>{i.order_sn}</div>,
    },
    {
      title: "用户",
      dataIndex: "nickname",
      key: "nickname",
      width: 150,
    },
    {
      title: "购买数量",
      dataIndex: "total_quantity",
      key: "total_quantity",
      width: 120,
      render: (_r: any, i: any) => (
        <div style={{}}>
          共
          <div style={{ fontWeight: "bold", display: "inline-block" }}>
            {i.total_quantity}
          </div>
          件
        </div>
      ),
    },
    {
      title: "支付金额",
      dataIndex: "pay_amount",
      key: "pay_amount",
      width: 230,
      render: (_r: any, i: any) => (
        <div style={{}}>
          <div>
            实际支付
            <div
              style={{
                color: "#ff4d4f",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              ¥{i.pay_amount}{" "}
            </div>
          </div>
          <div>
            合计 ¥{i.total_amount}，优惠 ¥{i.reduce_amount || 0}
          </div>
        </div>
      ),
    },
    {
      title: "支付状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (_r: any, i: OrderInfo) => (
        <div>
          {
            // @ts-ignore
            {
              "1": <Badge status="processing" text="待支付" />,
              "2": <Badge status="success" text="已支付" />,
              "0": <Badge status="error" text="取消支付" />,
            }[`${i.status}`]
          }
        </div>
      ),
    },
    {
      title: "备注",
      dataIndex: "notes",
      key: "notes",
      width: 200,
    },
    {
      title: "预约时间",
      dataIndex: "appointment_time",
      key: "appointment_time",
      width: 150,
    },
    {
      title: "交易类型",
      dataIndex: "delivery_type",
      key: "delivery_type",
      width: 150,
      render: (r: OrderInfo[], i: OrderInfo) => (
        <div>{getDeliveryName(base.delivery_type, i.delivery_type || "")}</div>
      ),
    },
    {
      title: "商品状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (r: OrderInfo[], i: OrderInfo) => (
        <div>
          {i.status == OrderStatus.Paid ? (
            <div>
              {
                // @ts-ignore
                {
                  "-1": <Tag color="default">全部</Tag>,
                  "0": <Tag color="red">待发货</Tag>,
                  "1": <Tag color="orange">待收货</Tag>,
                  "2": <Tag color="green">已完成</Tag>,
                  "3": <Tag color="blue">已评价</Tag>,
                  "4": <Tag color="purple">申请退货</Tag>,
                  "5": <Tag color="default">已退货</Tag>,
                }[`${screen.item_status}`]
              }
            </div>
          ) : (
            <div>-</div>
          )}
        </div>
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

  const expandedRowRender = (sn: string) => {
    let index = info.list.findIndex((o) => o.order_sn == sn);
    let is_paid = info.list[index].status == OrderStatus.Paid ? true : false;
    // 列表
    const columns_sub = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
      },
      {
        title: "商品单号",
        dataIndex: "order_item_id",
        key: "order_item_id",
        width: 120,
      },
      {
        title: "商品名",
        dataIndex: "unit_name",
        key: "unit_name",
        width: 150,
      },
      {
        title: "产品名",
        dataIndex: "product_name",
        key: "product_name",
        width: 150,
      },
      {
        title: "商品编号",
        dataIndex: "unit_sn",
        key: "unit_sn",
        width: 120,
      },
      {
        title: "商品图片",
        dataIndex: "unit_cover",
        key: "unit_cover",
        width: 150,
        render: (r: any, i: OrderItemInfo) => (
          <>
            <Div margin="0 5px 0 0" display="inline-block">
              <Image width={56} src={i.unit_cover} />
            </Div>
          </>
        ),
      },
      {
        title: "商品属性",
        dataIndex: "unit_attr_info",
        key: "unit_attr_info",
        width: 150,
        render: (r: any, i: OrderItemInfo) => (
          <>
            <Div>
              {i.unit_attr_info.map((o, ix) => (
                <div key={ix}>{o.secondary_name}</div>
              ))}
            </Div>
          </>
        ),
      },
      {
        title: "数量",
        dataIndex: "buy_quantity",
        key: "buy_quantity",
        width: 150,
        render: (_r: any, i: any) => (
          <div style={{ color: "#52c41a", fontWeight: "bold" }}>
            {i.buy_quantity}
          </div>
        ),
      },
      {
        title: "物流信息",
        dataIndex: "delivery_code",
        key: "delivery_code",
        width: 250,
        render: (_r: any, i: any) => (
          <div>
            <div>{i.delivery_code}</div>
            <div>快递公司：{i.delivery_id}</div>
            <div>快递单号：{i.waybill_id}</div>
          </div>
        ),
      },
      {
        title: "价格",
        dataIndex: "amount",
        key: "amount",
        width: 100,
        render: (_r: any, i: any) => (
          <div style={{ fontWeight: "bold" }}>¥{i.amount}</div>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (_r: OrderItemInfo[], i: OrderItemInfo) => (
          <div>
            {is_paid ? (
              <div>
                {
                  // @ts-ignore
                  {
                    "0": <Tag color="red">待发货</Tag>,
                    "1": <Tag color="orange">待收货</Tag>,
                    "2": <Tag color="green">已完成</Tag>,
                    "3": <Tag color="blue">已评价</Tag>,
                    "4": <Tag color="purple">申请退货</Tag>,
                    "5": <Tag color="default">已退货</Tag>,
                  }[`${i.status}`]
                }
              </div>
            ) : (
              <div>-</div>
            )}
          </div>
        ),
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 160,
        render: (_r: OrderItemInfo[], i: OrderItemInfo) => (
          <>
            <Button type="link" size="small" onClick={() => {}}>
              核销
            </Button>
          </>
        ),
      },
    ];

    return (
      <Table
        // @ts-ignore
        rowSelection={{
          ...rowSelection,
          selectedRowKeys: selectRows,
        }}
        columns={columns_sub}
        rowKey={(r: OrderItemInfo) => r.order_item_id}
        dataSource={info.list[index].subs || []}
        pagination={false}
      />
    );
  };

  const selectOrder = info.list.find(
    (o) => o.order_sn == selectList[0]?.order_sn
  );

  return (
    <>
      <Title title="订单列表" />
      <Card bg="null">
        <Button type="primary" onClick={deliverGoods}>
          发货
        </Button>
        <Select
          value={screen.status}
          style={{ width: 120, marginLeft: 20 }}
          onChange={(v) => {
            setSelectRows([]);
            setSelectList([]);
            setScreen((p) => ({ ...p, status: v }));
          }}
          options={[
            { label: "待支付", value: 1 },
            { label: "已支付", value: 2 },
            { label: "取消支付", value: 0 },
          ]}
        />
        {screen.status == 2 && (
          <Select
            value={screen.item_status}
            style={{ width: 120, marginLeft: 20 }}
            onChange={(v) => {
              setSelectRows([]);
              setSelectList([]);
              setScreen((p) => ({ ...p, item_status: v }));
            }}
            options={[
              { label: "全部", value: -1 },
              { label: "待发货", value: 0 },
              { label: "待收货", value: 1 },
              { label: "已完成", value: 2 },
              { label: "已评价", value: 3 },
              { label: "申请退货", value: 4 },
              { label: "已退货", value: 5 },
            ]}
          />
        )}
      </Card>

      <Card maxConHeight={`calc(100vh - 102px)`}>
        <Table
          expandable={{
            expandedRowRender: (record) =>
              expandedRowRender(record.order_sn.toString()),
            onExpand: (expanded, record) => {
              setSelectSn(record);
            },
          }}
          rowKey={(record: OrderInfo) => record.order_sn}
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
        open={show}
        onCancel={() => setShow(false)}
        width={900}
        onOk={() => {
          onSendDelivery();
        }}
        maskClosable={false}
      >
        {selectOrder && (
          <Descriptions title="收货信息" bordered>
            <Descriptions.Item label="收件人">
              {selectOrder.contact_user}
            </Descriptions.Item>
            <Descriptions.Item label="收件人电话">
              {selectOrder.contact_phone}
            </Descriptions.Item>
            <Descriptions.Item label="收件人地址">
              {selectOrder.province}
              {selectOrder.city}
              {selectOrder.area}
              {selectOrder.addr_detail}
            </Descriptions.Item>
            <Descriptions.Item label="预约时间">
              {selectOrder.appointment_time}
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              {selectOrder.notes}
            </Descriptions.Item>
          </Descriptions>
        )}
        <Divider />
        {selectList.map((item, index) => (
          <div key={item.order_item_id}>
            <Descriptions title="商品信息">
              <Descriptions.Item label="产品名">
                {item.product_name}
              </Descriptions.Item>
              <Descriptions.Item label="商品名">
                {item.unit_name}
              </Descriptions.Item>
              {item.unit_attr_info.map((o, ix) => (
                <Descriptions.Item
                  label={o.primary_name}
                  key={item.order_item_id + ix}
                >
                  {o.secondary_name}
                </Descriptions.Item>
              ))}
              <Descriptions.Item label="图片">
                <Image
                  src={item.unit_cover}
                  style={{ width: "50px", height: "50px" }}
                />
              </Descriptions.Item>
            </Descriptions>
            <Divider />

            <Descriptions title="物流信息">
              <Descriptions.Item label="交易类型">
                {getDeliveryName(
                  base.delivery_type,
                  selectSn?.delivery_type || ""
                )}
              </Descriptions.Item>
              {isDoDelivery(selectSn?.delivery_type || "") && (
                <>
                  <Descriptions.Item label="物流公司">
                    <Select
                      style={{ width: "160px" }}
                      options={base.delivery}
                      placeholder="请选择物流公司"
                      onChange={(v) => {
                        let temp = [...selectList];
                        temp[index].delivery_id = v;
                        setSelectList(temp);
                      }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="物流单号">
                    <Input
                      style={{ width: "160px" }}
                      placeholder="请输入物流单号"
                      onChange={(e) => {
                        let temp = [...selectList];
                        temp[index].waybill_id = e.target.value;
                        setSelectList(temp);
                      }}
                    />
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
            <Divider />
          </div>
        ))}
      </Modal>
    </>
  );
}

export default Order;
