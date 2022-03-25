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
                >
                <Menu.Item key='glossary'><Dictionary type='word'/></Menu.Item>
                <Menu.Item key='QA'><QA type='word'/></Menu.Item>
            </Menu>
        )
    }
    return (
        <div className='header'>
            <div className='header-content'>
                <div className='header-logo'>
                    <img 
                        style={{height:'45px',width:'36px'}}
                        src={'/pics/Main Logo.png'}
                    />
                    <img
                        style={{width:'185px'}}
                        src={'/pics/OpenLeaderboard.png'}
                    />
                </div>
                <div className='header-pc'>
                    <Dictionary/>
                    <QA/>
                    <img 
                        style={{height:'48px',width:'48px',cursor:'pointer'}}
                        onClick={()=>{
                            let lan = language;
                            if(language == 'zh_CN')
                                lan = 'en';
                            else
                                lan = 'zh_CN';
                            i18n.changeLanguage(lan);
                            setLanguage(lan);
                        }}
                        src='/pics/translation.png'
                    />
                </div>
                <div className='header-phone'>
                    <Dropdown overlay={MyMenu} className=''>
                        <MenuOutlined style={{fontSize:'1rem'}}/>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default MyHeader;