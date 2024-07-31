import '../../assets/components/users/UserList.css';

import { FaUserPlus } from "react-icons/fa";

import { Helmet, HelmetProvider } from 'react-helmet-async'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import AxiosInstance from '../login/AxiosInstance'
import axios from 'axios'
import Swal from 'sweetalert2'

function UserList() {
    const webTitle = 'ข้อมูลบัญชีผู้ใช้';
    const apiUrl = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, users]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await AxiosInstance.get(`/users`);
            setUsers(data);
            setFilteredUsers(data);
            setUsersCount(data.length);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูลจาก API', error);
        }
        setLoading(false);
    };

    const filterUsers = () => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
            setUsersCount(users.length);
        } else {
            const filtered = users.filter(user =>
                user.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
            setUsersCount(filtered.length);
        }
    };

    const deleteUser = async (id) => {
        const isConfirm = await Swal.fire({
            title: "ต้องการลบข้อมูลบัญชีผู้ใช้หรือไม่?",
            text: "เมื่อดำเนินการเเล้วจะไม่สามารถย้อนกลับได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: "ลบข้อมูล",
            cancelButtonColor: "#d33",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            return result.isConfirmed
        })

        if (!isConfirm) {
            return;
        }

        await AxiosInstance.delete(`/users/${id}`).then(({data}) => {
            Swal.fire({
                icon: 'success',
                confirmButtonText: "ตกลง",
                text: data.message
            })
            fetchUsers()
        }).catch(({response:{data}}) => {
            Swal.fire({
                text: data.message,
                confirmButtonText: "ตกลง",
                icon: 'error'
            })
        })
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
                        <Card>
                            <Card.Body>
                                <div className="d-flex flex-wrap justify-between align-items-center mb-3">
                                    <div className="col-6">
                                        <h2 className="responsive-header mb-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-lines-fill m-3" viewBox="0 0 16 16">
                                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                                            </svg>
                                            ข้อมูลบัญชีผู้ใช้
                                        </h2>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end align-items-center mt-0">
                                        <Form.Control type="text" placeholder="ค้นหาชื่อบัญชีผู้ใช้งาน..." value={searchQuery} onChange={handleSearchChange} className="me-2" style={{ maxWidth: '200px' }} />
                                        <Button className='btn btn-primary m-1' onClick={fetchUsers} disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise m-1" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                            </svg>}
                                            <span className="responsive-text-hidden">รีเฟรช</span>
                                        </Button>
                                        <Link className='btn btn-success' to="/user/create">
                                            <FaUserPlus size={16} className="m-1" />
                                            <span className="responsive-text-hidden">เพิ่มบัญชีผู้ใช้</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 text-center">
                                        <thead className="table-dark">
                                            <tr className="align-middle">
                                                <td>#</td>
                                                <td>รหัสผู้ใช้งาน</td>
                                                <td>ชื่อบัญชีผู้ใช้</td>
                                                <td>ชื่อเจ้าของบัญชี</td>
                                                <td>กอง / สำนัก</td>
                                                <td>กลุ่มงาน / ฝ่าย</td>
                                                <td>ตำแหน่ง</td>
                                                <td>สถานะ</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody className="align-middle">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user, key) => (
                                                    <tr key={key}>
                                                        <td>{key+1}</td>
                                                        <td>{user.employee_id}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.employee_name}</td>
                                                        <td>{user.organization}</td>
                                                        <td>{user.section}</td>
                                                        <td>{user.position}</td>
                                                        <td className="tag">
                                                            {user.role === 'ผู้ดูแลระบบ' ? (
                                                                <span className="badge rounded-pill bg-success">
                                                                    {user.role}
                                                                </span>
                                                            
                                                            ): user.role === 'เจ้าหน้าที่' ? (
                                                                <span className="badge rounded-pill bg-primary">
                                                                    {user.role}
                                                                </span>
                                                            ):(
                                                                <span className="badge rounded-pill bg-secondary">
                                                                    {user.role}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="justify-center items-center">
                                                            <Link to={`/user/edit/${user.id}`} className="btn btn-warning me-2 text-white d-block d-md-inline-block">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill m-1" viewBox="0 0 16 16">
                                                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                                                </svg>
                                                                {/* แก้ไขข้อมูล */}
                                                            </Link>
                                                            <Button variant='danger' onClick={() => deleteUser(user.id)} className="d-block d-md-inline-block m-1" width="100px">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill m-1" viewBox="0 0 16 16">
                                                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                                                </svg>
                                                                {/* ลบข้อมูล */}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9">ไม่พบข้อมูลครุภัณฑ์</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-3 text-end">
                                    <h6>พบข้อมูลบัญชีผู้ใช้<span className="badge bg-secondary m-2">{usersCount}</span>รายการ</h6>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </HelmetProvider>
        </Container>
    )
}

export default UserList