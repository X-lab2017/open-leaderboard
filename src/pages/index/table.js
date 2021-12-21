import React from 'react';
import { message, Table } from 'antd';
import 'antd/dist/antd.css';
import { toJSON } from '../../util/csv';
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

const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
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
        flag:false, // 为 true 的话，componentDidUpdate函数中会请求新数据
        data: [],
        pagination: false,
        loading: false,
        url: '',
        base: "https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_index/activity/company/",
        year: null,// 字符串格式
        month: null,// 整数格式，0表示1月，1表示2月...
    };
    constructor(props) {
        super(props);
        this.state.year = props.year;
        this.state.month = props.month;
        this.state.url = this.state.base + props.year + (props.month + 1) + '.csv';
    }

    componentDidMount() {
        const { pagination, url } = this.state;
        this.fetch({ pagination, url });
    }

    componentDidUpdate() {
        if(this.state.flag==true){
            this.setState({flag:false});
            const { pagination, url } = this.state;
            this.fetch({ pagination, url });
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

    // 更新 state 后自动调用 生命周期 DidUpdate 请求最新数据
    updateDate = (year, month) => {
        if (month === null) {
            this.setState({
                year: year,
                month: month,
                url: this.state.base + year + '.csv',
                flag:true,
            });
        }
        else {
            this.setState({
                year: year,
                month: month,
                url: this.state.base + year + (month + 1) + '.csv',
                flag:true,
            });
        }
    }

    fetch = (params = {}) => {
        this.setState({ loading: true });
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
        const { data, pagination, loading, year, month } = this.state;
        return (
            <>
                <SwitchablePicker update={this.updateDate} />
                <DateTitle year={year} month={month} />
                <Table
                    columns={columns}
                    rowKey={record => record.rank}
                    dataSource={data}
                    pagination={false}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
            </>

        );
    }
}

export default MyTable;