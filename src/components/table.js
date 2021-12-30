import React from 'react';
import { Col, message, Row, Switch, Table } from 'antd';
import 'antd/dist/antd.css';
import { toJSON } from '../util/csv';
import SwitchablePicker from './datePicker';

const solveDate = (year,month)=>{
    if(year===null&&month===null){
        return "not found";
    }
    if(month===null){
        return year+"年";
    }
    return year+"年"+(month+1)+"月";
}

function DateTitle(props){
    return (
        <h1>{solveDate(props.year,props.month)}</h1>
    );
}

class MyTable extends React.Component {
    state = {
        object:'company',
        preObject:'',
        columns: {},
        detailColumns: {},
        ordinaryColumns: {},
        hasDetail:false,
        flag:false, // 为 true 的话，componentDidUpdate函数中会请求新数据
        data: [],
        showSize: 25,
        pagination: false,
        loading: false,
        url: '',
        base: "https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_index/",
        year: null,// 字符串格式
        month: null,// 整数格式，0表示1月，1表示2月...
    };
    constructor(props) {
        super(props);
        if(props.hasOwnProperty('hasDetail')==true){
            this.state.hasDetail = props.hasDetail;
            this.state.detailColumns = props.detailColumns;
        }
        this.state.columns = props.columns;
        this.state.ordinaryColumns = props.columns;
        this.state.year = props.year;
        this.state.month = props.month;
        this.state.object = props.object;
        this.state.url = this.state.base + props.item + '/' + props.object + '/';
    }

    componentDidMount() {
        const { pagination, url, year, month } = this.state;
        this.fetch({ pagination, url:url+year+(1+month)+'.csv' });
    }

    componentDidUpdate(){
        if(this.state.flag == true){
            const { pagination, url, year, month } = this.state;
            if(month===null){
                this.fetch({ pagination, url:url+year+'.csv' });
            }
            else{
                this.fetch({ pagination, url:url+year+(1+month)+'.csv' });
            }
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.object!=state.preObject){
            console.log('getDerivedStateFromProps starts!')
            return {
                object: props.object,
                columns: props.columns,
                preObject: props.object,
                flag: true,
                url : state.base + props.item + '/' + props.object + '/'
            }
        }
        return null;
    }


    // 点击 开关 切换到详情页或简况页
    toggleDetail = (checked, event) => {
        if(checked == true){
            this.setState({
                columns:this.state.detailColumns
            })
        }
        else{
            this.setState({
                columns:this.state.ordinaryColumns
            })
        }
    }

    // 每次排序、查看下一页其实都是重新请求文件，然后按要求渲染
    // Todo：有后端之后，考虑怎么优化一下
    handleTableChange = (pagination, filters, sorter) => {
        this.fetch({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            url: this.state.url,
            ...filters,
        });
    };

    expandData = ()=>{
        this.setState({
            showSize: this.state.showSize + 25,
        })
    }

    collapseData = ()=>{
        this.setState({
            showSize: 25,
        })
    }

    // 更新时间
    updateDate = (year, month) => {
        this.setState({
            year:year,
            month:month
        })
        if (month === null) {
            const { pagination, url } = this.state;
            this.fetch({ pagination, url:url+year+'.csv' });
        }
        else {
            const { pagination, url } = this.state;
            this.fetch({ pagination, url:url+year+(1+month)+'.csv' });
        }
    }

    fetch = (params = {}) => {
        this.setState({ flag:false,loading: true });
        console.log(params.url);
        fetch(params.url)
            .then(res => {
                // Todo：最好的情况是在日期选择器中，只显示可以查询的日期，
                if(res.status==404){
                    message.warning('No relevant results yet');
                    return '';
                }
                return res.text();
            })
            .then(data => {
                data = toJSON(data);
                console.log(data);
                this.setState({
                    loading: false,
                    data: data,
                    pagination: {
                        ...params.pagination,
                        total: data.length,
                    },
                });
            })
            .catch(err => {
                console.log('hi!' + err);
            })
    };

    render() {
        const { data, columns, loading, showSize, hasDetail } = this.state;
        return (
            <>
                <Row style={{marginBottom:'20px'}} align='middle' >
                    <Col span={12}>
                        <Row justify='start'>
                            <Col>
                                <SwitchablePicker update={this.updateDate} />
                            </Col>
                        </Row>
                    </Col>
                    { hasDetail? 
                        <Col span={12}>
                            <Row justify='end'>
                                <Col>
                                    <span style={{
                                        color:'#FFCC19',
                                        fontSize:'18px',
                                        marginRight:'10px'
                                        }}>
                                        详情
                                    </span>
                                    <Switch onChange={this.toggleDetail}/>
                                </Col>
                            </Row>
                        </Col>
                        :<></>
                    }
                </Row>
                <Table
                    columns={columns}
                    rowKey={record => record.rank}
                    dataSource={data.slice(0,Math.min(showSize,data.length))}
                    pagination={false}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
                <Row>
                    <Col span={12}>
                        <Row justify='start'>
                            <Col>
                                {  
                                    showSize<data.length?
                                    <a style={{
                                        color:'#FFCC19',
                                        fontSize:'18px',}}
                                        onClick={this.expandData}>
                                            展示更多{'>>'}
                                    </a>:
                                    <span style={{
                                        color:'gray',
                                        fontSize:'18px',}}>
                                        没有更多啦
                                    </span>
                                }
                                
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Row justify='end'>
                            <Col offset={1}>
                                <a style={{
                                        color:'#FFCC19',
                                        fontSize:'18px',}}>没有您的数据？</a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}

export default MyTable;