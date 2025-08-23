import { useState } from "react";
import { Upload, Button } from "antd";
import { CONFIG } from "@/common/fetch";
import {
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { FileCategory } from "@/common/constants";

interface UploadFileProps {
  category: FileCategory;
  value?: string;
  onChange?: (value: string) => void;
  url?: string;
}
const UploadFile = ({
  value = "",
  onChange,
  category = FileCategory.ProductCat,
  url = "/upload/file",
}: UploadFileProps) => {
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <button
      style={{ border: 0, background: "none", cursor: "pointer" }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传文件</div>
    </button>
  );
  return (
    <Upload
      name="file"
      headers={{
        //@ts-ignore
        "X-Requested-With": null,
        Authorization: `Bearer ${localStorage.getItem(CONFIG.ZM_LOGIN_TOKEN)}`,
      }}
      data={(file) => {
        return {
          name: file.name,
          category,
        };
      }}
      action={CONFIG.API_URL + url}
      showUploadList={false}
      onChange={(info) => {
        setLoading(true);
        if (info.file.status === "done") {
          if (info.file.response.status === 1) {
            onChange?.(info.file.response.objects.url);
            setLoading(false);
          }
        }
      }}
    >
      <Button icon={<UploadOutlined />}>点击上传</Button>
      {value && (
        <a
          style={{ display: "block", marginTop: "8px" }}
          href={value}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          查看已上传文件
        </a>
      )}
    </Upload>
  );
};

export default UploadFile;
