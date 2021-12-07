import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Layout, Menu, Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import i18n from '../components/i18n';
import { useTranslation } from 'react-i18next';
import { lngs } from './languages';
const { Header } = Layout;
const { SubMenu } = Menu;


function MyHeader(){
    const { t } = useTranslation();
    return (
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['enterprise']}>
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
            
            
        </Header>
    )
}

export default MyHeader;