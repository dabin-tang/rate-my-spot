package com.ratemyspot.service;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserResponse;
import com.ratemyspot.util.Result;

public interface FollowService {

    /** Toggle follow status for a target user. */
    Result<Void> toggle(Long targetUserId);

    /** Get paginated list of followers for the current user. */
    Result<PageResult<UserResponse>> getFollowers(Integer pageNum, Integer pageSize);

    /** Get paginated list of users the current user is following. */
    Result<PageResult<UserResponse>> getFollowing(Integer pageNum, Integer pageSize);
}
