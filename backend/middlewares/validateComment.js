import { body, validationResult } from "express-validator";

// 评论内容验证规则
const validateCommentInput = [
    body("description")
        .notEmpty().withMessage("评论内容不能为空")
        .isLength({max: 200}).withMessage("评论内容不能超过200个字符"),
    
    // 验证结果处理
    (req,res,next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        next()
    }
]

export default validateCommentInput