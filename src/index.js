import ReactDOM from 'react-dom'
import React, {useState, useEffect}from 'react';
import { Row, Col, Layout, Image, ConfigProvider } from 'antd';
import 'antd/dist/antd.css'
import Description from './Description';
import MyFooter from './components/footer';
import MyHeader from './components/header';
import MyTable from './components/table';
import './index.css'
import { useTranslation } from 'react-i18next';
import ScrollTopButton from './components/scrollTopButton';
const { Content } = Layout;

const META_URL = "https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_leaderboard/meta.json";
const getLastMonth = (year, month)=>{
    month--;
    if(month<0){
        month+=12;
        year--;
    }
    return [year, month];
}

const App = () => {
    const [date, setDate] = useState({year:null, month:null});
    const {t} = useTranslation();

    useEffect(()=>{
        fetch(META_URL)
        .then(res=>res.json())
        .then(data=>{
            const date = new Date(data.lastUpdatedAt);
            let yy = date.getFullYear(), mm = date.getMonth();
            [yy, mm] = getLastMonth(yy, mm);
            setDate({year:''+yy,month:mm});
            console.log("index effect: done!", yy,mm);
        })
    }, []);

    const { year, month }= date;
    return(
        <ConfigProvider>
            <Layout className='layout' style={{backgroundColor:'rgba(0,0,0,0)',minWidth:'320px'}}>
                <Image preview={false} style={{zIndex:-1,position:'absolute',top:0}} width={'100%'} src="/pics/Header BG.png"/>
                <ScrollTopButton />
                <MyHeader/>
                <Content className='container'>
                    <Description year={year} month={month}/>
                </Content>
                <MyTable t={t} year={year} month={month}/>
                <MyFooter />
                <Image style={{
                        zIndex:-2,
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

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);