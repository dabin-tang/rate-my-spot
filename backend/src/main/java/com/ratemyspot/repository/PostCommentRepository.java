package com.ratemyspot.repository;

import com.ratemyspot.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    /** Retrieve all comments belonging to a given post, ordered by creation time ascending. */
    List<PostComment> findAllByPostIdOrderByCreateTimeAsc(Long postId);

    /** Delete all child replies of a given parent comment. */
    void deleteAllByParentId(Long parentId);
}

