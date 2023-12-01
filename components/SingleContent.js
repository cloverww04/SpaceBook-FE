import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../utils/context/authContext';
import { getSingleContent } from '../api/spaceContentData';
import {
  getComments, createComment, updateComments, deleteComment,
} from '../api/commentData';
import planet from '../img/planet.png';
import stars from '../img/stars.png';
import galaxy from '../img/galaxy.png';
import random from '../img/random.png';
import getSingleUser from '../api/userData';

const objectImages = {
  1: planet,
  2: stars,
  3: galaxy,
  4: random,
};

const SingleContent = ({ contentId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState();
  const [userNames, setUserNames] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [comments, setCommments] = useState([]);
  const [editComment, setEditComment] = useState(null);

  const fetchUserName = async (userId) => {
    try {
      const users = await getSingleUser(userId);
      return `${users.firstName} ${users.lastName}`;
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'Unknown User';
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const commentData = {
        content: newComment,
        userId: user.userId,
      };

      if (editComment && editComment.id) {
        await updateComments(editComment.id, { content: newComment });
        setEditComment(null);
      } else {
        const createdComment = await createComment(contentId, commentData);
        setCommments((prevComments) => [...prevComments, createdComment]);
      }
      setNewComment('');
    } catch (error) {
      console.error('Error creating/updating comment:', error);
    }
    // window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentData = await getSingleContent(contentId);
        setContent(contentData);

        const commentsData = await getComments(contentId);
        const sortedComments = commentsData.slice().sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        const userPromises = sortedComments.map((comment) => fetchUserName(comment.userId));
        const resolvedUserNames = await Promise.all(userPromises);
        setCommments(sortedComments);
        setUserNames(resolvedUserNames);
      } catch (error) {
        console.error('Error fetching content and comments:', error);
      }
    };

    fetchData();
  }, [contentId, comments.length, editComment]);

  const formatDate = (dateTimeString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateTimeString) => {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString(undefined, options);
  };

  const handleEditComment = (comment) => {
    setEditComment(comment || {});
    setNewComment(comment?.content || '');
  };

  const handleCancelEdit = () => {
    setEditComment(null);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setCommments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  const imageId = content.spaceObjectContents?.[0]?.spaceObjectId;
  const objectImage = objectImages[imageId] || random;

  return (
    <>
      <div className="d-flex flex-column justify-content-center mt-4 align-items-center">
        <Card className="bg-dark text-white" style={{ maxWidth: '800px' }}>

          <Card.Header style={{ marginLeft: '-10px' }} className="d-flex justify-content-between">
            <div>{content.spaceObjectContents?.[0]?.spaceObject?.name}</div>
            <div>Posted by: {user.firstName} {user.lastName}</div>
          </Card.Header>
          <Card.Title style={{ marginLeft: '15px' }}>{content.title}</Card.Title>
          <Card.Text style={{ marginLeft: '15px' }}>{content.description}</Card.Text>
          <Card.Img src={objectImage.src} alt="Card image" height={400} />
          <Card.ImgOverlay />
          <Card.Title style={{ marginLeft: '15px' }} className="mt-2">Comments : </Card.Title>
        </Card>
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className="row mb-2 bg-dark text-white"
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              width: '100%',
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            <div className="col-md-12">
              <div>{userNames[index]}: {comment.content}</div>
            </div>
            <div className="col-md-12 text-right bg-dark text-white">
              <div style={{ fontSize: '14px' }}>{formatDate(comment.createdDate)} {formatTime(comment.createdDate)} {comment.userId === user.userId && (
              <>
                <Button size="sm" onClick={() => handleEditComment(comment)} style={{ marginRight: '8px' }}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </Button>
              </>
              )}
              </div>
            </div>
          </div>
        ))}

      </div>
      <div className="d-flex justify-content-center mt-4">
        <Form onSubmit={handleCommentSubmit} style={{ maxWidth: '600px', width: '100%' }}>
          <Form.Group controlId="formComment">
            <Form.Label style={{ color: 'white' }}>Add a Comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </Form.Group>
          {editComment && (
          <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
            Cancel Edit
          </Button>
          )}
          <Button variant="primary" type="submit">
            {editComment ? 'Update Comment' : 'Add Comment'}
          </Button>
        </Form>
      </div>
    </>
  );
};

SingleContent.propTypes = {
  contentId: PropTypes.string.isRequired,
};

export default SingleContent;
