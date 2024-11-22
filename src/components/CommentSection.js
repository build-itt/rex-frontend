import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CommentSection.css';

export default function CommentSectionComponent() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null); // State to track the ID of the comment being deleted
  const [loadingComments, setLoadingComments] = useState(false); // State for loading comments
  const [loadingMore, setLoadingMore] = useState(false); // State for "Load More"
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token'); 

  // Memoized fetchComments function to avoid recreating it every render
  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);  // Start loading
      const response = await axios.get(`https://matrix-backend-orcin.vercel.app/store/comments/`, {
        params: { page: currentPage, limit: commentsPerPage }
      });
      
      const newComments = response.data;

      // Append only unique comments (avoid duplicates)
      setComments(prevComments => {
        const uniqueNewComments = newComments.filter(newComment => {
          return !prevComments.some(existingComment => existingComment.id === newComment.id);
        });
        return [...prevComments, ...uniqueNewComments];  // Append unique comments
      });
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoadingComments(false);  // Stop loading
    }
  }, [currentPage, commentsPerPage]);

  // Fetch comments when the component mounts or when currentPage changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!newComment) return;

    const formData = new FormData();
    formData.append('body', newComment);  
    formData.append('user', user.username);  
    if (media) formData.append('attachment', media);  

    try {
      setLoading(true);
      const response = await axios.post(
        'https://matrix-backend-orcin.vercel.app/store/create-comment/',
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,  
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const newCommentData = response.data;

      // Append new comment to the list
      setComments(prevComments => [{ 
        ...newCommentData,  
        name: user.username,  
        created: new Date().toISOString(),
        id: newCommentData.id, // Ensure the new comment has an id
        created_by: user.id // Ensure the new comment has the created_by property
      }, ...prevComments]);

      setNewComment('');
      setMedia(null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to post comment", error);
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeletingCommentId(commentId); // Set the ID of the comment being deleted
      await axios.delete(`https://matrix-backend-orcin.vercel.app/store/delete-comment/${commentId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      // Remove deleted comment from the list
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    } finally {
      setDeletingCommentId(null); // Reset the deleting comment ID
    }
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file); 
      setNewComment(`Uploaded: ${file.name}`);  // Update the comment input with the file name 
    }
  };

  const loadMoreComments = () => {
    setLoadingMore(true);
    setCurrentPage(prevPage => prevPage + 1);
    setLoadingMore(false);
  };

  // Helper function to get the file extension from the URL (excluding query params)
  const getFileExtension = (url) => {
    const cleanUrl = url.split('?')[0];  
    return cleanUrl.split('.').pop().toLowerCase();  
  };

  const isImage = (url) => {
    const ext = getFileExtension(url);
    return ['jpeg', 'jpg', 'gif', 'png'].includes(ext);
  };

  const isVideo = (url) => {
    const ext = getFileExtension(url);
    return ['mp4', 'webm', 'ogg'].includes(ext);
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      
      <textarea
        className="comment-input"
        placeholder="Write a comment... @mention"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows="3"
      />

      <label className="upload-button" htmlFor="file-upload">Upload Image/Video</label>
      <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleMediaUpload}
        accept="image/*,video/*"
      />

      <button className="post-button" onClick={handlePostComment} disabled={loading}>
        {loading ? <div className="loader"></div> : 'Post'}
      </button>

      <div className="comment-list">
        {loadingComments ? (
          <div className="loader"></div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className='comment-head'>
              <p>{comment.name || 'Anonymous'}</p>
              <p>{new Date(comment.created).toLocaleString()}</p>
              </div>
              <p className='comment-body'>
                {comment.body.split(' ').map((word, i) => (
                  word.startsWith('@') ? (
                    <span key={i} className="mention">{word} </span>
                  ) : (
                    word + ' '
                  )
                ))}
              </p>

              {comment.attachment && (
                <div className="media-preview">
                  {isImage(comment.attachment) ? (
                    <img src={comment.attachment} alt="Comment Media" />
                  ) : isVideo(comment.attachment) ? (
                    <video controls>
                      <source src={comment.attachment} type="video/mp4" />
                    </video>
                  ) : (
                    <p>Unsupported media format</p>
                  )}
                </div>
              )}
              {/* Show delete button for user's own comments */}
              {user.id === comment.created_by && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  {deletingCommentId === comment.id ? <div className="loader"></div> : 'Delete'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Conditionally render "Load More" button only if comments exceed 10 */}
      {comments.length > 10 && (
        <div className="load-more" onClick={loadMoreComments}>
          {loadingMore ? <div className="loader"></div> : 'Load More'}
        </div>
      )}
    </div>
  );
}