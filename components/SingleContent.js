import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { useAuth } from '../utils/context/authContext';
import { getSingleContent } from '../api/spaceContentData';
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
  const [content, setContent] = useState(null);
  const [userNames, setUserNames] = useState([]);
  console.log(content);

  const fetchUserName = async (userId) => {
    try {
      const users = await getSingleUser(userId);
      return `${users.firstName} ${users.lastName}`;
    } catch (error) {
      console.error('Error fetching user:', error);
      return 'Unknown User';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSingleContent(contentId);
        setContent(data);

        const userPromises = data.comments.map((comment) => fetchUserName(comment.userId));
        const resolvedUserNames = await Promise.all(userPromises);
        setUserNames(resolvedUserNames);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchData();
  }, [contentId]);

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

  if (!content) {
    return <div>Loading...</div>;
  }

  const imageId = content.spaceObjectContents[0].spaceObjectId;
  const objectImage = objectImages[imageId] || random;
  const sortedComments = content.comments.slice().sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <Card className="bg-dark text-white" style={{ maxWidth: '800px' }}>

          <Card.Header style={{ marginLeft: '-10px' }} className="d-flex justify-content-between">
            <div>{content.spaceObjectContents[0]?.spaceObject.name}</div>
            <div>Posted by: {user.firstName} {user.lastName}</div>
          </Card.Header>
          <Card.Title style={{ marginLeft: '15px' }}>{content.title}</Card.Title>
          <Card.Text style={{ marginLeft: '15px' }}>{content.description}</Card.Text>
          <Card.Img src={objectImage.src} alt="Card image" height={400} />
          <Card.ImgOverlay />
          <Card.Title style={{ marginLeft: '15px' }} className="mt-2">Comments</Card.Title>
          <Card.Footer className="d-flex flex-column" style={{ border: '1px solid #ddd', padding: '15px' }}>
            {sortedComments.map((comment, index) => (
              <div key={comment.id} className="row mb-2" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                <div className="col-md-9">
                  <div>{userNames[index]}: {comment.content}</div>
                </div>
                <div className="col-md-3 text-right">
                  <div style={{ fontSize: '14px' }}>{formatDate(comment.createdDate)} {formatTime(comment.createdDate)}</div>
                </div>
              </div>
            ))}
          </Card.Footer>

        </Card>
      </div>
    </>
  );
};

SingleContent.propTypes = {
  contentId: PropTypes.string.isRequired,
};

export default SingleContent;
