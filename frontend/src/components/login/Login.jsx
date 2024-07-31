import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';

function Login({ onLogin }) {
    const webTitle = 'เข้าสู่ระบบ';
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await AxiosInstance.post('login', {
                username,
                password
            });
            console.log('Token: ', response.data.token);
            localStorage.setItem('token', response.data.token);
            onLogin();
            Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ',
                confirmButtonText: "ตกลง"
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            console.error('Login Error:', error);
            let errorMessage = 'ชื่อบัญชีผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง';

            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                console.error('Error Request Data:', error.request);
                errorMessage = 'ไม่มีการตอบกลับจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง';
            } else {
                console.error('Error Message:', error.message);
                errorMessage = error.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถเข้าสู่ระบบได้',
                text: 'ชื่อบัญชีผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง',
                confirmButtonText: "ตกลง",
            });
        }
    };

    return (
        <Container className="login-background">
            <HelmetProvider>
                <Helmet>
                    <title>{webTitle}</title>
                    <link rel='icon' type='image/png' href='/logo.png'/>
                </Helmet>
                <Row>
                    <Col md={12} className="col-sm-12">
                        <Card>
                            <Card.Body className="p-5">
                                <Card.Title className="text-center">
                                    <h3>
                                        <img src="/logo.png" width="45" height="45" className='m-1 mt-0' />{' '}
                                        DSS Login
                                    </h3>
                                </Card.Title>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3 mt-4" controlId="formUsername">
                                        <Form.Label>ชื่อบัญชีผู้ใช้</Form.Label>
                                        <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>รหัสผ่าน</Form.Label>
                                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </Form.Group>
                                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="จำรหัสผ่านของฉันไว้" />
                                    </Form.Group> */}
                                    <Button variant="primary" type="submit">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </HelmetProvider>
        </Container>
    );
}

export default Login;