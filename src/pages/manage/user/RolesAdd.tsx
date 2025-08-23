import React, { useState, useEffect, useContext } from "react";
import { Input, Tree, Avatar } from "antd";
import { TeamOutlined } from "@ant-design/icons";
// @ts-ignore
import Highlighter from "react-highlight-words";

import { get, put } from "@/common/fetch";

import Title from "@/components/manage/Title";
import Card from "@/components/manage/Card";
import { Div } from "@/components/panda/css";
import { ThemeContext } from "@/common/context";

const { Search } = Input;
const RolesAdd = () => {
  const { themeCtx } = useContext(ThemeContext);
  const [searchList, setSearchList] = useState<any>([]);
  const [searchKey, setSearchKey] = useState("");

  const [roleTree, setRoleTree] = useState<any>([]);
  const [roleCheckedKeys, setRoleCheckedKeys] = useState<React.Key[]>([]);

  // 选择的用户信息
  const [selectUser, setSelectUser] = useState<any>({});

  useEffect(() => {
    get("/manage/system/role/list").then((res) => {
      let temp: any = [];
      for (let i = 0; i < res.objects.length; i++) {
        temp.push({
          title: res.objects[i].name,
          key: res.objects[i].identifier.toString(),
          icon: <TeamOutlined />,
        });
      }
      setRoleTree(temp);
    });
  }, []);

  // 当选择用户变化时, 对应变化权限
  useEffect(() => {
    if (selectUser.id) {
      setRoleCheckedKeys(selectUser.role ? selectUser.role.split(",") : []);
    } else {
      setRoleCheckedKeys([]);
    }
  }, [selectUser.id]);

  const onRoleCheck = (checkedKeysValue: any) => {
    setRoleCheckedKeys(checkedKeysValue);
    // 更新用户权限
    if (selectUser.id) {
      put("/manage/user/update/user/role", {
        uid: selectUser.id,
        role: checkedKeysValue.toString(),
      }).then((_res) => {
        searchUsers();
      });
    }
  };

  function searchUsers() {
    get("/manage/user/search/" + searchKey).then((res) => {
      setSearchList(res.objects);
    });
  }

  return (
    <>
      <Title title="角色添加" />
      <Div
        display="flex"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        margin="10px 0 0 0"
      >
        <Card title="搜索用户" width="260px" margin="0 10px 0 0" padding="8px">
          <Search
            placeholder="请输入昵称"
            value={searchKey}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchList([]);
                setSelectUser({});
              }
              setSearchKey(e.target.value);
            }}
            onSearch={() => {
              if (!searchKey) {
                return;
              }
              searchUsers();
            }}
            style={{ width: "100%" }}
          />
          <Div
            w="100%"
            overflowY="scroll"
            style={{
              maxHeight: "calc(100vh - 155px)",
            }}
            margin="5px 0 0 0"
          >
            {searchList.length > 0 &&
              searchList.map((item: any, index: number) => (
                <Div
                  w="100%"
                  borderRadius="6px"
                  cursor="pointer"
                  key={index}
                  onClick={() => setSelectUser(item)}
                  bg={
                    selectUser.id === item.id
                      ? themeCtx === "dark"
                        ? "#3f739d"
                        : "#bae0ff"
                      : themeCtx === "dark"
                      ? "#3a3a3a"
                      : "#f2f2f2"
                  }
                  marginBottom="5px"
                >
                  <Div
                    display="flex"
                    flexDir="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    padding="5px"
                  >
                    <Avatar
                      src={item.avatar_url || null}
                      style={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                        flexShrink: 0,
                      }}
                    >
                      U
                    </Avatar>
                    <Div
                      display="flex"
                      flexDir="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      margin="0 0 0 10px"
                      overflow="hidden"
                    >
                      <Highlighter
                        style={{
                          color:
                            themeCtx === "dark"
                              ? "rgba(255, 255, 255, 0.85)"
                              : "#000",
                        }}
                        highlightClassName="height_light_words"
                        searchWords={[searchKey]}
                        autoEscape={true}
                        textToHighlight={item.username || ""}
                      />
                      <Div color="#8a8a8a">
                        <Highlighter
                          highlightClassName="height_light_words"
                          searchWords={[searchKey]}
                          autoEscape={true}
                          textToHighlight={item.nickname || ""}
                        />
                      </Div>
                    </Div>
                  </Div>
                </Div>
              ))}
          </Div>
        </Card>

        <Card
          title="用户角色"
          width="260px"
          maxConHeight={"calc(100vh - 155px)"}
          margin="0 10px 0 0"
          padding="8px"
        >
          <Tree
            selectable={false}
            checkable
            showIcon
            onCheck={onRoleCheck}
            checkedKeys={roleCheckedKeys}
            treeData={roleTree}
          />
        </Card>
      </Div>
    </>
  );
};

export default RolesAdd;
