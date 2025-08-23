import { useState, useRef, useEffect } from "react";
import { Modal, Button, Input, message } from "antd";

import { CONFIG } from "@/common/fetch";

import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

import { FileCategory } from "@/common/constants";

import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import axios from "axios";

interface RichTextProps {
  value?: string;
  onChange?: (d: string) => void;
  category?: FileCategory;
}

const RichText = ({
  value,
  onChange = () => {},
  category = FileCategory.Product,
}: RichTextProps) => {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [open, setOpen] = useState(false);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {
      uploadImage: {
        // fieldName: "file",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem(CONFIG.ZM_LOGIN_TOKEN)}`,
        // },
        // meta: {
        //   name: "rich_text.jpg",
        //   category,
        // },
        // server: CONFIG.API_URL + "/upload/file",
        async customUpload(file: any, insertFn: any) {
          const formData = new FormData();
          formData.append("name", "rich_text.jpg");
          formData.append("category", category);
          formData.append("file", file);

          const res = await axios.post(
            CONFIG.API_URL + "/upload/file",
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  CONFIG.ZM_LOGIN_TOKEN,
                )}`,
              },
            },
          );
          insertFn(res.data.objects.url, "", "");
        },
      },
      customInsert(res: any, insertFn: any) {
        console.log(res);
        // TS 语法
        // customInsert(res, insertFn) {                  // JS 语法
        // res 即服务端的返回结果
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(res.objects.url, "", "");
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Input
          value={value}
          placeholder="请编辑文本"
          readOnly
          style={{ flex: 1 }}
        />

        <Button onClick={() => setOpen(true)} style={{ marginLeft: 10 }}>
          编辑
        </Button>
      </div>

      <Modal
        open={open}
        width="90%"
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => setOpen(false)}>
            确定
          </Button>,
        ]}
      >
        <div
          style={{ minHeight: 500, borderRadius: "8px", overflow: "hidden" }}
        >
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={value}
            onCreated={setEditor}
            onChange={(editor) => onChange(editor.getHtml())}
            mode="default"
            style={{ height: "450px", overflowY: "hidden" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RichText;
