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
const { Content } = Layout;

const META_URL =
  'https://xlab-open-source.oss-cn-beijing.aliyuncs.com/open_leaderboard/meta.json';

const App = () => {
  const NODE_ENV = process.env.NODE_ENV;
  if (NODE_ENV !== 'development') {
    console.log = function () {};
  }
  let [lastUpdateTime, setLastUpdateTime] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(META_URL)
      .then((res) => res.json())
      .then((data) => {
        let date = new Date(data.lastUpdatedAt);
        setLastUpdateTime(date);
      });
  }, []);

  let year = null,
    monthIndex = null;
  if (lastUpdateTime) {
    const lastDataAvailableMonth = new Date(lastUpdateTime);
    lastDataAvailableMonth.setDate(0);
    year = lastDataAvailableMonth.getFullYear();
    monthIndex = lastDataAvailableMonth.getMonth();
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
