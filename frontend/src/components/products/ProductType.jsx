import '../../assets/components/products/ProductType.css';

import axios from 'axios'
import AxiosInstance from '../login/AxiosInstance'
import React, { useEffect, useState } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Container, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Loading from '../../functions/Loading';

function ProductType() {
    const webTitle = 'ประเภทครุภัณฑ์';
    const apiUrl = import.meta.env.VITE_API_URL;

    const [products, setProducts] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [buildingProductCount, setBuildingProductCount] = useState(0);
    const [computerProductCount, setComputerProductCount] = useState(0);
    const [softwareProductCount, setSoftwareProductCount] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        await AxiosInstance.get(`/products`).then(({data}) => {
            setProducts(data);
            setProductsCount(data.length);
            setBuildingProductCount(data.filter(product => product.category_code === 'DSSPRODUCTTYPE-01').length);
            setComputerProductCount(data.filter(product => product.category_code === 'DSSPRODUCTTYPE-04').length);
            setSoftwareProductCount(data.filter(product => product.category_code === 'DSSPRODUCTTYPE-05').length);
        })
        setLoading(false);
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
                <Row className="justify-content-center">
                    <Col md={12} className="col-sm-12">
                        <Card className="mb-5">
                            <Card.Body>
                                <div className="d-flex justify-between align-items-center mb-3">
                                    <div className="col-6">
                                        <h2 className="responsive-header mb-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-grid-fill m-3" viewBox="0 0 16 16">
                                                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z"/>
                                            </svg>
                                            ประเภทครุภัณฑ์
                                        </h2>
                                    </div>
                                </div>
                                <Row className="mt-3">
                                    <Col md={12} className="mb-3">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์ทั้งหมด</h5>
                                                <p>จำนวน {productsCount} ชิ้น</p>
                                                <hr />
                                                <Link to="/product/list" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์ก่อสร้าง</h5>
                                                <p>จำนวน {buildingProductCount} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์ B</h5>
                                                <p>จำนวน {0} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์ C</h5>
                                                <p>จำนวน {0} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์คอมพิวเตอร์</h5>
                                                <p>จำนวน {computerProductCount} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์โปรแกรมคอมพิวเตอร์</h5>
                                                <p>จำนวน {softwareProductCount} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
                                                    ดูข้อมูลเพิ่มเติม <span>&gt;</span>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-3 mt-0">
                                        <Card>
                                            <Card.Body className="p-4">
                                                <h5>ครุภัณฑ์ F</h5>
                                                <p>จำนวน {0} ชิ้น</p>
                                                <hr />
                                                <Link to="#" className="text-decoration-none text-black">
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

export default ProductType