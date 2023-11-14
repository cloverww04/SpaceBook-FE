import { Image, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useAuth } from '../utils/context/authContext';
import { getAllContent } from '../api/spaceContentData';

function Home() {
  const { user } = useAuth();
  const [spaceContent, setSpaceContent] = useState([]);

  console.log(spaceContent);

  useEffect(() => {
    // Fetch space content when the component mounts
    getAllContent()
      .then((data) => setSpaceContent(data))
      .catch((error) => console.error(error));
  }, []);

  const sortedSpaceContent = spaceContent.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

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
      </Row>

      {/* Right Section: Display usersGeneratedSpaceContent with spaceObjects */}
      <Row className="mt-3 justify-content-center">
        <Col xs={8}>
          {sortedSpaceContent.map((content) => (
            <Card key={content.contentId} className="text-center mb-4">
              <Card.Text className="position-absolute top-0 end-1 m-2">
                Posted by: {content.user.firstName} {content.user.lastName}
              </Card.Text>
              <Card.Header>#{content.type.type}</Card.Header>
              <Card.Body>
                <Card.Title>{content.title}</Card.Title>
                <Card.Text>{content.description}</Card.Text>
              </Card.Body>
              <Button variant="primary" size="sm" className="position-absolute bottom-0 end-0 m-1">
                View
              </Button>
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
