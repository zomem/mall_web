import { useState, useContext, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Row, Col, message } from "antd";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { get, post, put } from "@/common/fetch";
import { BaseContext } from "@/common/context";
import { Div } from "@/components/panda/css";

function SearchWord() {
  const [hotword, setHotword] = useState<string>("");

  useEffect(() => {
    get("/manage/mall/search/word/info").then((res) => {
      console.log("re ", res.objects);
      setHotword(res.objects.key_word);
    });
  }, []);

  function onSave() {
    post("/manage/mall/search/word/add", {
      key_word: hotword,
    }).then((res) => {
      if (res.status === 1) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    });
  }

  return (
    <>
      <Title title="搜索热词" />
      <Div
        display="flex"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        margin="10px 0 0 0"
      >
        <Card
          title="编辑自动保存"
          width="260px"
          margin="0 10px 0 0"
          padding="8px"
        >
          <Input
            value={hotword}
            placeholder="请输入热词"
            onChange={(e) => {
              setHotword(e.target.value);
            }}
            onBlur={(_) => {
              onSave();
            }}
          />
        </Card>
      </Div>
    </>
  );
}

export default SearchWord;
