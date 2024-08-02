import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../src/assets/font.css';
import './App.css';

import UserIcon from './assets/user.svg';
import MenuIcon from './assets/burger-menu.png';

import Login from './components/login/Login';
import Home from './components/home/Home';
import LogList from './components/logs/LogList';
import UserList from './components/users/UserList';
import CreateUser from './components/users/CreateUser';
import EditUser from './components/users/EditUser';
import ProductList from './components/products/ProductList';
import ProductType from './components/products/ProductType';
import CreateProduct from './components/products/CreateProduct';
import EditProduct from './components/products/EditProduct';
import AxiosInstance from './components/login/AxiosInstance';

import PrivateRoute from './functions/PrivateRoute';
import Loading from './functions/Loading';

function App() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("");

    const isAdmin = useMemo(() => {
        return "DSSROLE-ADMIN".includes(userRole);
    }, [userRole]);

    const isOfficer = useMemo(() => {
        return "DSSROLE-OFFICER".includes(userRole);
    }, [userRole]);

    const isUser = useMemo(() => {
        return "DSSROLE-USER".includes(userRole);
    }, [userRole]);
    
    const isAllRole = useMemo(() => {
        return isAdmin || isOfficer || isUser;
    }, [isAdmin, isOfficer, isUser]);

    const userName = useMemo(() => {
        return isLoading ? 'Loading...' : user?.employee_name;
    }, [isLoading, user]);

    useEffect(() => {
        if (isLoggedIn) {
            AxiosInstance.get('/user').then(response => {
                setUser(response.data);
                setUserRole(response.data.role);
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบัญชีผู้ใช้', error);
                handleLogout();
            })
            .finally(() => {
                setIsLoading(false); 
            });
        } else {
            setIsLoading(false); 
        }
    }, [isLoggedIn]);

    const handleNavLinkClick = () => {
        const navbarToggle = document.querySelector('.navbar-toggler');
        if (navbarToggle && window.getComputedStyle(navbarToggle).display !== 'none') {
            navbarToggle.click();
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setIsLoading(true);
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AxiosInstance.post('logout');
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            Swal.fire({
                icon: 'success',
                title: 'ออกจากระบบสำเร็จ',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                window.location.href = '/login';
            });
        } catch (error) {
            setIsLoggedIn(false);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    if (isLoading) {
        return <Loading />; 
    }

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar bg="dark" expand="lg" fixed="top">
                    <Container>
                        <Link to={"/"} className="navbar-brand text-white">
                            <img src="/logo.png" width="45" height="45" className='m-1 mt-0' />{' '}
                            DSS Inventory
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Navbar.Toggle aria-controls="basic-navbar-nav">
                                    <img src={MenuIcon} alt="ToggleIcon" className="bi bi-person m-1" />
                                </Navbar.Toggle>
                                <Navbar.Collapse id="basic-navbar-nav" className="me-auto justify-center">
                                    <Nav className="me-auto">
                                        {isAllRole && (
                                            <>
                                                {/* Home */}
                                                <NavLink to="/" className="nav-link text-white rounded mx-2 text-center" onClick={handleNavLinkClick}>หน้าหลัก</NavLink>

                                                {/* Product */}
                                                <NavLink to="/product/list" className="nav-link text-white rounded mx-2 text-center" onClick={handleNavLinkClick}>ข้อมูลครุภัณฑ์</NavLink>
                                                <NavLink to="/product/type" className="nav-link text-white rounded mx-2 text-center" onClick={handleNavLinkClick}>ประเภทครุภัณฑ์</NavLink>
                                            </>
                                        )}
                                        {isAdmin && (
                                            <>
                                                {/* Users */}
                                                <NavLink to="/user/list" className="nav-link text-white rounded mx-2 text-center" onClick={handleNavLinkClick}>ข้อมูลบัญชีผู้ใช้</NavLink>

                                                {/* Log */}
                                                <NavLink to="/log/list" className="nav-link text-white rounded mx-2 text-center" onClick={handleNavLinkClick}>ประวัติการทำรายการ</NavLink>
                                            </>
                                        )}
                                    </Nav>
                                    <Nav>
                                        <NavDropdown title={
                                            <span className="text-primary my-auto text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person m-1" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                                </svg>
                                                {userName}
                                            </span>
                                        } 
                                        id="basic-nav-dropdown" className='custom-dropdown rounded'>
                                            <NavDropdown.Item href="/" className='text-center p-2'>แก้ไขบัญชีผู้ใช้</NavDropdown.Item>
                                            <NavDropdown.Item onClick={handleLogout} className='text-center p-2'>ออกจากระบบ</NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav>
                                </Navbar.Collapse>
                            </>
                        )}
                    </Container>
                </Navbar>
                <Container className="flex-grow-1 mt-5">
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Routes>
                                <Route path="/" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAllRole}>
                                        <Home />
                                    </PrivateRoute>
                                } />
                                <Route path="/product/list" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAllRole}>
                                        <ProductList />
                                    </PrivateRoute>
                                } />
                                <Route path="/product/type" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAllRole}>
                                        <ProductType />
                                    </PrivateRoute>
                                } />
                                <Route path="/product/create" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isOfficer}>
                                        <CreateProduct />
                                    </PrivateRoute>
                                } />
                                <Route path="/product/edit/:id" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isOfficer}>
                                        <EditProduct />
                                    </PrivateRoute>
                                } />
                                <Route path="/log/list" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAdmin}>
                                        <LogList />
                                    </PrivateRoute>
                                } />
                                <Route path="/user/list" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAdmin}>
                                        <UserList />
                                    </PrivateRoute>
                                } />
                                <Route path="/user/create" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAdmin}>
                                        <CreateUser />
                                    </PrivateRoute>
                                } />
                                <Route path="/user/edit/:id" element={
                                    <PrivateRoute isLoggedIn={isLoggedIn} isAllowed={isAdmin}>
                                        <EditUser />
                                    </PrivateRoute>
                                } />
                                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                            </Routes>
                        </Col>
                    </Row>
                </Container>

                <footer className="bg-dark text-center text-white p-3 mt-auto">
                    &copy; 2024 กรมวิทยาศาสตร์บริการ (วศ.)<br/>
                    กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)
                </footer>
            </div>
        </Router>
    );
}

export default App;
