const express = require("express");
const handleResponse = require("../service/handleResponse");
const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");

const uploadFiles = {
  uploadImg: handleResponse.errorAsync(async(req, res, next) => {
    if(!req.files.length) {
      return next(handleResponse.errorNew(400, "尚未上傳檔案", next));
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if(dimensions.width !== dimensions.height) {
      return next(handleResponse.errorNew(400, "圖片長寬不符合 1:1 尺寸", next))
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
  });
    handleResponse.success(res, "圖片上傳成功", response.data.link)
  })
};

module.exports = uploadFiles;