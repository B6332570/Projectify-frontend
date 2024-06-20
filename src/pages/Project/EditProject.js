import React from 'react';
import { Modal, Form, Input, Button, Row, Col } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
      
      await MySwal.fire({
        title: 'Success',
        text: 'Project updated successfully',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error updating project:', error);
      MySwal.fire({
        title: 'Error',
        text: 'There was an error updating the project',
        icon: 'error',
        showConfirmButton: true,
      });
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
          label="Description"
        >
           <Input.TextArea
            rows={10} // เพิ่มจำนวนแถวที่ต้องการ
       
          />
        </Form.Item>
        <Form.Item>
          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#464747' }}>
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
