import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const comments = await Comment.aggregatePaginate(
        {video:videoId},
        {
            page:parseInt(page),
            limit:parseInt(limit),
            sort:{createdAt:"desc"},
            customLabels:{
                docs:"comments"
            }
        }
    )

    res
    .status(200)
    .json(new ApiResponse(200,{comments},"Comments are fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {text} = req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    if(!text.trim()){
        throw new ApiError(400,"Comment text is required")
    }
    const comment = await Comment.create({
        content:text,
        video:videoId,
        user:req.user._id
    })

    res
    .status(201)
    .json(new ApiResponse(201,{comment},"Comment is created successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const {text} = req.body
    if(!text.trim()){
        throw new ApiError(400,"Comment text is required")
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content:text
        },
        {new:true}
    
    )
    
    res
    .status(200)
    .json(new ApiResponse(200,{},"Comment is updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }
    await Comment.findByIdAndDelete(commentId)
    res
    .status(200)
    .json(new ApiResponse(200,{},"Comment is deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }