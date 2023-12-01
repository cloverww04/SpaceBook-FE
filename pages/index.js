import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { deleteContent, getAllContent } from '../api/spaceContentData';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [spaceContent, setSpaceContent] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    user: '',
    type: '',
    spaceObject: '',
  });

  useEffect(() => {
    getAllContent()
      .then((data) => {
        setSpaceContent(data);
        setFilteredResults(data);
      })
      .catch((error) => console.error(error));
  }, []);

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

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria((prevCriteria) => ({ ...prevCriteria, [name]: value }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Filter spaceContent based on search criteria
    const filtered = spaceContent.filter((content) => {
      const userFullName = `${content.user.firstName} ${content.user.lastName}`.toLowerCase();
      const searchValue = searchCriteria.search.toLowerCase();

      return (
        userFullName.includes(searchValue)
        || (content.type
          && content.type.type.toLowerCase().includes(searchValue))
      );
    });

    setFilteredResults(filtered);
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
      <Row className="mt-3 justify-content-center">
        <Col xs={8}>
          <Form className="mb-3" onSubmit={handleSearchSubmit}>
            <Row className="g-2">
              <Col>
                <FormControl
                  type="text"
                  placeholder="Search by User or Tag"
                  name="search"
                  value={searchCriteria.search}
                  onChange={handleSearchChange}
                />
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Right Section: Display usersGeneratedSpaceContent with spaceObjects */}
      <Row className="mt-3 justify-content-center">
        <Col xs={8}>
          {filteredResults.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)).map((content) => (
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
