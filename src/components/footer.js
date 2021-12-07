import ReactDOM from 'react-dom'
import { Table, Tag, Space } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{ textAlign: 'center' }}>
            ©2021 X-lab
        </Footer>
    );
}

export default MyFooter;