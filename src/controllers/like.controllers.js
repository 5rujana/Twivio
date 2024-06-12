import mongoose , {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Tweet } from "../models/tweet.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate video ID
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id });

    if (existingLike) {
        await Like.deleteOne({ video: videoId, likedBy: req.user._id });
    } else {
        // Otherwise, create a new like
        await Like.create({ video: videoId, likedBy: req.user._id });
    }


    const hasUserLiked = existingLike ? false : true;
    const totalLikes = await Like.countDocuments({ video: videoId });


    res.status(200).json(new ApiResponse(200, { totalLikes, hasUserLiked }, "Video like is toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    const existingLike = await Like.findOne({comment:commentId,likedBy:req.user._id})
    if (existingLike) {
        await   Like.deleteOne({ comment:commentId, likedBy: req.user._id })
    }
    else {
        await Like.updateOne({ comment:commentId, likedBy: req.user._id });
    }
    const hasUserLiked = existingLike ? false : true;
    const totalLikes = await Like.countDocuments({ comment: commentId });
    

    res.status(200).json(new ApiResponse(200, { totalLikes, hasUserLiked }, "Comment like is toggled successfully"));



})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
    const existingLike = await Like.findOne({tweet:tweetId,likedBy:req.user._id})
    if (existingLike) {
        await Like.deleteOne({ tweet:tweetId, likedBy: req.user._id })
    }
    else {
        await Like.updateOne({ tweet:tweetId, likedBy: req.user._id });
    }

    const hasUserLiked = existingLike ? false : true;
    const totalLikes = await Like.countDocuments({ tweet: tweetId});
    
    res
    .status(200)
    .json(new ApiResponse(200,{totalLikes,hasUserLiked},"Tweet like is toggled successfully"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    
    const likedvideos = await Like.find({user:req.user._id,video:{$exists:true}}).populate('video');
    res
    .status(200)
    .json(new ApiResponse(200,{likedvideos},"Liked videos are fetched successfully"))

})

const getLikedTweets = asyncHandler(async (req, res) => {
    //TODO: get all liked tweets
    const likedtweets = await Like.find({user:req.user._id,tweet:{$exists:true}})
    res
    .status(200)
    .json(new ApiResponse(200,{likedtweets},"Liked tweets are fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedTweets
}