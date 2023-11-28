/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import getAllType from '../api/contentTypeData';
import { getAllObjects } from '../api/spaceObjectData';
import { checkUser } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import { createContent, updateContent } from '../api/spaceContentData';
import { createSpaceObjectContent, updateSpaceObjectContent } from '../api/spaceObjectContent';

const initialState = {
  title: '',
  description: '',
  typeId: undefined,
  spaceObjectId: undefined,
};

export default function ContentForm({ obj }) {
  const [formData, setFormData] = useState(initialState);
  const [, setUser] = useState({});
  const [type, setType] = useState([]);
  const [spaceObject, setSpaceObject] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getAllObjects().then(setSpaceObject);
    getAllType().then(setType);
    checkUser(user.uid).then(setUser);

    if (obj.contentId) {
      setFormData({
        title: obj.title,
        description: obj.description,
        typeId: obj.typeId,
        spaceObjectId: obj.spaceObjectContents[0]?.spaceObjectId,
        spaceObject: obj.spaceObject,
        spaceObjectContent: obj.spaceObjectContents,
      });
    }
  }, [user, obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'typeId' ? parseInt(value, 10) : value,
      spaceObjectId: name === 'spaceObjectId' ? parseInt(value, 10) : prevState.spaceObjectId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.contentId) {
      const payload = {
        ...formData, contentId: obj.contentId,
      };
      updateContent(payload)
        .then(() => {
          console.log('RESPONSE: ', payload);
          return updateSpaceObjectContent(payload);
        })
        .then(() => router.push('/'))
        .catch((error) => {
          console.error('Failed to update: ', error);
        });
    } else {
      const payload = { ...formData, createdOn: new Date(Date.now()), userId: user.userId };
      createContent(payload)
        .then((response) => {
          const createdContentId = response.contentId;
          return createSpaceObjectContent(createdContentId, formData.spaceObjectId);
        })
        .then(() => {
          router.push('/');
        })
        .catch((error) => {
          console.error('Failed to create: ', error);
        });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>

        <FloatingLabel controlId="floatingInput2" label="Enter the title of your post" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter a Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingInput3" label="Enter the description of the post" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter the description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        <Form.Group className="mb-3" controlId="formGridLevel">
          <Form.Select
            aria-label="ContentType"
            name="typeId"
            onChange={handleChange}
            className="mb-3"
            value={formData.typeId}
          >
            <option value="">Select a category</option>
            {
          type.map((types) => (
            <option
              key={types.id}
              value={types.id}
            >
              {types.type}
            </option>
          ))
        }
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridLevel">
          <Form.Select
            aria-label="ContentType"
            name="spaceObjectId"
            onChange={handleChange}
            className="mb-3"
            value={formData.spaceObjectId}
          >
            <option value="">What is this related to?</option>
            {
          spaceObject.map((objects) => (
            <option
              key={objects.spaceObjectId}
              value={objects.spaceObjectId}
            >
              {objects.name}
            </option>
          ))
        }
          </Form.Select>
        </Form.Group>

        {/* SUBMIT BUTTON  */}

        <Button type="submit" className="btn-secondary mt-2">{obj.contentId ? 'Update' : 'Create'} Post</Button>
      </Form>
    </>
  );
}

ContentForm.propTypes = {
  obj: PropTypes.shape({
    contentId: PropTypes.number,
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    spaceObjectId: PropTypes.number,
    userId: PropTypes.number,
    typeId: PropTypes.number,
    spaceObject: PropTypes.object,
    spaceObjectContents: PropTypes.array,
  }),
};
ContentForm.defaultProps = {
  obj: initialState,
};
