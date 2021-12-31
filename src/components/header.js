import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Layout, Menu, Dropdown, Image, Row, Col} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import i18n from '../util/i18n';
import { useTranslation } from 'react-i18next';
import { lngs } from '../util/languages';
import './header.css'
import Dictionary from './Dictionary';
import QA from './QA';
const { Header } = Layout;
const { SubMenu } = Menu;

function MyHeader(props){
    const { t } = useTranslation();
    return (
        <Header style={{
            background:'rgba(222,225,255,0)', 
            zIndex:99,
            // position: 'fixed', 
            width: '100%',
            height:'100px',
            padding:'20px 0px 0px 0px' }}>
            <Row>
                <Col xs={22} sm={16} md={13} lg={12} xl={10} xxl={8} >
                    <Row gutter={[16,16]}>
                        <Col>
                            <Image 
                                style={{float:'left',height:'50px',width:'auto',marginTop:'7px'}}
                                preview={false}
                                src={'/pics/Main Logo.png'}/>
                        </Col>
                        <Col>
                            <Image
                                style={{float:'left',height:'30px',width:'auto',marginTop:'17px'}}
                                preview={false}
                                src={'/pics/OpenInsight-Index.png'}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={22} sm={16} md={13} lg={12} xl={8} xxl={8}>
                    <Menu 
                        style={{background:'rgba(255,255,255,0)'}}
                        mode="horizontal" 
                        defaultSelectedKeys={['company']}
                        onClick={(event)=>{
                            props.callback(event.key)
                            return false;
                        }}
                        >
                        <Menu.Item key='company'>{t('navBar.enterprise')}</Menu.Item>
                        <Menu.Item key='repo'>{t('navBar.project')}</Menu.Item>
                        <Menu.Item key='actor'>{t('navBar.bot')}</Menu.Item>
                    </Menu>
                </Col>
                <Col xs={22} sm={16} md={13} lg={12} xl={6} xxl={8}>
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
            </Row>
        </Header>
    )
}

export default MyHeader;