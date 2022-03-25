import ReactDOM from 'react-dom'
import React from 'react';
import { Row, Col, Layout, Image, ConfigProvider } from 'antd';
import 'antd/dist/antd.css'

import Description from './Description';

import MyFooter from './components/footer';
import MyHeader from './components/header';
import MyTable from './components/table';
import './index.css'
import { useTranslation } from 'react-i18next';
import ScrollTopButton from './components/scrollTopButton';
const { Content } = Layout;

const App = () => {
    console.log('layout viewport = ',document.documentElement.clientWidth);
    console.log('visual viewport = ',window.innerWidth);
    console.log('window.width = ',window.screen.width);
    const {t} = useTranslation();
    return(
        <ConfigProvider>
            <Layout className='layout' style={{backgroundColor:'rgba(0,0,0,0)',minWidth:'320px'}}>
                <Image preview={false} style={{zIndex:-1,position:'absolute',top:0}} width={'100%'} src="/pics/Header BG.png"/>
                <ScrollTopButton />
                <MyHeader/>
                <Content className='container'>
                    <Description/>
                    <Row>
                        <Col span={24}>
                            <MyTable t={t}/>
                        </Col>
                    </Row>
                </Content>
                <MyFooter />
                <Image style={{
                        zIndex:-2,
                        position:'absolute',
                        height:'2000px',
                        bottom:'0px',
                        }}
                    preview={false}
                    src='/pics/Bubble BG.png'/>
            </Layout>
        </ConfigProvider>   
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);