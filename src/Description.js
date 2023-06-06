import { Row, Col } from 'antd';
import { t } from 'i18next';

const Description = (props) => {
  // const {t} = useTranslation();
  return (
    <>
      <Row
        align="middle"
        justify="center"
        style={{ margin: '50px auto', lineHeight: '1.2' }}
      >
        <Col>
          <span
            className="myFontColor myTitle"
            style={{ margin: '0 auto', textAlign: 'center' }}
          >
            {t('desc.intro')}
          </span>
          <span
            className="specialColor myTitle"
            style={{ margin: '0 auto', textAlign: 'center' }}
          >
            {t('desc.opensource')}
          </span>
        </Col>
      </Row>
      <Row style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Col>
          <span className="myFontColor" style={{ margin: '0 auto' }}>
            {t('desc.content')}
          </span>
        </Col>
      </Row>
      <Row style={{ maxWidth: '1000px', margin: '20px auto' }} gutter={4}>
        <Col>
          <img src="/pics/Ellipse BG.png" alt="Ellipse" />
        </Col>
        <Col>
          <span className="myFontColor">
            {props.lastUpdateTime == null
              ? t('waitforupdate')
              : t('desc.date', {
                  val: props.lastUpdateTime,
                  formatParams: {
                    val: { year: 'numeric', month: 'long', day: 'numeric' },
                  },
                })}
          </span>
        </Col>
      </Row>
    </>
  );
};

export default Description;
