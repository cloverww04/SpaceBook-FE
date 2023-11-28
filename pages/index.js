import { Image, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { getAllContent, deleteContent } from '../api/spaceContentData';

function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [spaceContent, setSpaceContent] = useState([]);

  useEffect(() => {
    getAllContent()
      .then((data) => {
        setSpaceContent(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const sortedSpaceContent = spaceContent.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

  const handleViewButtonClick = (contentId) => {
    router.push(`/${contentId}`);
  };

  const handleEditButtonClick = (contentId) => {
    router.push(`/edit/${contentId}`);
  };

  const handleDeleteButtonClick = (contentId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteContent(contentId);
      window.location.reload();
    }
  };

  return (
    <div className="mt-5">
      <Row>
        <Col sm={3}>
          <Image
            src={user.fbUser.photoURL}
            alt="Profile"
            roundedCircle
            style={{ width: '100px', height: '100px' }}
          />
          <h2 style={{ color: 'white' }}>{user.fbUser.displayName}</h2>
        </Col>
        <Col xs={4} className="text-center">
          <h1 className="display-2 text-white fw-bold" style={{ marginLeft: '25px' }}>Space Book</h1>
        </Col>
      </Row>

      {/* Right Section: Display usersGeneratedSpaceContent with spaceObjects */}
      <Row className="mt-3 justify-content-center">
        <Col xs={8}>
          {sortedSpaceContent.map((content) => (
            <Card key={content.contentId} className="text-center mb-4">
              <Card.Text className="position-absolute top-0 end-1 m-2">
                Posted by: {content.user.firstName} {content.user.lastName}
              </Card.Text>
              <Card.Header>#{content.type ? content.type.type : 'Unknown Type'}</Card.Header>
              <Card.Body>
                <Card.Title>{content.title}</Card.Title>
                <Card.Text>{content.description}</Card.Text>
              </Card.Body>
              <div className="d-flex position-absolute bottom-0 end-0">
                <Button variant="success" size="sm" className="m-1" onClick={() => handleViewButtonClick(content.contentId)}>
                  View
                </Button>
                {user && content.user.userId === user.userId && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="m-1"
                      onClick={() => handleEditButtonClick(content.contentId)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="m-1"
                      onClick={() => handleDeleteButtonClick(content.contentId)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
              <Card.Footer className="text-muted">
                Posted On: {new Date(content.createdOn).toLocaleDateString()}{' '}
              </Card.Footer>
            </Card>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default Home;
