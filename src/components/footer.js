import { Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Image } from 'antd';
import { t } from 'i18next';
const { Footer } = Layout;

function MyFooter(props) {
  return (
    <Footer style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
      <div style={{ paddingTop: '20px' }}>
        <Row>
          <Col style={{ textAlign: 'center' }} span={8}>
            <h1 className="myFontColor subTitle">
              {t('footer.data_power_by')}
            </h1>
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <h1 className="myFontColor subTitle">{t('footer.supported_by')}</h1>
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <h1 className="myFontColor subTitle">{t('footer.sponsor')}</h1>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            span={8}
          >
            <a
              href="https://github.com/X-lab2017/open-digger"
              target={'_blank'}
            >
              <img
                src="/pics/OD.png"
                style={{ height: '80px', width: '80px' }}
              />
              <span style={{ marginLeft: '5px', fontSize: '18px' }}>
                OpenDigger
              </span>
            </a>
          </Col>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            span={8}
          >
            <img
              src="/pics/GitHub.png"
              style={{ width: '60px', height: '60px' }}
            />
          </Col>
          <Col style={{ textAlign: 'center' }} span={8}>
            <span style={{ fontSize: '18px', width: '100%' }}>
              <a href="https://www.fit2cloud.com/dataease" target={'_blank'}>
                <img
                  src="/pics/DataEase.png"
                  style={{ width: '225px', height: '58px' }}
                />
              </a>
            </span>
          </Col>
        </Row>
        <Row align="middle" justify="center" style={{ marginTop: '20px' }}>
          <Col>
            <span>Copyright ©2022 X-lab </span>
          </Col>
        </Row>
      </div>
    </Footer>
  );
}

export default MyFooter;
