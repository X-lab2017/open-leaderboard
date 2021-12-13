import React from 'react';
import ReactDOM from 'react-dom'
import { Table, Tag, Space } from 'antd';
import qs from 'qs';
import 'antd/dist/antd.css';
import { toJSON } from '../../util/csv';
import SwitchablePicker from './datePicker';

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a,b)=> a.rank - b.rank,
        width: '5%',
    },
    {
        title: '',
        dataIndex: 'diff_rank',
        width: '5%',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Activity',
        dataIndex: 'activity',
        sorter: true,
        width: '20%',
    },
];

class MyTable extends React.Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        url:'',
        base:"https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_index/activity/company/",
        year:null,// 字符串格式
        month:null,// 整数格式，0表示1月，1表示2月...
    };
    constructor(props){
        super(props);
        this.state.year = props.year;
        this.state.month = props.month;
        this.state.url =  this.state.base+props.year+(props.month+1)+'.csv';
    }

    componentDidMount() {
        const { pagination,url } = this.state;
        this.fetch({ pagination,url});
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

    updateDate = (year,month)=>{
        this.state.year=year;
        this.state.month=month;
        this.state.url=this.state.base+year+(month+1)+'.csv';
        const { pagination,url } = this.state;
        this.fetch({pagination,url});
    }

    fetch = (params = {}) => {
        console.log(params);
        this.setState({ loading: true });
        fetch(params.url)
            .then(res => res.text())
            .then(data => {
                data = toJSON(data);
                this.setState({
                    loading: false,
                    data: data,
                    pagination: {
                        ...params.pagination,
                        total: data.length,
                    },
                });
            });
    };

    render() {
        const { data, pagination, loading, year, month } = this.state;
        return (
            <>
                <SwitchablePicker year={year} month={month} fetch={this.updateDate}/>
                <Table
                    columns={columns}
                    rowKey={record => record.rank}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
            </>
            
        );
    }
}

export default MyTable;