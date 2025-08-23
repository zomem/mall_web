import { useContext, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import css from "@/components/panda/css";
import { ThemeContext, BaseContext } from "@/common/context";
import { post, CONFIG } from "@/common/fetch";
import { UserContext } from "@/common/context";
import { useNavigate } from "react-router";
import { isNumWord } from "@/utils/veriInfo";

type FieldType = {
  username?: string;
  password?: string;
  password2?: string;
  remember?: string;
};

const Login = () => {
  const { themeCtx } = useContext(ThemeContext);
  const user_context = useContext(UserContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    if (isLogin) {
      post("/login/manage", {
        username: values.username,
        password: values.password,
      }).then((res: Res<User>) => {
        console.log("登录返回：：：", res);
        if (res.status !== 0) {
          localStorage.setItem(
            CONFIG.ZM_USER_INFO,
            JSON.stringify(res.objects)
          );
          localStorage.setItem(CONFIG.ZM_LOGIN_TOKEN, res.objects.token);
          user_context.setUser(res.objects);
          navigate("/");
        } else {
          return message.error(res.message);
        }
      });
    } else {
      if (!values.username) {
        return message.error("用户名只能为数字、字母和下划线");
      }
      if (!isNumWord(values.username)) {
        return message.error("用户名只能为数字、字母和下划线");
      }
      if (values.username.length < 6) {
        return message.error("用户名长度不能少于6。");
      }
      if (!values.password || values.password.length < 8) {
        return message.error("密码位数不能少于8位");
      }
      if (values.password !== values.password2) {
        return message.error("两次密码不一致。");
      }
      post("/login/register/manage", {
        username: values.username,
        password: values.password,
        password2: values.password2,
      }).then((res) => {
        if (res.status !== 0) {
          localStorage.setItem(
            CONFIG.ZM_USER_INFO,
            JSON.stringify(res.objects)
          );
          localStorage.setItem(CONFIG.ZM_LOGIN_TOKEN, res.objects.token);
          user_context.setUser(res.objects);
          navigate("/");
        } else {
          return message.error(res.message);
        }
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      className={css({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeCtx == "dark" ? "#000" : "#f6f6f6",
      })}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>

        {!isLogin && (
          <Form.Item<FieldType>
            label="确认密码"
            name="password2"
            rules={[{ required: true, message: "请确认密码" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {/* <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {isLogin ? "登录" : "注册"}
          </Button>
          <Button onClick={() => setIsLogin(!isLogin)} type="link">
            {isLogin ? "去注册" : "去登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
