import Pin from "../models/pin.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


// 定义在函数外部，确保try/catch都能访问
const MAX_UPLOAD_SIZE = 4000; // 本地压缩上限

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
    const { 
      title, 
      description, 
      link, 
      tags, 
      board,
      // 接收前端编辑的宽高参数（可选，没有则用原图尺寸）
      editWidth, 
      editHeight 
    } = req.body;
    const media = req.files?.media;

    // 基础验证
    if (!title?.trim()) return res.status(400).json({ message: "请填写标题" });
    if (!description?.trim()) return res.status(400).json({ message: "请填写描述" });
    if (!media) return res.status(400).json({ message: "请选择图片文件" });

    // 1. 获取原始图片信息
    const metadata = await sharp(media.data).metadata();
    if (!metadata.width || !metadata.height) {
      return res.status(400).json({ message: "无法解析图片尺寸" });
    }
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    // 2. 处理编辑尺寸（优先用前端传递的参数，否则用原图尺寸）
    // 解析前端传递的宽高（确保是数字且有效）
    let targetWidth = editWidth ? parseInt(editWidth, 10) : originalWidth;
    let targetHeight = editHeight ? parseInt(editHeight, 10) : originalHeight;

    // 验证尺寸有效性（防止非数字、负数、0）
    if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
      return res.status(400).json({ message: "无效的尺寸参数，请输入正整数" });
    }

    // 3. 本地处理图片（按目标尺寸缩放/裁剪，不依赖ImageKit转换）
    // 使用sharp直接将图片处理成目标尺寸
    const processedBuffer = await sharp(media.data)
      .resize(targetWidth, targetHeight, {
        fit: "cover", // 按比例缩放并裁剪，确保填满目标尺寸（可选："inside" 不裁剪只缩放）
        withoutEnlargement: false, // 允许放大（如果编辑时需要放大）
        background: { r: 255, g: 255, b: 255, alpha: 1 } // 透明图片补白
      })
      .jpeg({ quality: 85 }) // 保持图片质量
      .toBuffer();

    // 4. 上传处理后的图片到ImageKit（不设置transformation参数）
    const imagekit = new ImageKit({
      publicKey: process.env.IK_PUBLIC_KEY,
      privateKey: process.env.IK_PRIVATE_KEY,
      urlEndpoint: process.env.IK_URL_ENDPOINT,
    });

    const uploadResponse = await imagekit.upload({
      file: processedBuffer, // 上传本地处理后的图片
      fileName: `${Date.now()}-${media.name.replace(/\s+/g, "-")}`,
      folder: "pins",
      // 完全移除transformation参数，避免格式问题
      timeout: 120000, // 延长超时（大图片处理需要时间）
    });

    // 5. 存储编辑后的尺寸（确保前端显示时用处理后的尺寸）
    const newPin = await Pin.create({
      user: req.userId,
      title,
      description,
      link: link || null,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      board: board || null,
      media: uploadResponse.filePath,
      width: targetWidth, // 存储编辑后的宽（不是原始宽）
      height: targetHeight, // 存储编辑后的高（不是原始高）
    });

    res.status(201).json(newPin);

  } catch (error) {
    console.error("上传失败:", error);
    // 针对性错误提示
    if (error.message.includes("sharp")) {
      return res.status(400).json({ message: "图片处理失败，请检查尺寸是否合理" });
    }
    if (error.code === "ECONNRESET") {
      return res.status(504).json({ message: "网络超时，换张小点的图试试" });
    }
    res.status(500).json({ message: "服务器错误，请稍后再试" });
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