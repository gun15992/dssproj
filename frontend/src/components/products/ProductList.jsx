import '../../assets/components/products/ProductList.css';

import { Helmet, HelmetProvider } from 'react-helmet-async'
import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import AxiosInstance from '../login/AxiosInstance'
import axios from 'axios'
import Swal from 'sweetalert2'

import Loading from '../../functions/Loading';

function ProductList() {
    const webTitle = 'ข้อมูลครุภัณฑ์';
    const apiUrl = import.meta.env.VITE_API_URL;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [productsCount, setProductsCount] = useState(0);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [loading, setLoading] = useState(true);

    const [userRole, setUserRole] = useState('');

    const isOfficer = useMemo(() => {
        return "DSSROLE-OFFICER".includes(userRole);
    }, [userRole]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchUserRole();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, products, selectedCategory, selectedStatus]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await AxiosInstance.get(`/products`);
            setProducts(data);
            setFilteredProducts(data);
            setProductsCount(data.length);
            setSelectedCategory('');
            setSelectedStatus('');
            setSearchQuery('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูลจาก API', error);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}api/categories`);
            setCategories(data);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูลประเภทครุภัณฑ์', error);
        }
    };

    const fetchUserRole = async () => {
        setLoading(true);
        try {
            const response = await AxiosInstance.get('/user');
            setUserRole(response.data.role);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดระหว่างดึงข้อมูลบัญชีผู้ใช้', error.response);
        }
        setLoading(false);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_code === categoryId);
        return category ? category.category_name : 'ไม่ได้ระบุ';
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(product =>
                product.newsn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getCategoryName(product.category_code).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category_code === selectedCategory
            );
        }

        if (selectedStatus) {
            filtered = filtered.filter(product =>
                product.status === selectedStatus
            );
        }

        setFilteredProducts(filtered);
        setProductsCount(filtered.length);
    };

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: "ต้องการลบข้อมูลครุภัณฑ์หรือไม่?",
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

        await AxiosInstance.delete(`/products/${id}`).then(({data}) => {
            Swal.fire({
                icon: 'success',
                confirmButtonText: "ตกลง",
                text: data.message
            })
            fetchProducts()
        }).catch(({response:{data}}) => {
            Swal.fire({
                text: data.message,
                confirmButtonText: "ตกลง",
                icon: 'error'
            })
        })
    }

    if (loading) {
        return <Loading />; 
    }

    return (
        <Container fluid>
            <HelmetProvider>
                <Helmet>
                    <title>{webTitle}</title>
                    <link rel='icon' type='image/png' href='/logo.png'/>
                </Helmet>
                <Row>
                    <Col md={12} className="col-sm-12">
                        <Card className="mb-5">
                            <Card.Body>
                                <div className="d-flex flex-wrap justify-between align-items-center mb-3">
                                    <div className="col-6">
                                        <h2 className="responsive-header mb-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-ui-checks m-3" viewBox="0 0 16 16">
                                                <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                            </svg>
                                            ข้อมูลครุภัณฑ์
                                        </h2>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end align-items-center mt-0">
                                        <Form.Control type="text" placeholder="ค้นหาครุภัณฑ์..." value={searchQuery} onChange={handleSearchChange} className="me-2" style={{ maxWidth: '200px' }} />
                                        <Button className='btn btn-primary m-1' onClick={fetchProducts} disabled={loading}>
                                            {loading ? <Spinner animation="border" size="sm" /> : 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise m-1" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                            </svg>}
                                            <span className="responsive-text-hidden">รีเฟรช</span>
                                        </Button>
                                        {isOfficer && (
                                            <>
                                                <Link className='btn btn-success' to="/product/create">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-plus-fill m-1" viewBox="0 0 16 16">
                                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0"/>
                                                    </svg>
                                                    <span className="responsive-text-hidden">เพิ่มข้อมูล</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                                            <option value=''>-- เลือกประเภทครุภัณฑ์ --</option>
                                            {categories.map((category) => (
                                                <option key={category.category_code} value={category.category_code}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Select value={selectedStatus} onChange={handleStatusChange}>
                                            <option value=''>-- เลือกสถานะครุภัณฑ์ --</option>
                                            <option value="DSSPRODUCTSTATE-01">ใช้งานอยู่</option>
                                            <option value="DSSPRODUCTSTATE-02">จำหน่ายออก</option>
                                            <option value="DSSPRODUCTSTATE-03">สูญหาย</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 text-center">
                                        <thead className="table-dark">
                                            <tr className="align-middle">
                                                <td>#</td>
                                                <td>รูปภาพ</td>
                                                <td>หมายเลขครุภัณฑ์</td>
                                                <td>ชื่อครุภัณฑ์</td>
                                                <td>ประเภทครุภัณฑ์</td>
                                                <td>หน่วยงานรับผิดชอบ</td>
                                                <td>สถานที่ตั้ง</td>
                                                <td>สถานะ</td>
                                                {isOfficer && (
                                                    <td></td>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="align-middle">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product, key) => (
                                                    <tr key={key}>
                                                        <td>{key+1}</td>
                                                        <td>
                                                            <Link to="#" onClick={(e) => { e.preventDefault(); window.open(`${apiUrl}storage/product/image/${product.image}`, '_blank', 'noopener, noreferrer'); }}>
                                                                <div className="image-cropper">
                                                                    <img width="60px" className="img-fluid rounded" src={`${apiUrl}storage/product/image/${product.image}`} alt={product.name} />
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td>{product.newsn}</td>
                                                        <td>{product.name}</td>
                                                        <td>{getCategoryName(product.category_code)}</td>
                                                        <td>{product.organization}</td>
                                                        <td>{product.location}</td>
                                                        <td className="tag">
                                                        {product.status === 'DSSPRODUCTSTATE-01' ? (
                                                                <span className="badge rounded-pill bg-success">
                                                                    ใช้งานอยู่
                                                                </span>
                                                            
                                                            ): product.status === 'DSSPRODUCTSTATE-02' ? (
                                                                <span className="badge rounded-pill bg-danger">
                                                                    จำหน่ายออก
                                                                </span>
                                                            ):(
                                                                <span className="badge rounded-pill bg-secondary">
                                                                    สูญหาย
                                                                </span>
                                                            )}
                                                        </td>
                                                        {isOfficer && (
                                                            <td className="justify-center items-center">
                                                                <Link to={`/product/edit/${product.id}`} className="btn btn-warning me-2 text-white d-block d-md-inline-block">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill m-1" viewBox="0 0 16 16">
                                                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                                                    </svg>
                                                                    {/* แก้ไขข้อมูล */}
                                                                </Link>
                                                                <Button variant='danger' onClick={() => deleteProduct(product.id)} className="d-block d-md-inline-block m-1" width="100px">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill m-1" viewBox="0 0 16 16">
                                                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                                                    </svg>
                                                                    {/* ลบข้อมูล */}
                                                                </Button>
                                                            </td>
                                                        )}
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
                                    <h6>พบข้อมูลครุภัณฑ์<span className="badge bg-secondary m-2">{productsCount}</span>รายการ</h6>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </HelmetProvider>
        </Container>
    )
}

export default ProductList