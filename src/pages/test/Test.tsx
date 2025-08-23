import css from "@/components/panda/css";

const Test = () => {
  const WECHAT_GZH_URL =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx461a03fbcb017902" +
    "&redirect_uri=" +
    encodeURIComponent("https://bieyoujing.com/dev_mall/web/test") +
    "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";

  const WECHAT_GZH_USER_URL =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx461a03fbcb017902" +
    "&redirect_uri=" +
    encodeURIComponent("https://bieyoujing.com/dev_mall/web/test") +
    "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  console.log("codeee33e", code);

  return (
    <div
      className={css({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <a href={WECHAT_GZH_URL}>微信公众号登录</a>
      <a href={WECHAT_GZH_USER_URL}>微信公众号授权</a>
      <h2>{code}</h2>
    </div>
  );
};

export default Test;
