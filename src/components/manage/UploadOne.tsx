import { useState } from "react";
import { Upload } from "antd";
import { CONFIG } from "@/common/fetch";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { FileCategory } from "@/common/constants";
import ImgCrop from "antd-img-crop";

interface UploadOneProps {
  category: FileCategory;
  value?: string;
  onChange?: (value: string) => void;
  url?: string;
}
const UploadOne = ({
  value = "",
  onChange,
  category = FileCategory.ProductCat,
  url = "/upload/file",
}: UploadOneProps) => {
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <button
      style={{ border: 0, background: "none", cursor: "pointer" }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );
  return (
    <ImgCrop aspectSlider minAspect={0.1} maxAspect={10}>
      <Upload
        name="file"
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
        action={CONFIG.API_URL + url}
        listType="picture-card"
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
        {value ? (
          <img src={value} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
};

export default UploadOne;
