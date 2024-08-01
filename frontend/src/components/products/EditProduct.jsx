import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import '../../assets/components/products/EditProduct.css'

import axios from 'axios'
import Swal from 'sweetalert2'

import AxiosInstance from '../login/AxiosInstance'
import { ImCancelCircle } from "react-icons/im";
import { BsFillCartFill, BsBookmarkFill } from "react-icons/bs";

function EditProduct() {
    const webTitle = 'แก้ไขข้อมูลครุภัณฑ์';
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const {id} = useParams();

    const [oldsn, setOldsn] = useState("");
    const [newsn, setNewsn] = useState("");
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [modelsn, setModelsn] = useState("");
    const [yearsl, setYearsl] = useState("");
    const [dateexp, setDateexp] = useState("");
    const [price, setPrice] = useState("");
    const [organization, setOrganization] = useState("");
    const [location, setLocation] = useState("");
    const [detail, setDetail] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [status, setStatus] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [validationError, setValidationError] = useState({});

    const [statuses, setStatuses] = useState([
        { label: 'ใช้งานอยู่', value: 'DSSPRODUCTSTATE-01' },
        { label: 'จำหน่ายออก', value: 'DSSPRODUCTSTATE-02' },
        { label: 'สูญหาย', value: 'DSSPRODUCTSTATE-03' }
    ]);

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        axios.get(`${apiUrl}api/categories`).then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล API ของ Category", error);
        });
    }, []);

    const fetchProduct = async () => {
        await AxiosInstance.get(`/products/${id}`).then(({data}) => {
            const { oldsn, newsn, name, brand, model, modelsn, yearsl, dateexp, price, organization, location, detail, description, status, category_code } = data.product;
            setOldsn(oldsn || '');
            setNewsn(newsn || '');
            setName(name || '');
            setBrand(brand || '');
            setModel(model || '');
            setModelsn(modelsn || '');
            setYearsl(yearsl || '');
            setDateexp(dateexp || '');
            setPrice(price || '');
            setOrganization(organization || '');
            setLocation(location || '');
            setDetail(detail || '');
            setDescription(description || '');
            setSelectedStatus(status || '');
            setSelectedCategory(category_code || '');
        }).catch(({response:{data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    const changeHandler = (event) => {
        setImage(event.target.files[0]);
    }

    const handleCancel = () => {
        navigate(-1);
    };

    const updateProduct = async (e) => {
        e.preventDefault();

        if (!newsn || !name || !brand || !model || !modelsn || !yearsl || !dateexp || !price || !organization || !location || !selectedStatus || !selectedCategory) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องก่อนบันทึกข้อมูล'
            });
            return;
        }

        const formData = new FormData();
        
        formData.append('_method', 'PATCH');
        formData.append('oldsn', oldsn || '');
        formData.append('newsn', newsn);
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('modelsn', modelsn);
        formData.append('yearsl', yearsl);
        formData.append('dateexp', dateexp);
        formData.append('price', price);
        formData.append('organization', organization);
        formData.append('location', location);
        formData.append('detail', detail || '');
        formData.append('description', description || '');
        formData.append('status', selectedStatus);
        formData.append('category_code', selectedCategory);
        if (image !== null) {
            formData.append('image', image);
        }

        await AxiosInstance.post(`/products/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                confirmButtonText: "ตกลง",
                text: data.message
            })
            navigate("/product/list")
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors || {})
            } else {
                Swal.fire({
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    icon: "error"
                })
            }
        })
    }

    return (
        <Container>
            <HelmetProvider>
                <Helmet>
                    <title>{webTitle}</title>
                    <link rel='icon' type='image/png' href='logo.png'/>
                </Helmet>
                <Form onSubmit={updateProduct}>
                    <Row className="justify-content-center">
                        <Col md={12} className="col-sm-12">
                            <Card className="mb-5">
                                <Card.Body>
                                    <h2 className="responsive-header card-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-pencil-fill m-3" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg>
                                        แก้ไขข้อมูลครุภัณฑ์
                                    </h2>
                                    <hr />
                                    <Row>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Oldsn">
                                                <Form.Label>หมายเลขครุภัณฑ์ (แบบเก่า)</Form.Label>
                                                <Form.Control type="text" value={oldsn} onChange={(event) => {
                                                    setOldsn(event.target.value)
                                                }} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>หมายเลขครุภัณฑ์ (แบบใหม่)</Form.Label>
                                                <Form.Control type="text" value={newsn} onChange={(event) => {
                                                    setNewsn(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('newsn')} />
                                                {validationError.hasOwnProperty('newsn') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.newsn}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Name">
                                                <Form.Label>ชื่อครุภัณฑ์</Form.Label>
                                                <Form.Control type="text" value={name} onChange={(event) => {
                                                    setName(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('name')} />
                                                {validationError.hasOwnProperty('name') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.name}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Brand">
                                                <Form.Label>ยี่ห้อ</Form.Label>
                                                <Form.Control type="text" value={brand} onChange={(event) => {
                                                    setBrand(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('brand')} />
                                                {validationError.hasOwnProperty('brand') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.brand}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Model">
                                                <Form.Label>รุ่น</Form.Label>
                                                <Form.Control type="text" value={model} onChange={(event) => {
                                                    setModel(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('model')} />
                                                {validationError.hasOwnProperty('model') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.model}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Modelsn">
                                                <Form.Label>Serial Number</Form.Label>
                                                <Form.Control type="text" value={modelsn} onChange={(event) => {
                                                    setModelsn(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('modelsn')} />
                                                {validationError.hasOwnProperty('modelsn') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.modelsn}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                    <Col md={4} className="mt-3">
                                            <Form.Group controlId="Yearsl">
                                                <Form.Label>อายุการใช้งาน (ปี)</Form.Label>
                                                <Form.Control type="text" value={yearsl} onChange={(event) => {
                                                    setYearsl(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('yearsl')} />
                                                {validationError.hasOwnProperty('yearsl') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.yearsl}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Dateexp">
                                                <Form.Label>วันที่หมดอายุการใช้งาน</Form.Label>
                                                <Form.Control type="text" value={dateexp} onChange={(event) => {
                                                    setDateexp(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('dateexp')} />
                                                {validationError.hasOwnProperty('dateexp') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.dateexp}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Price">
                                                <Form.Label>ราคา (บาท)</Form.Label>
                                                <Form.Control type="text" value={price} onChange={(event) => {
                                                    setPrice(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('price')} />
                                                {validationError.hasOwnProperty('price') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.price}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                    <Col md={6} className="mt-3">
                                            <Form.Group controlId="Organization">
                                                <Form.Label>หน่วยงานที่รับผิดชอบ</Form.Label>
                                                <Form.Control type="text" value={organization} onChange={(event) => {
                                                    setOrganization(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('organization')} />
                                                {validationError.hasOwnProperty('organization') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.organization}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="mt-3">
                                            <Form.Group controlId="Location">
                                                <Form.Label>สถานที่ตั้ง</Form.Label>
                                                <Form.Control type="text" value={location} onChange={(event) => {
                                                    setLocation(event.target.value)
                                                }}
                                                isInvalid={validationError.hasOwnProperty('location')} />
                                                {validationError.hasOwnProperty('location') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.location}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="Detail">
                                                <Form.Label>รายละเอียดครุภัณฑ์</Form.Label>
                                                <Form.Control as="textarea" rows={3} value={detail} onChange={(event) => {
                                                    setDetail(event.target.value)
                                                }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="Description">
                                                <Form.Label>หมายเหตุ</Form.Label>
                                                <Form.Control as="textarea" rows={3} value={description} onChange={(event) => {
                                                    setDescription(event.target.value)
                                                }} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group controlId="UserStatus">
                                                <Form.Label className="mt-3">สถานะครุภัณฑ์</Form.Label>
                                                <Form.Control as="select" value={selectedStatus} onChange={(event) => {
                                                    setSelectedStatus(event.target.value);
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('status')} >
                                                    <option value="">- เลือกสถานะครุภัณฑ์ -</option>
                                                    {statuses.map((status) => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </Form.Control>
                                                {validationError.hasOwnProperty('status') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.status}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="Image">
                                                <Form.Label>รูปภาพ</Form.Label>
                                                <Form.Control type="file" onChange={changeHandler}
                                                isInvalid={validationError.hasOwnProperty('image')} />
                                                {validationError.hasOwnProperty('image') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.image}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card className="mb-5">
                                <Card.Body>
                                    <h2 className="responsive-header card-title">
                                        <BsBookmarkFill size={30} className="m-3" />
                                        แก้ไขประเภทครุภัณฑ์
                                    </h2>
                                    <hr />
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="Category">
                                                <Form.Label>ประเภทครุภัณฑ์</Form.Label>
                                                <Form.Control as="select" value={selectedCategory} onChange={(event) => {
                                                    setSelectedCategory(event.target.value);
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('category_code')} >
                                                    <option value="">- เลือกประเภทครุภัณฑ์ -</option>
                                                    {categories.map((category) => (
                                                        <option key={category.category_code} value={category.category_code}>
                                                            {category.category_name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {validationError.hasOwnProperty('category_code') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.category_code}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card className="mb-5">
                                <Card.Body className="text-truncate">
                                    <h2 className="responsive-header card-title text-ellipsis overflow-hidden">
                                        <BsFillCartFill size={30} className="m-3" />
                                        แก้ไขข้อมูลการจัดซื้อครุภัณฑ์
                                    </h2>
                                    <hr />
                                    <Row>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>ปีงบประมาณที่จัดซื้อ</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>วันที่ตรวจรับ</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>เลขที่เอกสาร</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>บริษัทที่จัดจำหน่าย</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>ที่อยู่</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="Newsn">
                                                <Form.Label>เบอร์โทรติดต่อ</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-center mt-4">
                                        <Button variant="primary" className="m-1" size="lg" block="block" type="submit">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy2-fill m-1" viewBox="0 0 16 16">
                                                <path d="M12 2h-2v3h2z"/>
                                                <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                                            </svg>
                                            บันทึก
                                        </Button>
                                        <Button variant="danger" className="m-1" size="lg" block="block" onClick={handleCancel}>
                                            <ImCancelCircle size={16} className="m-1" />
                                            ยกเลิก
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </HelmetProvider>
        </Container>
    )
}

export default EditProduct