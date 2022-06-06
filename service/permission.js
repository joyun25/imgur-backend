const jwt = require("jsonwebtoken");
const handleResponse = require("./handleResponse");
const User = require("../models/users");

const permission = {
  isAuth: handleResponse.errorAsync(async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if(!token) {
      return next(handleResponse.errorNew("401", "你尚未登入", next));
    }
    
    // 驗證 token 正確性
    const decoded = await new Promise((resolve, reject) => {
      // 使用 token 和 process.env.JWT_SECRET 兩個參數來看 JWT 有無通過，並解密
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
          reject(err)
        }else{
          resolve(payload)
        }
      });
    });
    
    // 取出解密後的 ID 資訊（使用者資訊）
    const currentUser = await User.findById(decoded.id); // 造訪資料庫
    
    // 將 req 加上 user 屬性，並在這個屬性上帶入資料，稍後使用
    req.user = currentUser;
    next();
  }),
  generateSendJWT: (user, statusCode, res) => {
    // 產生 JWT token
    const token = jwt.sign( // 產生簽證
      {id: user.id}, // payload 裡要放入何種資訊，例如：名稱、ID（不可放入信箱、密碼）
      process.env.JWT_SECRET, // 拿來混淆的字串
      {expiresIn: process.env.JWT_EXPIRES_DAY} // 自訂的選項，例如：設定過期時間
    );
    
    // 清除使用者 password 資料，防止意外將 password 資料存入資料庫
    user.password = undefined;
    
    // 將 token（金鑰、簽證）傳送對方
    res.status(statusCode).json({
      status: "success",
      user: {
        token,
        name: user.name // 防止意外將整個 user 存入時，將密碼也存入資料庫，千萬不可
      }
    });
  },
};

module.exports = permission;