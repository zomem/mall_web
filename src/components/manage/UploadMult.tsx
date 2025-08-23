import { useEffect, useRef, useState } from "react";
import { Upload, UploadFile } from "antd";
import { CONFIG } from "@/common/fetch";
import { PlusOutlined } from "@ant-design/icons";
import { img_name, random_str } from "@/utils/utils";
import { FileCategory } from "@/common/constants";
import ImgCrop from "antd-img-crop";

interface UploadMultProps {
  category: FileCategory;
  url?: string;
  value?: string[];
  maxCount?: number;
  onChange?: (value: string[]) => void;
}
const UploadMult = ({
  value = [],
  onChange = () => {},
  url = "/upload/file",
  maxCount = 9,
  category = FileCategory.Banner,
}: UploadMultProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isUp = useRef(false);

  useEffect(() => {
    if (value.length > 0) {
      if (!isUp.current) {
        let objs: UploadFile[] = [];
        value.forEach((o) => {
          let obj: UploadFile = {
            uid: random_str(20),
            name: img_name(o),
            status: "done",
            url: o,
          };
          objs.push(obj);
        });
        setFileList(objs);
      } else {
        isUp.current = false;
      }
    } else {
      isUp.current = false;
      setFileList((prev: UploadFile[]) => []);
    }
  }, [value.length]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <ImgCrop aspectSlider minAspect={0.1} maxAspect={10}>
      <Upload
        name="file"
        listType="picture-card"
        headers={{
          //@ts-ignore
          "X-Requested-With": null,
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ZM_LOGIN_TOKEN
          )}`,
        }}
        data={(file) => {
          return {
            name: file.name,
            category,
          };
        }}
        fileList={fileList}
        action={CONFIG.API_URL + url}
        maxCount={maxCount}
        onRemove={(item) => {
          let file_list = JSON.parse(JSON.stringify(fileList));
          let index = -1,
            imgs_path: string[] = [];
          for (let i = 0; i < file_list.length; i++) {
            if (file_list[i].uid === item.uid) {
              index = i;
              continue;
            }
            if (file_list[i].response) {
              if (file_list[i].response.status === 2) {
                imgs_path.push(file_list[i].response.url);
              }
            } else {
              imgs_path.push(file_list[i].url || "");
            }
          }
          file_list.splice(index, 1);
          setFileList(file_list);
          onChange?.(imgs_path);
        }}
        onChange={(info) => {
          setFileList(info.fileList);
          isUp.current = true;
          let imgs_path: string[] = [];
          let temp_file: UploadFile<any>[] = [];
          if (info.fileList) {
            for (let i = 0; i < info.fileList.length; i++) {
              if (info.fileList[i].status === "removed") continue;
              temp_file.push(info.fileList[i]);
              if (info.fileList[i].response) {
                if (info.fileList[i].response.status === 1) {
                  imgs_path.push(info.fileList[i].response.objects.url);
                }
              } else {
                imgs_path.push(info.fileList[i].url || "");
              }
            }
          }
          setFileList(temp_file);
          onChange?.(imgs_path);
        }}
      >
        {value.length < maxCount && uploadButton}
      </Upload>
    </ImgCrop>
  );
};

export default UploadMult;
