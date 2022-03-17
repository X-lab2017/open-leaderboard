import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Dropdown, Image, Row, Col} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import i18n from '../util/i18n';
import { useTranslation } from 'react-i18next';
import './header.css'
import Dictionary from './Dictionary';
import QA from './QA';
const { Header } = Layout;

const MyHeader = ()=>{
    const { t } = useTranslation();
    const [ language, setLanguage ] = useState('zh_CN');
    const MyMenu = ()=>{
        return (
            <Menu 
                style={{background:'rgba(255,255,255,0)'}}
                mode="horizontal" 
                defaultSelectedKeys={['company']}
                >
                <Menu.Item key='glossary'><Dictionary type='word'/></Menu.Item>
                <Menu.Item key='QA'><QA type='word'/></Menu.Item>
            </Menu>
        )
    }
    return (
        <Header style={{background:'rgba(222,225,255,0)'}}>
            <Row className='container' align='middle' justify='center' style={{width: '100%', height:'80px'}}>
                <Col style={{display:'flex',flex:'0 1 305px',justifyContent:'space-between',alignItems:'center'}}>
                    <Image 
                        style={{height:'60px',width:'48px'}}
                        preview={false}
                        src={'/pics/Main Logo.png'}/>
                    <Image
                        style={{width:'250px'}}
                        preview={false}
                        src={'/pics/OpenLeaderboard.png'}/>
                </Col>
                <Col style={{display:'flex',flex:'1 1 auto',justifyContent:'center',alignItems:'center'}}>
                </Col>
                <Col style={{display:'flex',flex:'0 1 180px',justifyContent:'space-between',alignItems:'center'}}>
                    <Dictionary/>
                    <QA/>
                    <Image 
                        style={{height:'48px',width:'48px',cursor:'pointer'}}
                        preview={false}
                        onClick={()=>{
                            let lan = language;
                            if(language == 'zh_CN')
                                lan = 'en';
                            else
                                lan = 'zh_CN';
                            i18n.changeLanguage(lan);
                            setLanguage(lan);
                        }}
                        src='/pics/translation.png'/>
                </Col>
                <Col xs={2} sm={2} md={0} lg={0} xl={0} xxl={0}>
                    <Dropdown overlay={MyMenu}>
                        <MenuOutlined style={{fontSize:'1rem'}}/>
                    </Dropdown>
                    
                </Col>
            </Row>
        </Header>
    )
}

export default MyHeader;