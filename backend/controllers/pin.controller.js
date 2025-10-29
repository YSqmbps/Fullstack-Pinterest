import Pin from "../models/pin.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import jwt from "jsonwebtoken";
export const getPins = async (req, res) => {
  const pageNumber = Number(req.query.cursor) || 0;
  const search = req.query.search;
  const userId = req.query.userId;
  const boardId = req.query.boardId;
  const LIMIT = 21;
  const pins = await Pin.find(
    search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { tags: { $in: [search] } },
          ],
        }
      : userId
      ? { user: userId }
      : boardId
      ? { board: boardId }
      : {}
  )
    .limit(LIMIT)
    .skip(pageNumber * LIMIT);

  const hasNextPage = pins.length === LIMIT;

  res
    .status(200)
    .json({ pins, nextCursor: hasNextPage ? pageNumber + 1 : null });
};

export const getPin = async (req, res) => {
  const { id } = req.params;
  const pin = await Pin.findById(id).populate("user", "username img");
  res.status(200).json(pin);
};

// 在文件顶部导入mongoose（如果尚未导入）
import mongoose from "mongoose";

// 修改createPin函数中的验证逻辑
// 修复transformation字符串生成逻辑
export const createPin = async (req, res) => {
  const { title, description, link, tags, board, textOptions, canvasOptions } =
    req.body;
  const media = req.files.media;
  const file = req.files.file;

  // 修复条件判断中的逗号运算符问题
  if (!title || !description || !media) {
    return res.status(400).json({ message: "缺少必要字段" });
  }

  // 添加board字段的ObjectId验证
  if (board && !mongoose.Types.ObjectId.isValid(board)) {
    return res.status(400).json({ message: "无效的board ID格式" });
  }

  const parseTextOptions = JSON.parse(textOptions || "{}");
  const parseCanvasOptions = JSON.parse(canvasOptions || "{}");

  const metadata = await sharp(media.data).metadata();

  const originalOrientation =
    metadata.width < metadata.height ? "portrait" : "landscape";
  const originalAspectRatio = metadata.width / metadata.height;

  let clientAspectRatio;
  let width;
  let height;

  if (parseCanvasOptions.size !== "original") {
    clientAspectRatio =
      parseCanvasOptions.size.split(":")[0] /
      parseCanvasOptions.size.split(":")[1];
  } else {
    parseCanvasOptions.orientation = originalOrientation
      ? (clientAspectRatio = originalAspectRatio)
      : (clientAspectRatio = 1 / originalAspectRatio);
  }

  width = metadata.width;
  height = metadata.width / clientAspectRatio;

  const imagekit = new ImageKit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: process.env.IK_URL_ENDPOINT,
  });

  const textLeftPosition = Math.round((parseTextOptions.left / 375) * width);
  const textTopPosition = Math.round(
    (parseTextOptions.top / parseCanvasOptions.height) * height
  );

  // 修复转换字符串生成，确保没有多余的换行符和空格
  const transformationString = `w-${width},h-${height}${
    originalAspectRatio > clientAspectRatio ? ",cm-pad_resize" : ""
  },bg-${parseCanvasOptions.backgroundColor.substring(1)}${
    parseTextOptions.text
      ? `,l-text,i-${encodeURIComponent(parseTextOptions.text)},
        fs-${Math.round(parseTextOptions.fontSize * 2.1)},
        lx-${textLeftPosition},ly-${textTopPosition},
        co-${parseTextOptions.color.substring(1)},l-end`
      : ""
  }`.replace(/\s+/g, ""); // 移除所有空白字符

  imagekit
    .upload({
      file: media.data,
      fileName: media.name,
      folder: "test",
      transformation: {
        pre: transformationString,
      },
    })
    .then(async (response) => {
      const newPin = await Pin.create({
        user: req.userId,
        title,
        description,
        link: link || null,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        board: board || null,
        media: response.filePath,
        width: response.width,
        height: response.height,
      });
      return res.status(201).json(newPin);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json("err");
    });
};

export const interactionCheck = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const likeCount = await Like.countDocuments({ pin: id });

  if (!token) {
    return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res
        .status(200)
        .json({ likeCount, isLiked: false, isSaved: false });
    }

    const userId = payload.id;

    const isLiked = await Like.findOne({
      pin: id,
      user: userId,
    });
    const isSaved = await Save.findOne({
      pin: id,
      user: userId,
    });
    return res
      .status(200)
      .json({
        likeCount,
        isLiked: isLiked ? true : false,
        isSaved: isSaved ? true : false,
      });
  });
};

export const interact = async (req, res) => {
  const { id } = req.params;

  const { type } = req.body;

  if (type === "like") {
    const isLiked = await Like.findOne({
      pin: id,
      user: req.userId,
    });

    if (isLiked) {
      await Like.deleteOne({
        pin: id,
        user: req.userId,
      });
    } else {
      await Like.create({
        pin: id,
        user: req.userId,
      });
    }
  } else if (type === "save") {
    const isSaved = await Save.findOne({
      pin: id,
      user: req.userId,
    });

    if (isSaved) {
      await Save.deleteOne({
        pin: id,
        user: req.userId,
      });
    } else {
      await Save.create({
        pin: id,
        user: req.userId,
      });
    }
  }
    return res.status(200).json("互动成功");
};
