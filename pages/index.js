import { Image, Row, Col } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="d-flex mt-5">
      <Row>
        <Col xs={3}>
          <Image
            src={user.fbUser.photoURL}
            alt="Profile"
            roundedCircle
            style={{ width: '100px', height: '100px' }}
          />
          <h2>{user.fbUser.displayName}</h2>
        </Col>
      </Row>

      {/* Right Section: Display usersGeneratedSpaceContent with spaceObjects */}
      <Row className="mt-3">
        {/* Add code here to display usersGeneratedSpaceContent and spaceObjects */}
        <p> There will be content here </p>
      </Row>
    </div>
  );
}

export default Home;
