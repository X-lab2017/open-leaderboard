import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Layout, Menu, Dropdown, Image, Row, Col} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import i18n from '../util/i18n';
import { useTranslation } from 'react-i18next';
import { lngs } from '../util/languages';
import './header.css'
import Dictionary from './Dictionary';
import QA from './QA';
const { Header } = Layout;



function MyHeader(props){
    const { t } = useTranslation();
    const MyMenu = ()=>{
        return (
            <Menu 
                style={{background:'rgba(255,255,255,0)'}}
                mode="horizontal" 
                defaultSelectedKeys={['company']}
                onClick={(event)=>{
                    console.log(event.key);
                    if(event.key=='company' || event.key == 'repo' || event.key == 'actor'){
                        props.callback(event.key)
                        return false;
                    }
                }}
                >
                <Menu.Item key='company'>{t('navBar.enterprise')}</Menu.Item>
                <Menu.Item key='repo'>{t('navBar.project')}</Menu.Item>
                <Menu.Item key='actor'>{t('navBar.bot')}</Menu.Item>
                <Menu.Item key='glossary'><Dictionary type='word'/></Menu.Item>
                <Menu.Item key='QA'><QA type='word'/></Menu.Item>
            </Menu>
        )
    }
    return (
        <Header style={{
            background:'rgba(222,225,255,0)', 
            // position: 'fixed', 
            width: '100%',
            padding:'10px 0px 0px 0px' }}>
            <Row>
                <Col xs={{span:20, offset:2}} sm={{span:20, offset:2}} md={{span:12,offset:0}} lg={{span:12,offset:0}} xl={{span:10,offset:0}} xxl={{span:8,offset:0}} >
                    <Row gutter={[16,0]} justify='center' align='middle'>
                        <Col style={{textAlign:'center'}}>
                            <Image 
                                style={{height:'50px',width:'auto'}}
                                preview={false}
                                src={'/pics/Main Logo.png'}/>
                        </Col>
                        <Col>
                            <Image
                                style={{width:'10rem'}}
                                preview={false}
                                src={'/pics/OpenInsight-Index.png'}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={0} sm={0} md={8} lg={12} xl={8} xxl={8}>
                <Menu 
                style={{background:'rgba(255,255,255,0)'}}
                mode="horizontal" 
                defaultSelectedKeys={['company']}
                onClick={(event)=>{
                    console.log(event.key);
                    if(event.key=='company' || event.key == 'repo' || event.key == 'actor'){
                        props.callback(event.key)
                        return false;
                    }
                }}
                >
                <Menu.Item key='company'>{t('navBar.enterprise')}</Menu.Item>
                <Menu.Item key='repo'>{t('navBar.project')}</Menu.Item>
                <Menu.Item key='actor'>{t('navBar.bot')}</Menu.Item>
                </Menu>
                </Col>
                <Col xs={0} sm={0} md={7} lg={12} xl={6} xxl={8}>
                    <Dictionary/>
                    <QA/>
                    <Dropdown overlay={<Menu>
                            {Object.keys(lngs).map((lng) => (
                                <Menu.Item key={lng}>
                                    <a onClick={() => i18n.changeLanguage(lng)} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }}>
                                        {lngs[lng].nativeName}
                                    </a>
                                </Menu.Item>
                            ))}
                        </Menu>}>
                        <Image 
                            style={{height:'60px',width:'auto',marginTop:'15px'}}
                            preview={false}
                            src='/pics/International.png'/>
                    </Dropdown>
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