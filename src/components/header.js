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

function MyHeader(){
    const { t } = useTranslation();
    return (
        <Header style={{
            background:'rgba(222,225,255,0)', 
            zIndex:99,
            // position: 'fixed', 
            width: '100%',
            height:'100px',
            paddingTop:'20px' }}>
            <Row>
                <Col span={1} offset={3}>
                    <Image 
                        style={{float:'left',height:'50px',width:'auto',marginTop:'7px'}}
                        preview={false}
                        src={'/pics/Main Logo.png'}/>
                </Col>
                <Col span={5}>
                <Image
                        style={{float:'left',height:'30px',width:'auto',marginTop:'17px'}}
                        preview={false}
                        src={'/pics/OpenInsight-Index.png'}/>
                </Col>
                <Col span={7} offset={1}>
                    <Menu style={{background:'rgba(255,255,255,0)'}}mode="horizontal" defaultSelectedKeys={['enterprise']}>
                        <Menu.Item key='enterprise'>{t('navBar.enterprise')}</Menu.Item>
                        <Menu.Item key='project'>{t('navBar.project')}</Menu.Item>
                        <Menu.Item key='bot'>{t('navBar.bot')}</Menu.Item>

                        {/* Language Switcher */}
                        <SubMenu key="SubMenu" icon={<DownOutlined />} title="Language">
                            {Object.keys(lngs).map((lng) => (
                                <Menu.Item key={lng}>
                                    <a onClick={() => i18n.changeLanguage(lng)} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }}>
                                        {lngs[lng].nativeName}
                                    </a>
                                </Menu.Item>
                            ))}
                        </SubMenu>
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
                    <Image 
                        style={{height:'60px',width:'auto',marginTop:'15px'}}
                        preview={false}
                        src='/pics/International.png'/>
                </Col>
            </Row>
        </Header>
    )
}

export default MyHeader;