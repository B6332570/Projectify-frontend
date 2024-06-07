import React from 'react';
import { Modal, Form, Input, Button, Row, Col } from 'antd';
import axios from 'axios';

const EditProject = ({ open, onClose, project }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:3001/api/project/${project.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Edit Project:', values);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <Modal
      visible={open}
      title="Edit Project"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        initialValues={project}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="projectsName"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
        >
          <Input />
        </Form.Item>
        <Form.Item>
        <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#464747', borderColor: '#4CAF50' }}>
                Save
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProject;
