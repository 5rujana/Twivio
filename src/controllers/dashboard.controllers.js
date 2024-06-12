import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params
    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const totalVideos = await Video.countDocuments({owner:channelId})
    const totalSubscribers = await Subscription.countDocuments({channel:channelId})
    const totalLikes = await Like.countDocuments({likedBy:channelId}) //work on this
    const totalViews = await Video.aggregate([ //work on this
        {
            $match:{channel:channelId}
        },
        {
            $group:{ 
                _id:null,
                totalViews:{$sum:"$views"}
            }
        }
    ])

    res
    .status(200)
    .json(new ApiResponse(200,{totalVideos,totalSubscribers,totalLikes,totalViews},"Channel stats are fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const videos = await Video.aggregatePaginate(
        {channel:channelId},
        {
            page:parseInt(page),
            limit:parseInt(limit),
            sort:{createdAt:"desc"},
            customLabels:{
                docs:"videos"
            }
        }
    )

    res
    .status(200)
    .json(new ApiResponse(200,{videos},"Videos are fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }