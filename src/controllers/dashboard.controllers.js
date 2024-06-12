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
    const totalViews = await Video.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(req.user?._id)
                }
            },
            {
                $match: {
                    views: {
                        $gt: 0
                    }
                }
            },
            {
                $group: {
                    _id: "$views",
                    totalViews: {
                        $sum: "$views"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalViews: 1
                }
            }
        ]
    )
    const totalVideosViews = totalViews[0]

    const totalLikes = await Like.aggregate(
        [
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "allVideos",
                }
            },
            {
                $unwind: "$allVideos" 
            },
            {
                $match: {
                    "allVideos.owner": new mongoose.Types.ObjectId(req.user?._id)
                }
            },
            {
                $group: {
                    _id: null,  
                    totalVideosLikes: {
                        $sum: 1 
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVideosLikes: 1
                }
            },   
        ]
    )

    const totalVideosLikes = totalLikes[0]  

    
    res
    .status(200)
    .json(new ApiResponse(200,{totalVideos,totalSubscribers,totalVideosLikes,totalVideosViews},"Channel stats are fetched successfully"))
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