import React, {useState, useEffect} from 'react';
import { Col, message, Row, Table, Card } from 'antd';
import MyAvatar from './avatar';
import 'antd/dist/antd.css';
import QAmiss from './QA2';
import TablePanel from './TablePanel';
import ArrowRender from './arrow';
import PointRender from './changeNumber';
import RoundFloat from './resolveFloat';
import Trophy from './rankTrophy';
import expandObject from '../util/expandObject';
import { t } from 'i18next';
import './table.css';

const titleDir = {
    company: t('company'),
    repo: t('project'),
    actor: t('ID'),
}
const activityColumns = (object,year,month)=>[
    {
        title: t('rank'),
        dataIndex: 'rank',
        width: '5%',
        align: 'center',
        render: Trophy,
        fixed: 'left',
    },
    ...object=='actor'?
    [{
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
    }]:[],
    {
        title: '',
        dataIndex: 'rankDelta',
        render: ArrowRender,
        align:'left',
        width: '5%',
        fixed: 'left',
    },
    {
        title: t(object),
        dataIndex: 'name',
        align:'center',
        width: '20%',
        render: function (text, row, index) {
            if (object !== 'company') {
                return (
                    <a href={"https://github.com/"+text} target="_blank">{text}</a>
                )
            } else {
               return text
            }
        }
    },
    ...object=='repo'?
        [{
            title: t('大屏'),
            dataIndex: 'name',
            align:'center',
            width: '20%',
            //根据行号判断，前300的项目可点击大屏
            render: function (text, row, index) {
                console.log('andy',row);
                let [org_name,repo_name]=text.split("/");
                console.log(year);
                console.log(month);
                let myyear=year;
                let mymonth=month;
                switch (mymonth) {
                    case 0:
                    {
                        myyear--;
                        mymonth='12';
                        break;
                    }
                    case 10:
                    {
                        mymonth='10';
                        break;
                    }
                    case 11:
                    {
                        mymonth = '11';
                        break;
                    }
                    default:
                        mymonth='0'+month;
                        break
                }
                console.log(myyear);
                console.log(mymonth);
                let param='{\"org_name\":\"'+org_name+'\",\"repo_name\":\"'+repo_name+'\",\"t_month\":\"'+myyear+'-'+mymonth+'-01\"}';
                console.log(param);
                param=window.btoa(param);
                console.log(param);
                return <a href={"http://dataease.nzcer.cn/link/LeMILNSw?attachParams="+param} target="_blank">{repo_name}大屏看板</a>
            }
        }]:[],
    {
        title: t('activity'),
        dataIndex: 'value',
        align:'right',
        width: '20%',
    },
    {
        title:'',
        dataIndex:'valueDelta',
        width:'10%',
        align:'left',
        render: PointRender,
    }
];
const activityDetailColumns = (object)=>[
    {
        title: t('rank'),
        dataIndex: 'rank',
        width: '5%',
        align: 'center',
        render: Trophy,
        fixed: 'left',
    },
    ...object=='actor'?
    [{
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
    }]:[],
    {
        title: '',
        dataIndex: 'rankDelta',
        render: ArrowRender,
        align:'left',
        width: '5%',
        fixed: 'left',
    },
    {
        title: t(object),
        dataIndex: 'name',
        align:'center',
        width: '5%',
        render: function (text, row, index) {
            if (object !== 'company') {
                return (
                    <a href={"https://github.com/"+text} target="_blank">{text}</a>
                )
            } else {
               return text
            }
        }
    },
    ...object=='repo'?
        [{
            title: t('大屏'),
            dataIndex: 'name',
            align:'center',
            width: '20%',
            //根据行号判断，前300的项目可点击大屏
            render: function (text, row, index) {
                console.log('andy',text,row,index);
                let [org_name,repo_name]=row.name.split("/");
                console.log(org_name);
                console.log(repo_name);
                return <a>hello</a>
            }
        }]:[],
    {
        title: t('activity'),
        dataIndex: 'value',
        align:'right',
        width: '10%',
    },
    {
        title:'',
        dataIndex:'valueDelta',
        width:'10%',
        align:'left',
        render: PointRender,
    },
    {
        title: t('issue_comments'),
        dataIndex:'issue_comment',
        width:'10%',
        align:'center',
    },
    {
        title: t('open_issues'),
        dataIndex:'open_issue',
        width:'10%',
        align:'center',
    },
    {
        title: t('open_pulls'),
        dataIndex:'open_pull',
        width:'10%',
        align:'center',
    },
    {
        title: t('merge_pulls'),
        dataIndex:'merged_pull',
        width:'10%',
        align:'center',
    },
    {
        title: t('pr_reviews'),
        dataIndex:'review_comment',
        width:'10%',
        align:'center',
    },
];
const open_rankColumns = (object)=>[
    {
        title: t('rank'),
        dataIndex: 'rank',
        width: '5%',
        render: Trophy,
        align: 'center',
        fixed: 'left',
    },
    ...object=='actor'?
    [{
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
    }]:[],
    {
        title: '',
        dataIndex: 'rankDelta',
        render: ArrowRender,
        align:'left',
        width: '5%',
        fixed: 'left',
    },
    {
        title: t(object),
        dataIndex: 'name',
        width: '5%',
        align:'center',
        render: function (text, row, index) {
            if (object !== 'company') {
                return (
                    <a href={"https://github.com/"+text} target="_blank">{text}</a>
                )
            } else {
               return text
            }
        }
    },
    ...object=='repo'?
        [{
            title: t('大屏'),
            dataIndex: 'name',
            align:'center',
            width: '20%',
            //根据行号判断，前300的项目可点击大屏
            render: function (text, row, index) {
                console.log('andy',row);
                let [org_name,repo_name]=row.name.split("/");
                console.log(org_name);
                console.log(repo_name);
                return <a>hello</a>
            }
        }]:[],
    {
        title: t('influence'),
        dataIndex: 'value',
        width: '20%',
        align:'right',
        render:(text, row, index)=>{
            return RoundFloat(text)
        }
    },
    {
        title:'',
        dataIndex:'valueDelta',
        width:'10%',
        align: 'left',
        render: (text, row, index)=>{
            text = RoundFloat(text)
            return PointRender(text, row, index)
        },
    }
];
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

function MyTable(props){
    const [state, setState] = useState({
        object:'company',
        index:'activity',
        region:'chinese',
        //columns: activityColumns('company'),
        showDetail:false,
        hasDetail:true,
        data: [],
        showSize: 25,
        loading: true,
        url: '',// base + index + object + region + yearmonth + .json
        base: "https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_leaderboard/",
        year: null,// 字符串格式
        month: null,// 整数格式，0表示1月，1表示2月..., null for year type time
        type: 'month',
    });

    // 请求一次数据更新表格。如果还没读取好配置文件则不请求数据。
    useEffect(()=>{
        if(props.year==null && props.month==null){
            console.log('the first loading');
            return;
        }
        updateDate({
            year: String(props.year),
            month:props.month
        });
    },[props]);

    const expandData = ()=>{
        setState({
            ...state,
            showSize: state.showSize + 25,
        })
    }
    
    const updateDate = (newstate) => {
        console.log('table update',newstate);
        // 先获取原先的表格属性
        let { base, object, index, region, month, year, columns, showDetail, hasDetail, type } = state;
        // 然后把表格改为加载中的状态
        setState({...state,...newstate,loading: true});
        // 如果 newstate 有对应的属性，则进行更新
        if(newstate.hasOwnProperty('object')) object = newstate.object;
        if(newstate.hasOwnProperty('index')) index = newstate.index;
        if(newstate.hasOwnProperty('region')) region = newstate.region;
        if(newstate.hasOwnProperty('month')) month = newstate.month;
        if(newstate.hasOwnProperty('year')) year = newstate.year;
        if(newstate.hasOwnProperty('showDetail')) showDetail = newstate.showDetail;
        if(newstate.hasOwnProperty('type')) type = newstate.type;
        // 根据 index 和 showDetail 改变表格的 columns 格式
        if(index=='activity'){
            columns = activityColumns(object,newstate.year,newstate.month);
            hasDetail = true;
        }
        if(index=='activity' && showDetail == true){
            columns = activityDetailColumns(object,newstate.year,newstate.month)
            hasDetail =  true;
        }
        if(index=='open_rank'){
            columns = open_rankColumns(object,newstate.year,newstate.month);
            hasDetail = false;
            showDetail = false;
        }
        // 如果是年份数据，则把 month 置为 null。
        // TODO：待验证，如果从年份数据切换到月份数据，似乎会自动回到原来 month 值？
        if(type == 'year'){
            month = null;
        }
        // 以当前的属性构造请求 url
        let url = base + index + '/' + object + '/' + region + '/';
        if(month===null){
            url += year + '.json';
        }
        else{
            url += year + (1+month)+ '.json';
        }
        console.log(url);
        // fetch 异步请求
        fetch(url)
        .then(res => {
            // Todo：最好的情况是在日期选择器中，只显示可以查询的日期，
            if(res.status==404){
                message.warning('No relevant results yet');
                return '';
            }
            return res.json();
        })
        .then(data => {
            data = data.data;
            let dataSource = [];
            // 预处理数据，对新上榜单数据进行特殊标记处理
            data.map((obj)=>{
                obj = expandObject(obj);
                if(obj.rankDelta==0 && obj.value == obj.valueDelta){
                    obj.rankDelta = -10000000;
                    obj.valueDelta = 0;
                }
                dataSource.push(obj);
            });
            console.log(dataSource);

            // 更新属性和表格数据
            setState({
                ...state,
                ...newstate,
                loading: false,
                columns: columns,
                showDetail: showDetail,
                hasDetail: hasDetail,
                data: dataSource,
            });
        })
        .catch(err => {
            console.log('hi!' + err);
            setState({
                ...state,
                ...newstate,
                loading: false,
                columns:columns,
                data: [],
            });
        })
    };
    const {object, index, region, data, columns, loading, showSize, showDetail, hasDetail, month, year, type} = state;
    return (
        <div className='table'>
            <div className='table-content'>
                <Card style={{
                    width:'100%',
                    background: '#FFFFFF',
                    boxShadow:'0px 15px 20px 15px #F7F7FF',
                }}>
                    <TablePanel 
                        type={type} 
                        setState={updateDate} 
                        object={object} 
                        index={index} 
                        region={region} 
                        hasDetail={hasDetail} 
                        showDetail={showDetail} 
                        month={month} year={year}
                    />
                    <Table
                        // Todo
                        // scroll={{ x: 1500, y: 300 }}
                        columns={columns}
                        rowKey={record => record.rank}
                        dataSource={data.slice(0,Math.min(showSize,data.length))}
                        pagination={false}
                        loading={loading}
                        scroll={{x:'max-content'}}
                    />
                    <Row style={{marginTop:'10px'}} >
                        <Col span={12}>
                            <Row justify='start'>
                                <Col>
                                    {  
                                        showSize<data.length?
                                        <a style={{
                                            color:'#FFCC19',
                                            fontSize:'18px',}}
                                            onClick={expandData}>
                                                {t('showMore')+'>>'}
                                        </a>:
                                        <span style={{
                                            color:'gray',
                                            fontSize:'18px',}}>
                                            {t('noMore')}
                                        </span>
                                    }
                                    
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row justify='end'>
                                <Col>
                                    <QAmiss />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div> 
    )
}

export default MyTable;