import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Layout, Menu, Dropdown, Image, Row, Col} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import i18n from '../util/i18n';
import { useTranslation } from 'react-i18next';
import { lngs } from '../util/languages';
import './header.css'
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
                <Col offset={4} span={5}>
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
                <Col span={7} offset={2}>
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
                <Col span={5}>
                    <Image 
                        style={{height:'60px',width:'auto',marginTop:'15px'}}
                        preview={false}
                        src='/pics/Dic.png'/>
                    <Image 
                        style={{height:'60px',width:'auto',marginTop:'15px'}}
                        preview={false}
                        src='/pics/Q&A.png'/>
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