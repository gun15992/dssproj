import '../../assets/components/home/Home.css';

import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AxiosInstance from '../login/AxiosInstance';

import { FaUser, FaBoxes, FaChartPie } from 'react-icons/fa';
import { RiInboxArchiveFill, RiInboxUnarchiveFill, RiInbox2Fill } from "react-icons/ri";
import { LuBoxSelect } from "react-icons/lu";

import Loading from '../../functions/Loading';

function Home() {
    const webTitle = 'หน้าหลัก';
    const apiUrl = import.meta.env.VITE_API_URL;

    const [products, setProducts] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [inUseProductCount, setInUseProductCount] = useState(0);
    const [soldProductCount, setSoldProductCount] = useState(0);
    const [lostProductCount, setLostProductCount] = useState(0);

    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [userRole, setUserRole] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = useMemo(() => {
        return "DSSROLE-ADMIN".includes(userRole);
    }, [userRole]);

    useEffect(() => {
        fetchProducts();
        fetchUsers();
        fetchUserRole();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        await AxiosInstance.get(`/products`).then(({data}) => {
            setProducts(data);
            setProductsCount(data.length);
            setInUseProductCount(data.filter(product => product.status === 'DSSPRODUCTSTATE-01').length);
            setSoldProductCount(data.filter(product => product.status === 'DSSPRODUCTSTATE-02').length);
            setLostProductCount(data.filter(product => product.status === 'DSSPRODUCTSTATE-03').length);
        });
        setIsLoading(false);
    }

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await AxiosInstance.get('/users');
            setUsers(response.data);
            setUsersCount(response.data.length);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดขณะดึงข้อมูลบัญชีผู้ใช้', error.response);
        }
        setIsLoading(false);
    };

    const fetchUserRole = async () => {
        setIsLoading(true);
        try {
            const response = await AxiosInstance.get('/user');
            setUserRole(response.data.role);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูลบัญชีผู้ใช้', error.response);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <Loading />; 
    }

    return (
        <Container fluid>
            <HelmetProvider>
                <Helmet>
                    <title>{webTitle}</title>
                    <link rel='icon' type='image/png' href='/logo.png'/>
                </Helmet>
                <Row className="justify-content-center">
                    <Col md={12} className="col-sm-12">
                        <Card className="mb-5">
                            <Card.Body>
                                <div className="d-flex justify-between align-items-center mb-3">
                                    <div className="col-6">
                                        <h2 className="responsive-header mb-0">
                                            <FaChartPie size={30} className="m-3"/>
                                            สรุปภาพรวม
                                        </h2>
                                    </div>
                                </div>
                                <Row className="mt-3">
                                    <Col md={12} className="mb-3 mt-0">
                                        <Card className="custom-card-blue">
                                            <Card.Body className="p-4">
                                                <Row>
                                                    <Col xs="auto">
                                                        <FaUser size={50} /> 
                                                    </Col>
                                                    <Col>
                                                        <h5>จำนวนบัญชีผู้ใช้ทั้งหมด</h5>
                                                        <p>จำนวน {usersCount} คน</p>
                                                    </Col>
                                                </Row>
                                                {isAdmin && (
                                                    <>
                                                        <hr />
                                                        <Link to="user/list" className="text-decoration-none text-black link-text-blue">
                                                            ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                        </Link>
                                                    </>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Card className="custom-card-purple">
                                            <Card.Body className="p-4">
                                                <Row>
                                                    <Col xs="auto">
                                                        <FaBoxes size={50} /> 
                                                    </Col>
                                                    <Col>
                                                        <h5>จำนวนครุภัณฑ์ทั้งหมด</h5>
                                                        <p>จำนวน {productsCount} ชิ้น</p>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Link to="/product/type" className="text-decoration-none text-black link-text-purple">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card className="custom-card-green">
                                            <Card.Body className="p-4">
                                                <Row>
                                                    <Col xs="auto">
                                                        <RiInboxArchiveFill size={50} /> 
                                                    </Col>
                                                    <Col>
                                                        <h5>จำนวนครุภัณฑ์ใช้งานอยู่</h5>
                                                        <p>จำนวน {inUseProductCount} ชิ้น</p>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black link-text-green">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card className="custom-card-red">
                                            <Card.Body className="p-4">
                                                <Row>
                                                    <Col xs="auto">
                                                        <RiInboxUnarchiveFill size={50} /> 
                                                    </Col>
                                                    <Col>
                                                        <h5>จำนวนครุภัณฑ์ที่จำหน่ายออก</h5>
                                                        <p>จำนวน {soldProductCount} ชิ้น</p>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black link-text-red">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card className="custom-card-gray">
                                            <Card.Body className="p-4">
                                                <Row>
                                                    <Col xs="auto">
                                                        <RiInbox2Fill size={50} /> 
                                                    </Col>
                                                    <Col>
                                                        <h5>จำนวนครุภัณฑ์ที่สูญหาย</h5>
                                                        <p>จำนวน {lostProductCount} ชิ้น</p>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black link-text-gray">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </HelmetProvider>
        </Container>
    )
}

export default Home