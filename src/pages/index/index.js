import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import { Row, Col, Layout } from 'antd';
import MyFooter from '../../components/footer';
import MyHeader from '../../components/header';
import MyTable from './table';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const { Content } = Layout;

function callback(key) {
    console.log(key);
}

ReactDOM.render(
    <Layout className="layout">
        <MyHeader />
        <Content style={{ padding: '0 50px', background: '#fff' }}>
            <Row>
                <Col span={18} offset={3}>
                    <Tabs onChange={callback} type="card" centered style={{ marginTop: '30px' }}>
                        <TabPane tab="活跃度" key="1">
                            <MyTable year={"2021"} month={3} />
                        </TabPane>
                        <TabPane tab="影响力" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Content>
        <MyFooter />
    </Layout>,
    document.getElementById('root')
);