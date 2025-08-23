import { useState, useRef } from "react";
import { Modal, Button, Input } from "antd";
import { Map, APILoader } from "@uiw/react-amap";
import axios from "axios";

import css from "@/components/panda/css";
import { AMAP_JS_KEY } from "@/common/constants";
import PNG_LOC from "@/images/loc.png";
import { get } from "@/common/fetch";

interface ChooseMapValue {
  lng: number;
  lat: number;
  detail: string;
}
interface ChooseMapAddrProps {
  value?: ChooseMapValue;
  onChange?: (d: ChooseMapValue) => void;
}
const ChooseMapAddr = ({ value, onChange = () => {} }: ChooseMapAddrProps) => {
  const markerRef = useRef<any>([]);
  const [open, setOpen] = useState(false);
  const [lnglat, setLnglat] = useState([null, null]);

  async function getAddr(lng: number, lat: number) {
    let res = await get("/manage/common/geocode/regeo/" + lat + "/" + lng);
    let data = res.objects.regeocode.addressComponent;
    onChange({
      lat: lat,
      lng: lng,
      detail:
        data.township + data.streetNumber.street + data.streetNumber.number,
    });
  }

  return (
    <div>
      <div
        className={css({
          width: "100%",
          display: "flex",
          flexDir: "row",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <Input
          value={value?.detail}
          placeholder="请选择地址"
          onChange={(e) => {
            console.log(e.target.value);
            onChange({
              lat: value ? value.lat : 0,
              lng: value ? value.lng : 0,
              detail: e.target.value,
            });
          }}
        />
        <div style={{ width: "10px" }} />
        <Button onClick={() => setOpen(true)}>选择</Button>
      </div>

      <Modal
        open={open}
        width={800}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          if (lnglat[0] && lnglat[1]) {
            await getAddr(lnglat[0], lnglat[1]);
          }
          setOpen(false);
        }}
      >
        <div style={{ width: "100%", height: "500px" }}>
          <APILoader akey={AMAP_JS_KEY}>
            <Map
              // @ts-ignore
              onClick={(data: any) => {
                setLnglat([data.lnglat.lng, data.lnglat.lat]);
              }}
            >
              {({ AMap, map }) => {
                if (map) {
                  map.remove(markerRef.current);
                  const marker = new AMap.Marker({
                    icon: new AMap.Icon({
                      imageSize: new AMap.Size(34, 34),
                      image: PNG_LOC,
                    }),
                    position: [lnglat[0], lnglat[1]],
                    offset: new AMap.Pixel(-13, -30),
                  });
                  marker.setMap(map);
                  markerRef.current.push(marker);
                }
                return;
              }}
            </Map>
          </APILoader>
        </div>
      </Modal>
    </div>
  );
};

export default ChooseMapAddr;
