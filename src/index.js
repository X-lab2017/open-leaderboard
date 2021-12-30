import ReactDOM from 'react-dom'
import React from 'react';
import { Row, Col, Layout, Image, Card, Tabs, ConfigProvider } from 'antd';
import 'antd/dist/antd.css'

import Description from './Description';

import MyFooter from './components/footer';
import MyHeader from './components/header';
import MyTable from './components/table';
import ArrowRender from './components/arrow';
import PointRender from './components/changeNumber';
import RoundFloat from './components/resolveFloat';
import Trophy from './components/rankTrophy';
import './tab.css'
import './index.css'
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { Content } = Layout;

const titleDir = {
    company: 'Company',
    repo: 'Repository',
    actor: 'Bot',
}
const dataIndexDir = {
    company: 'company',
    repo: 'repo_name',
    actor: 'actor_login',
}
const activityColumns = (object)=>{
    return (
        [
            {
                title: 'rank',
                dataIndex: 'rank',
                width: '5%',
                align: 'center',
                render: Trophy,
            },
            {
                title: '',
                dataIndex: 'diff_rank',
                render: ArrowRender,
                align:'left',
                width: '5%',
            },
            {
                title: titleDir[object],
                dataIndex: dataIndexDir[object],
                align:'center',
                width: '20%',
            },
            {
                title: 'Activity',
                dataIndex: 'activity',
                align:'right',
                width: '20%',
            },
            {
                title:'',
                dataIndex:'diff_activity',
                width:'10%',
                align:'left',
                render: PointRender,
            }
        ]
    )
}
const activityDetailColumns = (object)=>[
    {
        title: 'Rank',
        dataIndex: 'rank',
        width: '5%',
        align: 'center',
        render: Trophy,
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render: ArrowRender,
        align:'left',
        width: '5%',
    },
    {
        title: titleDir[object],
        dataIndex: dataIndexDir[object],
        align:'center',
        width: '15%',
    },
    {
        title: 'Activity',
        dataIndex: 'activity',
        align:'right',
        width: '10%',
    },
    {
        title:'',
        dataIndex:'diff_activity',
        width:'10%',
        align:'left',
        render: PointRender,
    },
    {
        title:'Issue Comments',
        dataIndex:'issue_comment',
        width:'10%',
        align:'center',
    },
    {
        title:'Open Issues',
        dataIndex:'open_issue',
        width:'10%',
        align:'center',
    },
    {
        title:'Open Pulls',
        dataIndex:'open_pull',
        width:'10%',
        align:'center',
    },
    {
        title:'Merge Pulls',
        dataIndex:'merge_pull',
        width:'10%',
        align:'center',
    },
    {
        title:'PR Reviews',
        dataIndex:'pr_review',
        width:'10%',
        align:'center',
    },
];
const influenceColumns = (object)=>[
    {
        title: 'Rank',
        dataIndex: 'rank',
        width: '5%',
        render: Trophy,
        align: 'center',
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        render: ArrowRender,
        align:'left',
        width: '5%',
    },
    {
        title: titleDir[object],
        dataIndex: dataIndexDir[object],
        width: '20%',
        align:'center',
    },
    {
        title: 'Influence',
        dataIndex: 'influence',
        width: '20%',
        align:'right',
        render:(text, row, index)=>{
            return RoundFloat(text)
        }
    },
    {
        title:'',
        dataIndex:'diff_influence',
        width:'10%',
        align: 'left',
        render: (text, row, index)=>{
            text = RoundFloat(text)
            return PointRender(text, row, index)
        },
    }
];

class App extends React.Component {

    constructor(){
        super();
        this.state = {
            object:'company',
        };
    }

    changeObject = (object)=>{
        if(object!=this.state.object){
            this.setState({
                object: object,
            })
        }
    }

    render(){
        const { object } = this.state;
        return(
            <ConfigProvider>
                <Layout className="layout" 
                        style={{backgroundColor:'rgba(0,0,0,0)',}}>
                    <Image 
                        preview={false}
                        style={{zIndex:-1,position:'absolute'}}
                        width={'100%'} src="/pics/Slide Background.png"/>
                    <Row justify='center'>
                        <Col xs={24} sm={24} md={20} lg={18} xl={16} xxl={16} style={{overflow:'visible'}}>
                            <MyHeader callback={this.changeObject} />
                            <Content style={{ 
                                backgroundColor:'rgba(0,0,0,0)',
                                }}>
                                <Description/>
                                <Row style={{marginTop:'130px'}}>
                                    <Col span={24}>
                                        <Tabs 
                                            centered
                                            tabBarGutter={50}
                                            style={{zIndex:5}}
                                            tabBarStyle={{
                                                zIndex:5,
                                            }}
                                            >
                                            <TabPane tab={t('activity')} key="1">
                                                <Card
                                                    style={{
                                                        zIndex:10,
                                                        bottom:'20px',
                                                        margin:'20px auto',
                                                        width:'100%',
                                                        background: '#FFFFFF',
                                                        boxShadow:'0px 25px 50px 25px #F7F7FF',
                                                        borderRadius: '42px'
                                                    }}
                                                    >
                                                    <MyTable 
                                                        hasDetail={true}
                                                        year={"2021"} 
                                                        month={10} 
                                                        item={"activity"}
                                                        object={object}
                                                        columns={activityColumns(object)}
                                                        detailColumns={activityDetailColumns(object)}
                                                        />
                                                </Card>
                                            </TabPane>
                                            <TabPane tab={t('influence')} key="2">
                                                <Card
                                                    style={{
                                                        zIndex:10,
                                                        bottom:'20px',
                                                        margin:'20px auto',
                                                        width:'100%',
                                                        background: '#FFFFFF',
                                                        boxShadow:'0px 25px 50px 25px #F7F7FF',
                                                        borderRadius: '42px'
                                                    }}
                                                    >
                                                    <MyTable 
                                                        year={"2021"} 
                                                        month={10} 
                                                        item={"influence"}
                                                        object={object}
                                                        columns={influenceColumns(object)}/>
                                                </Card>
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            </Content>
                        </Col>
                    </Row>
                    <MyFooter />
                    <Image 
                        style={{
                            zIndex:-1,
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
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);