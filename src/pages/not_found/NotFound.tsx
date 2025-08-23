import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  function nav_home() {
    navigate("/");
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，你访问的页面不存在！"
      extra={
        <Button onClick={nav_home} type="primary">
          返回首页
        </Button>
      }
    />
  );
};

export default NotFound;
