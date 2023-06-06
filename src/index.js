import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { Layout, Image, ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import Description from './Description';
import MyFooter from './components/footer';
import MyHeader from './components/header';
import MyTable from './components/table';
import './index.css';
import { useTranslation } from 'react-i18next';
import ScrollTopButton from './components/scrollTopButton';
import { DATA_READY_DAY } from './constant';
const { Content } = Layout;

const META_URL =
  'https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_leaderboard/meta.json';

const getLastMonth = (lastUpdateTime) => {
  let year = lastUpdateTime.getFullYear();
  let monthIndex = lastUpdateTime.getMonth();
  let date = lastUpdateTime.getDate();

  if (date < 20) {
    monthIndex--;
  }

  if (monthIndex < 0) {
    monthIndex += 12;
    year--;
  }
  return [year, monthIndex];
};

const App = () => {
  const NODE_ENV = process.env.NODE_ENV;
  if (NODE_ENV !== 'development') {
    console.log = function () {};
  }
  let [lastUpdateTime, setLastUpdateTime] = useState(null);
  const CurrentDate = new Date();
  const { t } = useTranslation();

  useEffect(() => {
    fetch(META_URL)
      .then((res) => res.json())
      .then((data) => {
        const date = new Date(data.lastUpdatedAt);
        setLastUpdateTime(date);
      });
  }, []);

  let year = null,
    monthIndex = null;
  if (lastUpdateTime) {
    [year, monthIndex] = getLastMonth(lastUpdateTime);
  }
  if (CurrentDate.getDate() < DATA_READY_DAY) {
    lastUpdateTime = null;
  }

  return (
    <ConfigProvider>
      <Layout
        className="layout"
        style={{ backgroundColor: 'rgba(0,0,0,0)', minWidth: '320px' }}
      >
        <Image
          preview={false}
          style={{ zIndex: -1, position: 'absolute', top: 0 }}
          width={'100%'}
          src="/pics/Header BG.png"
        />
        <ScrollTopButton />
        <MyHeader />
        <Content className="container">
          <Description lastUpdateTime={lastUpdateTime} />
        </Content>
        <MyTable t={t} year={year} month={monthIndex} />
        <MyFooter />
        <Image
          style={{
            zIndex: -2,
            position: 'absolute',
            height: '2000px',
            bottom: '0px',
          }}
          preview={false}
          src="/pics/Bubble BG.png"
        />
      </Layout>
    </ConfigProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
