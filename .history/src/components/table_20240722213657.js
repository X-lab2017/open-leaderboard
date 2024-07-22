import React, { useState, useEffect } from 'react';
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


const activityColumns = (object, t_month) => [
  {
    title: t('rank'),
    dataIndex: 'rank',
    width: '5%',
    align: 'center',
    render: Trophy,
    fixed: 'left',
  },
  ...(object == 'actor'
    ? [
      {
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
      },
    ]
    : []),
  {
    title: '',
    dataIndex: 'rankDelta',
    render: ArrowRender,
    align: 'left',
    width: '5%',
    fixed: 'left',
  },
  {
    title: t(object),
    dataIndex: 'name',
    align: 'center',
    width: '20%',
    render: function(text, row, index) {
      if (object !== 'company') {
        return (
          <a
            href={'https://github.com/' + text}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        );
      } else {
        return text;
      }
    },
  },
  ...(object == 'repo'
    ? [
      {
        title: t('insight_board'),
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: function(text, row, index) {
          return dashboard(text, index, t_month);
        },
      },
    ]
    : []),
  {
    title: t('activity'),
    dataIndex: 'value',
    align: 'right',
    width: '20%',
  },
  {
    title: '',
    dataIndex: 'valueDelta',
    width: '10%',
    align: 'left',
    render: PointRender,
  },
];
const activityDetailColumns = (object, t_month) => [
  {
    title: t('rank'),
    dataIndex: 'rank',
    width: '5%',
    align: 'center',
    render: Trophy,
    fixed: 'left',
  },
  ...(object == 'actor'
    ? [
      {
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
      },
    ]
    : []),
  {
    title: '',
    dataIndex: 'rankDelta',
    render: ArrowRender,
    align: 'left',
    width: '5%',
    fixed: 'left',
  },
  {
    title: t(object),
    dataIndex: 'name',
    align: 'center',
    width: '5%',
    render: function(text, row, index) {
      if (object !== 'company') {
        return (
          <a
            href={'https://github.com/' + text}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        );
      } else {
        return text;
      }
    },
  },
  ...(object == 'repo'
    ? [
      {
        title: t('insight_board'),
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: function(text, row, index) {
          return dashboard(text, index, t_month);
        },
      },
    ]
    : []),
  {
    title: t('activity'),
    dataIndex: 'value',
    align: 'center',
    width: '10%',
  },
  {
    title: '',
    dataIndex: 'valueDelta',
    width: '10%',
    align: 'left',
    render: PointRender,
  },
  {
    title: t('issue_comments'),
    dataIndex: 'issue_comment',
    width: '10%',
    align: 'center',
  },
  {
    title: t('open_issues'),
    dataIndex: 'open_issue',
    width: '10%',
    align: 'center',
  },
  {
    title: t('open_pulls'),
    dataIndex: 'open_pull',
    width: '10%',
    align: 'center',
  },
  {
    title: t('merge_pulls'),
    dataIndex: 'merged_pull',
    width: '10%',
    align: 'center',
  },
  {
    title: t('pr_reviews'),
    dataIndex: 'review_comment',
    width: '10%',
    align: 'center',
  },
];
const open_rankColumns = (object, t_month) => [
  {
    // 第一列：排名
    title: t('rank'),
    dataIndex: 'rank',
    width: '5%',
    render: Trophy,
    align: 'center',
    fixed: 'left',
  },
  // 如果 object 是 'actor'，则添加头像列
  ...(object == 'actor'
    ? [
      {
        title: t('avatar'),
        dataIndex: 'id',
        width: '5%',
        align: 'center',
        render: MyAvatar,
        fixed: 'left',
      },
    ]
    : []),
  // 第二列：排名变化
  {
    title: '',
    dataIndex: 'rankDelta',
    render: ArrowRender,
    align: 'left',
    width: '5%',
    fixed: 'left',
  },
  // 第三列：对象名称（可能是 actor, repo 或 company）
  {
    title: t(object),
    dataIndex: 'name',
    width: '20%',
    align: 'center',
    render: function(text) {
      if (object !== 'company') {
        return (
          <a
            href={'https://github.com/' + text}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        );
      } else {
        return text;
      }
    },
  },
  // 如果 object 是 'repo'，则添加 insight_board 列
  ...(object == 'repo'
    ? [
      {
        title: t('insight_board'),
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        render: function(text, row, index) {
          return dashboard(text, index, t_month);
        },
      },
    ]
    : []),
  // 第四列：影响力
  {
    title: t('influence'),
    dataIndex: 'value',
    width: '20%',
    align: 'right',
    render: (text, row, index) => {
      return RoundFloat(text);
    },
  },
  // 第五列：影响力变化
  {
    title: '',
    dataIndex: 'valueDelta',
    width: '10%',
    align: 'left',
    render: (text, row, index) => {
      text = RoundFloat(text);
      return PointRender(text, row, index);
    },
  },
];

const solveDate = (year, month) => {
  if (year === null && month === null) {
    return 'not found';
  }
  if (month === null) {
    return year + '年';
  }
  return year + '年' + (month + 1) + '月';
};

function dashboard(text, index, t_month) {
  if (index < 300) {
    let [org_name, repo_name] = text.split('/');
    const t_month_copy = t_month + ' ' + '00:00:00';
    let params = {
      org_name,
      repo_name,
      t_month_copy,
      t_month,
    };
    return (
      <a
        href={
          'https://dataease.x-lab.info/link/dqMbZrBk?attachParams=' +
          btoa(JSON.stringify(params))
        }
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="dashboard"
          src="/pics/dashboard.png"
          style={{ height: '20px', width: '20px' }}
        />
      </a>
    );
  }
}

function DateTitle(props) {
  return <h1>{solveDate(props.year, props.month)}</h1>;
}

function MyTable(props) {
  const [state, setState] = useState({
    object: 'technology',
    index: 'open_rank',
    region: 'global',
    showDetail: false,
    hasDetail: true,
    data: [],
    showSize: 25,
    loading: true,
    url: '', // base + index + object + region + yearmonth + .json
    base: 'https://oss.x-lab.info/open_leaderboard/',
    year: null, // 字符串格式
    month: null, // 整数格式，0表示1月，1表示2月..., null for year type time
    type: 'month',
    search: null,
    category: 'cloud-native',
  });

  // 请求一次数据更新表格。如果还没读取好配置文件则不请求数据。
  useEffect(() => {
    if (props.year == null && props.month == null) {
      console.log('the first loading');
      return;
    }
    updateDate({
      year: String(props.year),
      month: props.month,
    });
  }, [props]);

  const expandData = () => {
    setState({
      ...state,
      showSize: state.showSize + 25,
    });
  };
  const updateDate = (newstate) => {
    console.log('table update', newstate);
    // 先获取原先的表格属性
    let {
      base,
      object,
      index,
      region,
      month,
      year,
      columns,
      showDetail,
      hasDetail,
      type,
      search,
      category,
    } = state;
    // 然后把表格改为加载中的状态
    setState({ ...state, ...newstate, loading: true });
    // 如果 newstate 有对应的属性，则进行更新
    if (newstate.hasOwnProperty('object')) object = newstate.object;
    if (newstate.hasOwnProperty('index')) index = newstate.index;
    if (newstate.hasOwnProperty('region')) region = newstate.region;
    if (newstate.hasOwnProperty('month')) month = newstate.month;
    if (newstate.hasOwnProperty('year')) year = newstate.year;
    if (newstate.hasOwnProperty('showDetail')) showDetail = newstate.showDetail;
    if (newstate.hasOwnProperty('type')) type = newstate.type;
    if (newstate.hasOwnProperty('search')) search = newstate.search;
    if (newstate.hasOwnProperty('category')) category = newstate.category;

    //获取数据大屏的‘t_month’参数
    let myyear = newstate.year == null ? state.year : newstate.year;
    let mymonth = newstate.month == null ? state.month : newstate.month;

    mymonth = ('' + (1 + mymonth)).padStart(2, '0');
    let t_month = `${myyear}-${mymonth}-01`;

    // 根据 index 和 showDetail 改变表格的 columns 格式
    if (index == 'activity') {
      columns = activityColumns(object, t_month);
      hasDetail = true;
    }
    if (index == 'activity' && showDetail == true) {
      columns = activityDetailColumns(object, t_month);
      hasDetail = true;
    }
    if (index == 'open_rank') {
      columns = open_rankColumns(object, t_month);
      hasDetail = false;
      showDetail = false;
    }
    // 如果是年份数据，则把 month 置为 null。
    // TODO：待验证，如果从年份数据切换到月份数据，似乎会自动回到原来 month 值？
    if (type == 'year') {
      month = null;
    }
    // 以当前的属性构造请求 url
    let url = base + index + '/' + object + '/' + region + '/';
    if (month === null) {
      url += year + '.json';
    } else {
      url += year + (1 + month) + '.json';
    }
    console.log(url);
    console.log(region)
    if (object == 'foundation' && region == 'chinese'){
      let data = new Array();

      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [{
          "rank": "1",
          "name": "apache/doris",
          "value": "4307.26",
          "rankDelta": 1,
          "valueDelta": +100
        },
          {
            "rank": "2",
            "name": "openharmony/docs",
            "value": "3277.69",
            "rankDelta":0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "openharmony/arkui_ace_engine",
            "value": "2818.09",
            "rankDelta": -1,
            "valueDelta": -3
          },
          {
            "rank": "4",
            "name": "milvus-io/milvus",
            "value": "2001.11",
            "rankDelta": 3,
            "valueDelta": -100
          },
          {
            "rank": "5",
            "name": "apache/flink",
            "value": "1816.72",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "apache/shardingsphere",
            "value": "1662.8",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "apache/ozone",
            "value": "1281.57",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "apache/iotdb",
            "value": "1265.72",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "openharmony/graphic_graphic_2d",
            "value": "1239.6",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "apache/pulsar",
            "value": "1227.93",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]};
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object == 'foundation' && region == 'global'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [{
          "rank": "1",
          "name": "kubernetes/kubernetes",
          "value": "5374.14",
          "rankDelta": 0,
          "valueDelta": 0
        },
          {
            "rank": "2",
            "name": "apache/doris",
            "value": "4307.26",
            "rankDelta":2,
            "valueDelta": 3
          },
          {
            "rank": "3",
            "name": "apache/airflow",
            "value": "3642.9",
            "rankDelta": -1,
            "valueDelta": -3
          },
          {
            "rank": "4",
            "name": "openharmony/docs",
            "value": "3277.69",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "openharmony/arkui_ace_engine",
            "value": "2818.09",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "nodejs/node",
            "value": "2736.37",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "apache/spark",
            "value": "2654.02",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "apache/arrow",
            "value": "2219.95",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "apache/beam",
            "value": "2188.52",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "apache/hudi",
            "value": "2124.67",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]};
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'cloud-native'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "grafana/grafana",
            "value": "7134.37",
            "rankDelta": 1,
            "valueDelta": 100
          },
          {
            "rank": "2",
            "name": "llvm/llvm-project",
            "value": "7049.62",
            "rankDelta": -2,
            "valueDelta": -220
          },
          {
            "rank": "3",
            "name": "kubernetes/kubernetes",
            "value": "5374.14",
            "rankDelta": 3,
            "valueDelta": 300
          },
          {
            "rank": "4",
            "name": "ClickHouse/ClickHouse",
            "value": "4941.99",
            "rankDelta": -4,
            "valueDelta": 400
          },
          {
            "rank": "5",
            "name": "cilium/cilium",
            "value": "3215.42",
            "rankDelta": 5,
            "valueDelta": -500
          },
          {
            "rank": "6",
            "name": "ceph/ceph",
            "value": "3172.49",
            "rankDelta": -6,
            "valueDelta": 600
          },
          {
            "rank": "7",
            "name": "keycloak/keycloak",
            "value": "3095.56",
            "rankDelta": 7,
            "valueDelta": 700
          },
          {
            "rank": "8",
            "name": "gravitational/teleport",
            "value": "3082.18",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "envoyproxy/envoy",
            "value": "2929.08",
            "rankDelta": 9,
            "valueDelta": -900
          },
          {
            "rank": "10",
            "name": "backstage/backstage",
            "value": "2903.39",
            "rankDelta": 10,
            "valueDelta": 100
          }
        ]
        };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'ai'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "pytorch/pytorch",
            "value": "10182.45",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "2",
            "name": "langchain-ai/langchain",
            "value": "6080.25",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "PaddlePaddle/Paddle",
            "value": "5408.62",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "4",
            "name": "huggingface/transformers",
            "value": "4422.84",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "AUTOMATIC1111/stable-diffusion-webui",
            "value": "3881.6",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "openvinotoolkit/openvino",
            "value": "3857.31",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "microsoft/onnxruntime",
            "value": "3006.75",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "tensorflow/tensorflow",
            "value": "2723.26",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "Significant-Gravitas/AutoGPT",
            "value": "2664.85",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "ggerganov/llama.cpp",
            "value": "2339.8",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]
        
      };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'big-data'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "elastic/kibana",
            "value": "7601.04",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "2",
            "name": "grafana/grafana",
            "value": "7134.37",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "ClickHouse/ClickHouse",
            "value": "4941.99",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "4",
            "name": "airbytehq/airbyte",
            "value": "4658.86",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "apache/doris",
            "value": "4307.26",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "elastic/elasticsearch",
            "value": "3729.39",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "apache/airflow",
            "value": "3642.9",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "StarRocks/starrocks",
            "value": "3194.56",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "trinodb/trino",
            "value": "2703.4",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "apache/spark",
            "value": "2654.02",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]
        };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'database'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "ClickHouse/ClickHouse",
            "value": "4941.99",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "2",
            "name": "apache/doris",
            "value": "4307.26",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "elastic/elasticsearch",
            "value": "3729.39",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "4",
            "name": "cockroachdb/cockroach",
            "value": "3443.7",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "StarRocks/starrocks",
            "value": "3194.56",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "trinodb/trino",
            "value": "2703.4",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "apache/spark",
            "value": "2654.02",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "pingcap/tidb",
            "value": "2200.38",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "milvus-io/milvus",
            "value": "2001.11",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "yugabyte/yugabyte-db",
            "value": "1940.75",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]
        };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'front-end'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "flutter/flutter",
            "value": "9361.81",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "2",
            "name": "vercel/next.js",
            "value": "6638.65",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "appsmithorg/appsmith",
            "value": "3474.07",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "4",
            "name": "nuxt/nuxt",
            "value": "3387.23",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "facebook/react-native",
            "value": "3260.55",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "ant-design/ant-design",
            "value": "3053.25",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "nodejs/node",
            "value": "2736.37",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "angular/angular",
            "value": "2273.82",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "electron/electron",
            "value": "1773.31",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "denoland/deno",
            "value": "1654.01",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]
        };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
    else if (object== 'technology' && category == 'os'){
      let data = new Array();
      // 预处理数据，对新上榜单数据进行特殊标记处理
      data = {
        "type": "Foundation_China",
        "time": "2024",
        "data": [
          {
            "rank": "1",
            "name": "openharmony/docs",
            "value": "3277.69",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "2",
            "name": "openharmony/arkui_ace_engine",
            "value": "2818.09",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "3",
            "name": "SerenityOS/serenity",
            "value": "2257.68",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "4",
            "name": "openharmony/graphic_graphic_2d",
            "value": "1239.6",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "5",
            "name": "openeuler/docs",
            "value": "1206.9",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "6",
            "name": "openharmony/xts_acts",
            "value": "1186.06",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "7",
            "name": "openharmony/arkcompiler_ets_runtime",
            "value": "961.99",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "8",
            "name": "openharmony/interface_sdk-js",
            "value": "910.91",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "9",
            "name": "reactos/reactos",
            "value": "745.23",
            "rankDelta": 0,
            "valueDelta": 0
          },
          {
            "rank": "10",
            "name": "armbian/build",
            "value": "679.1",
            "rankDelta": 0,
            "valueDelta": 0
          }
        ]
        };
      data = data.data;
      let dataSource = [];
      data.map((obj) => {
        obj = expandObject(obj);
        if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
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
    }
else {
      // fetch 异步请求
      fetch(url)
          .then((res) => {
            // Todo：最好的情况是在日期选择器中，只显示可以查询的日期，
            if (res.status == 404) {
              message.warning(t('no_result'));
              return '';
            }
            return res.json();
          })
          .then((data) => {
            data = data.data;
            let dataSource = [];
            // 预处理数据，对新上榜单数据进行特殊标记处理
            data.map((obj) => {
              obj = expandObject(obj);
              if (obj.rankDelta == 0 && obj.value == obj.valueDelta) {
                obj.rankDelta = -10000000;
                obj.valueDelta = 0;
              }
              dataSource.push(obj);
            });
            console.log(dataSource);

            //搜索特定数据
            let queryData;
            if (search) {
              queryData = dataSource.filter((dataSource) => {
                let reg = new RegExp(search.trim(), 'i');
                return reg.test(dataSource.name);
              });
              if (queryData.length == 0) {
                message.warning(t('no_result'));
              } else {
                dataSource = queryData;
              }
            }

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
          .catch((err) => {
            console.log('hi!' + err);
            setState({
              ...state,
              ...newstate,
              loading: false,
              columns: columns,
              data: [],
            });
          });
    };
    }

  const {
    object,
    index,
    region,
    data,
    columns,
    loading,
    showSize,
    showDetail,
    hasDetail,
    month,
    year,
    type,
    category,
  } = state;
  return (
    <div className="table">
      <div className="table-content">
        <Card
          style={{
            width: '100%',
            background: '#FFFFFF',
            boxShadow: '0px 15px 20px 15px #F7F7FF',
          }}
        >
          <TablePanel
            type={type}
            setState={updateDate}
            object={object}
            index={index}
            region={region}
            hasDetail={hasDetail}
            showDetail={showDetail}
            month={month}
            year={year}
            category={category}
          />
          <Table
            // Todo
            // scroll={{ x: 1500, y: 300 }}
            columns={columns}
            rowKey={(record) => record.rank}
            dataSource={data.slice(0, Math.min(showSize, data.length))}
            pagination={false}
            loading={loading}
            scroll={{ x: 'max-content' }}
          />
          <Row style={{ marginTop: '10px' }}>
            <Col span={12}>
              <Row justify="start">
                <Col>
                  {showSize < data.length ? (
                    <a
                      style={{
                        color: '#FFCC19',
                        fontSize: '18px',
                      }}
                      onClick={expandData}
                    >
                      {t('showMore') + '>>'}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: 'gray',
                        fontSize: '18px',
                      }}
                    >
                      {t('noMore')}
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row justify="end">
                <Col>
                  <QAmiss />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default MyTable;
