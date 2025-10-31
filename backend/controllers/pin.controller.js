import Pin from "../models/pin.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getPins = async (req, res) => {
  const pageNumber = Number(req.query.cursor) || 0;
  const search = req.query.search;
  const userId = req.query.userId;
  const boardId = req.query.boardId;
  const LIMIT = 21;
  try {
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
      .skip(pageNumber * LIMIT)
      .populate("user", "username img");

    const hasNextPage = pins.length === LIMIT;
    res.status(200).json({ pins, nextCursor: hasNextPage ? pageNumber + 1 : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPin = async (req, res) => {
  const { id } = req.params;
  try {
    const pin = await Pin.findById(id).populate("user", "username img");
    res.status(200).json(pin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPin = async (req, res) => {
  try {
    const { title, description, link, tags, board, textOptions, canvasOptions } = req.body;
    const media = req.files?.media;

    // 基础参数验证
    if (!title?.trim()) return res.status(400).json({ message: "请填写标题" });
    if (!description?.trim()) return res.status(400).json({ message: "请填写描述" });
    if (!media) return res.status(400).json({ message: "请选择图片文件" });
    if (board && !mongoose.Types.ObjectId.isValid(board)) {
      return res.status(400).json({ message: "无效的画板ID" });
    }

    // 解析文本和画布选项（添加默认值）
    const parseTextOptions = textOptions ? JSON.parse(textOptions) : {
      text: "",
      fontSize: 16,
      color: "#000000",
      top: 0,
      left: 0,
    };
    const parseCanvasOptions = canvasOptions ? JSON.parse(canvasOptions) : {
      size: "original",
      backgroundColor: "#ffffff", // 默认白色背景
      height: 600,
      orientation: "portrait"
    };

    // 确保必要属性存在
    parseCanvasOptions.size = parseCanvasOptions.size || "original";
    parseCanvasOptions.backgroundColor = parseCanvasOptions.backgroundColor || "#ffffff";
    parseTextOptions.text = parseTextOptions.text || "";
    parseTextOptions.fontSize = parseTextOptions.fontSize || 16;
    parseTextOptions.color = parseTextOptions.color || "#000000";

    // 获取原始图片 metadata
    const metadata = await sharp(media.data).metadata();
    if (!metadata.width || !metadata.height) {
      return res.status(400).json({ message: "无法解析图片尺寸" });
    }

    // 计算原始方向和比例
    const originalOrientation = metadata.width < metadata.height ? "portrait" : "landscape";
    const originalAspectRatio = metadata.width / metadata.height;
    let clientAspectRatio = originalAspectRatio;

    // 安全处理尺寸比例计算
    if (parseCanvasOptions.size !== "original" && parseCanvasOptions.size?.includes(':')) {
      const [widthRatio, heightRatio] = parseCanvasOptions.size.split(":");
      if (!isNaN(widthRatio) && !isNaN(heightRatio) && Number(heightRatio) !== 0) {
        clientAspectRatio = Number(widthRatio) / Number(heightRatio);
      }
    }

    // 计算宽高并限制最大值（避免ImageKit处理失败）
    const MAX_WIDTH = 3000; // 安全最大宽度（根据ImageKit能力调整）
    let width = metadata.width;
    let height = width / clientAspectRatio;

    // 限制最大宽度，按比例缩放
    if (width > MAX_WIDTH) {
      height = (height / width) * MAX_WIDTH;
      width = MAX_WIDTH;
    }

    // 确保尺寸为整数
    width = Math.round(width);
    height = Math.round(height);

    // 计算文本位置（避免越界）
    const textLeftPosition = Math.min(
      Math.round((parseTextOptions.left / 375) * width), // 375对应前端画布宽度
      width - 100 // 防止文本超出右侧
    );
    const textTopPosition = Math.min(
      Math.round((parseTextOptions.top / parseCanvasOptions.height) * height),
      height - 50 // 防止文本超出底部
    );

    // 构建正确的ImageKit转换参数（无多余逗号，参数格式正确）
    const resizeParam = originalAspectRatio > clientAspectRatio ? "pad_resize" : "";
    const bgColor = parseCanvasOptions.backgroundColor.substring(1); // 移除#号
    const textParam = parseTextOptions.text.trim() 
      ? `l-text,i-${encodeURIComponent(parseTextOptions.text)},fs-${Math.round(parseTextOptions.fontSize * 2.1)},lx-${textLeftPosition},ly-${textTopPosition},co-${parseTextOptions.color.substring(1)},l-end`
      : "";

    // 拼接参数（处理空值，避免多余逗号）
    const params = [
      `w-${width}`,
      `h-${height}`,
      resizeParam,
      `bg-${bgColor}`,
      textParam
    ].filter(Boolean); // 过滤空字符串

    const transformationString = params.join(",");

    // 初始化ImageKit
    const imagekit = new ImageKit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    // 上传图片
    const uploadResponse = await imagekit.upload({
      file: media.data,
      fileName: `${Date.now()}-${media.name.replace(/\s+/g, "-")}`, // 处理文件名空格
      folder: "pins",
      transformation: { pre: transformationString }
    });

    // 创建Pin记录
    const newPin = await Pin.create({
      user: req.userId,
      title,
      description,
      link: link || null,
      tags: tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      board: board || null,
      media: uploadResponse.filePath,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });

    res.status(201).json(newPin);

  } catch (error) {
    console.error("创建Pin失败:", error);
    // 针对ImageKit转换错误的详细提示
    if (error.message.includes("processing pre-transformation")) {
      return res.status(400).json({
        message: "图片处理失败，请检查尺寸或格式",
        transformation: error.transformation?.pre || "参数错误",
        details: "可能是尺寸过大或文本参数格式错误"
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const interactionCheck = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  try {
    const likeCount = await Like.countDocuments({ pin: id });

    if (!token) {
      return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
      }

      const userId = payload.id;
      const isLiked = await Like.findOne({ pin: id, user: userId });
      const isSaved = await Save.findOne({ pin: id, user: userId });
      
      return res.status(200).json({
        likeCount,
        isLiked: !!isLiked,
        isSaved: !!isSaved
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const interact = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!["like", "save"].includes(type)) {
      return res.status(400).json({ message: "无效的互动类型" });
    }

    const Model = type === "like" ? Like : Save;
    const existing = await Model.findOne({ pin: id, user: req.userId });

    if (existing) {
      await Model.deleteOne({ _id: existing._id });
    } else {
      await Model.create({ pin: id, user: req.userId });
    }

    return res.status(200).json({ message: "互动成功" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};