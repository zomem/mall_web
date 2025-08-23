// 生成随机字符
export const random_str = (length: number) => {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

// 获取图片名字
export const img_name = (url: string) => {
  let list = url.split("/");
  return list[list.length - 1];
};

// 去掉前后空格
export const trim = (str: string) => {
  return str.replace(/^\s+|\s+$/g, "");
};
