package com.ratemyspot.service;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserResponse;
import com.ratemyspot.util.Result;

public interface FollowService {

    /** Toggle follow status for a target user. */
    Result<Void> toggle(Long targetUserId);

    /** Get paginated list of followers for a user. */
    Result<PageResult<UserResponse>> getFollowers(Long targetUserId, Integer pageNum, Integer pageSize);

    /** Get paginated list of users a user is following. */
    Result<PageResult<UserResponse>> getFollowing(Long targetUserId, Integer pageNum, Integer pageSize);
}
