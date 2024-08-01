import '../../assets/components/users/CreateUser.css'

import { FaUserPlus } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

import axios from 'axios'
import Swal from 'sweetalert2'
import AxiosInstance from '../login/AxiosInstance'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import React, { useState } from 'react'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
    const webTitle = 'เพิ่มข้อมูลบัญชีผู้ใช้';
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    
    const [employeeID, setEmployeeID] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [position, setPosition] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [section, setSection] = useState("");
    const [role, setRole] = useState("");

    const [validationError, setValidationError] = useState({});

    const [selectedOrganization, setSelectedOrganization] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const [organizations, setOrganizations] = useState([
        'กลุ่มตรวจสอบภายใน (ตน.)',
        'กลุ่มพัฒนาระบบบริหาร (พร.)',
        'สำนักงานเลขานุการกรม (สล.)',
        'กองเทคโนโลยีชุมชน (ทช.)',
        'กองบริหารและรับรองห้องปฏิบัติการ (บร.)',
        'กองพัฒนาศักยภาพนักวิทยาศาสตร์ห้องปฏิบัติการ (พศ.)',
        'กองหอสมุดและศูนย์สารสนเทศวิทยาศาสตร์และเทคโนโลยี (สท.)',
        'กองเคมีภัณฑ์และผลิตภัณฑ์อุปโภค (คอ.)',
        'กองวัสดุวิศวกรรม (วว.)',
        'กองผลิตภัณฑ์อาหารและวัสดุสัมผัสอาหาร (อว.)',
        'กองสอบเทียบเครื่องมือวัด (สค.)',
        'กองบริหารจัดการทดสอบความชำนาญห้องปฏิบัติการ (บท.)',
        'กองตรวจและรับรองคุณภาพผลิตภัณฑ์ (รผ.)',
        'กองยุทธศาสตร์และแผนงาน (ยผ.)'
    ]);

    const [sections, setSections] = useState({
        'กลุ่มตรวจสอบภายใน (ตน.)': [
            'กลุ่มตรวจสอบภายใน'
        ],
        'กลุ่มพัฒนาระบบบริหาร (พร.)': [
            'กลุ่มพัฒนาระบบบริหาร'
        ],
        'สำนักงานเลขานุการกรม (สล.)': [
            'กลุ่มอำนวยการกลาง',
            'กลุ่มบริหารทรัพยากรบุคคล',
            'กลุ่มการคลัง',
            'กลุ่มพัสดุ',
            'กลุ่มประชาสัมพันธ์',
            'กลุ่มสนับสนุนและบริการทางวิศวกรรมด้านเครื่องมือและอุปกรณ์'
        ],
        'กองเทคโนโลยีชุมชน (ทช.)': [
            'กลุ่มอำนวยการเทคโนโลยีชุมชน', 
            'กลุ่มวิจัยและพัฒนาเซรามิกและแก้ว',
            'กลุ่มวิจัยและพัฒนาสมุนไพร',
            'กลุ่มวิจัยและพัฒนาอาหารแปรรูป',
            'กลุ่มวิจัยและพัฒนาผลิตภัณฑ์หัตถกรรมพื้นถิ่น',
            'กลุ่มวิจัยและพัฒนาเครื่องมือและอุปกรณ์ชุมชน'
        ],
        'กองบริหารและรับรองห้องปฏิบัติการ (บร.)': [
            'กลุ่มอำนวยการและพัฒนาระบบการรับรอง', 
            'กลุ่มรับรองระบบงานห้องปฏิบัติการ 1',
            'กลุ่มรับรองระบบงานห้องปฏิบัติการ 2',
            'กลุ่มรับรองระบบงานห้องปฏิบัติการ 3'
        ],
        'กองพัฒนาศักยภาพนักวิทยาศาสตร์ห้องปฏิบัติการ (พศ.)': [
            'กลุ่มอำนวยการพัฒนาศักยภาพนักวิทยาศาสตร์ห้องปฏิบัติการ', 
            'กลุ่มพัฒนาคุณภาพและมาตรฐานหลักสูตร',
            'กลุ่มบริการพัฒนาศักยภาพบุคลากร',
            'กลุ่มพัฒนาศักยภาพหน่วยตรวจสอบและรับรอง',
            'กลุ่มรับรองความสามารถบุคลากร'
        ],
        'กองหอสมุดและศูนย์สารสนเทศวิทยาศาสตร์และเทคโนโลยี (สท.)': [
            'กลุ่มอำนวยการสารสนเทศวิทยาศาสตร์และเทคโนโลยี', 
            'กลุ่มหอสมุดวิทยาศาสตร์และเทคโนโลยี',
            'กลุ่มสารสนเทศวิทยาศาสตร์และเทคโนโลยี',
            'กลุ่มพัฒนาคลังข้อมูลด้านโครงสร้างพื้นฐานทางคุณภาพของประเทศ',
            'กลุ่มเทคโนโลยีสารสนเทศ'
        ],
        'กองเคมีภัณฑ์และผลิตภัณฑ์อุปโภค (คอ.)': [
            'กลุ่มอำนวยการเคมีภัณฑ์และผลิตภัณฑ์อุปโภค', 
            'กลุ่มเคมีเพื่ออุตสาหกรรม',
            'กลุ่มผลิตภัณฑ์โลหะ',
            'กลุ่มผลิตภัณฑ์อุปโภค',
            'กลุ่มคุณภาพสิ่งแวดล้อม',
            'กลุ่มพัฒนามาตรฐานและเกณฑ์การยอมรับ',
            'กลุ่มนวัตกรรมสีเขียว'
        ],
        'กองวัสดุวิศวกรรม (วว.)': [
            'กลุ่มอำนวยการวัสดุวิศวกรรม', 
            'กลุ่มวัสดุขึ้นสูง',
            'กลุ่มวัสดุและอุปกรณ์ทางการแพทย์',
            'กลุ่มพลาสติกและผลิตภัณฑ์พลาสติก',
            'กลุ่มยางและผลิตภัณฑ์ยาง',
            'กลุ่มเส้นใยธรรมชาติ',
            'กลุ่มวัสดุก่อสร้าง',
            'กลุ่มนวัตกรรมหุ่นยนต์และระบบอัตโนมัติ'
        ],
        'กองผลิตภัณฑ์อาหารและวัสดุสัมผัสอาหาร (อว.)': [
            'กลุ่มอำนวยการผลิตภัณฑ์อาหารและวัสดุสัมผัสอาหาร', 
            'กลุ่มวัสดุสัมผัสอาหารของอาเซียน',
            'กลุ่มอาหารสุขภาพ',
            'กลุ่มความปลอดภัยในอาหาร',
            'กลุ่มคุณภาพทางจุลชีววิทยาในอาหาร',
            'กลุ่มน้ำอุปโภคและบริโภค',
            'กลุ่มคุณภาพทางประสาทสัมผัสในอาหาร'
        ],
        'กองสอบเทียบเครื่องมือวัด (สค.)': [
            'กลุ่มอำนวยการสอบเทียบเครื่องมือวัด', 
            'กลุ่มสอบเทียบเครื่องมือวัด 1',
            'กลุ่มสอบเทียบเครื่องมือวัด 2'
        ],
        'กองบริหารจัดการทดสอบความชำนาญห้องปฏิบัติการ (บท.)': [
            'กลุ่มอำนวยการบริหารจัดการทดสอบความชำนาญห้องปฏิบัติการ', 
            'กลุ่มทดสอบความชำนาญห้องปฏิบัติการ'
        ],
        'กองตรวจและรับรองคุณภาพผลิตภัณฑ์ (รผ.)': [
            'กลุ่มอำนวยการตรวจและรับรองคุณภาพผลิตภัณฑ์', 
            'กลุ่มบริการตรวจและรับรองคุณภาพผลิตภัณฑ์'
        ],
        'กองยุทธศาสตร์และแผนงาน (ยผ.)': [
            'กลุ่มอำนวยการกลาง', 
            'กลุ่มแผนงานและงบประมาณ',
            'กลุ่มบริหารแผนงานวิจัย',
            'กลุ่มนโยบายและยุทธศาสตร์'
        ]
    });

    const [roles, setRoles] = useState([
        { label: 'ผู้ดูแลระบบ', value: 'DSSROLE-ADMIN' },
        { label: 'เจ้าหน้าที่', value: 'DSSROLE-OFFICER' },
        { label: 'ผู้ใช้งานระบบ', value: 'DSSROLE-USER' }
    ]);

    const handleOrganizationChange = (event) => {
        const organization = event.target.value;
        setSelectedOrganization(organization);
        setOrganization(organization);
        setSelectedSection('');
        setSection('');
    };

    const handleSectionChange = (event) => {
        const section = event.target.value;
        setSelectedSection(section);
        setSection(section);
    };

    const handleRoleChange = (event) => {
        const role = event.target.value;
        setSelectedRole(role);
        setRole(role);
    }

    const handleCancel = () => {
        navigate(-1);
    };

    const createUser = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('employee_id', employeeID);
        formData.append('employee_name', employeeName);
        formData.append('position', position);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('organization', organization);
        formData.append('section', section);
        formData.append('role', role);

        await AxiosInstance.post(`/users`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                confirmButtonText: "ตกลง",
                text: data.message
            })
            navigate("/user/list");
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors);
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
                    <link rel='icon' type='image/png' href='/logo.png'/>
                </Helmet>
                <Row className="justify-content-center">
                    <Col md={12} className="col-sm-12">
                        <Card className="mb-5">
                            <Card.Body>
                                <h2 className="responsive-header card-title">
                                    <FaUserPlus size={30} className="m-3" />
                                    เพิ่มข้อมูลบัญชีผู้ใช้
                                </h2>
                                <hr />
                                <Form onSubmit={createUser}>
                                    <Row>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="EmployeeID">
                                                <Form.Label>รหัสผู้ใช้งาน</Form.Label>
                                                <Form.Control type="text" value={employeeID} onChange={(event) => {
                                                    setEmployeeID(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('employee_id')}/>
                                                {validationError.hasOwnProperty('employee_id') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.employee_id}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="EmployeeName">
                                                <Form.Label>ชื่อเจ้าของบัญชี</Form.Label>
                                                <Form.Control type="text" value={employeeName} onChange={(event) => {
                                                    setEmployeeName(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('employee_name')} />
                                                {validationError.hasOwnProperty('employee_name') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.employee_name}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="mt-3">
                                            <Form.Group controlId="UserPosition">
                                                <Form.Label>ตำแหน่ง</Form.Label>
                                                <Form.Control type="text" value={position} onChange={(event) => {
                                                    setPosition(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('position')} />
                                                {validationError.hasOwnProperty('position') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.position}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6} className="mt-3">
                                            <Form.Group controlId="Username">
                                                <Form.Label>ชื่อบัญชีผู้ใช้</Form.Label>
                                                <Form.Control type="text" value={username} onChange={(event) => {
                                                    setUsername(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('username')} />
                                                {validationError.hasOwnProperty('username') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.username}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="mt-3">
                                            <Form.Group controlId="UserPassword">
                                                <Form.Label>รหัสผ่าน</Form.Label>
                                                <Form.Control type="password" value={password} onChange={(event) => {
                                                    setPassword(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('password')} />
                                                {validationError.hasOwnProperty('password') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.password}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="UserEmail">
                                                <Form.Label>อีเมล</Form.Label>
                                                <Form.Control type="email" value={email} onChange={(event) => {
                                                    setEmail(event.target.value)
                                                }} 
                                                isInvalid={validationError.hasOwnProperty('email')} />
                                                {validationError.hasOwnProperty('email') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.email}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="UserOrganization">
                                                <Form.Label>กอง / สำนัก</Form.Label>
                                                <Form.Control as="select" value={selectedOrganization} onChange={handleOrganizationChange} isInvalid={validationError.hasOwnProperty('organization')}>
                                                    <option value="">- เลือกกอง / สำนัก -</option>
                                                    {organizations.map((organization, index) => (
                                                        <option key={index} value={organization}>{organization}</option>
                                                    ))}
                                                </Form.Control>
                                                {validationError.hasOwnProperty('organization') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.organization}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group controlId="UserSection" hidden={!selectedOrganization}>
                                                <Form.Label className="mt-3">กลุ่มงาน / ฝ่าย</Form.Label>
                                                <Form.Control as="select" onChange={handleSectionChange} isInvalid={validationError.hasOwnProperty('section')} >
                                                    <option value="">- เลือกกลุ่มงาน / ฝ่าย -</option>
                                                    {sections[selectedOrganization] && sections[selectedOrganization].map((section, index) => (
                                                        <option key={index} value={section}>{section}</option>
                                                    ))}
                                                </Form.Control>
                                                {validationError.hasOwnProperty('section') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.section}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="mt-3">
                                            <Form.Group controlId="UserRole">
                                                <Form.Label>สถานะ</Form.Label>
                                                <Form.Control as="select" value={selectedRole} onChange={handleRoleChange} isInvalid={validationError.hasOwnProperty('role')}>
                                                    <option value="">- เลือกสถานะ -</option>
                                                    {roles.map((role, index) => (
                                                        <option key={index} value={role.value}>{role.label}</option>
                                                    ))}
                                                </Form.Control>
                                                {validationError.hasOwnProperty('role') && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationError.role}
                                                    </Form.Control.Feedback>
                                                )}
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
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </HelmetProvider>
        </Container>
    )
}

export default CreateUser