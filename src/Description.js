import {Row, Col, Image, Divider} from 'antd';
import { useTranslation } from 'react-i18next';

const Description = () => {
    const {t} = useTranslation();
    return (
        <Row style={{marginTop:50}}>
            <Col xs={{offset:2,span:20}} sm={16} md={13} lg={12} xl={10} xxl={8}  >
                <span className='myFontColor'>
                {t('introduction')}
                </span>
            </Col>
            <Col xs={{offset:2,span:20}} sm={16} md={13} lg={12} xl={10} xxl={8}>
                <Row>
                    <Col>
                        <Image
                            style={{paddingRight:'20px'}}
                            preview={false} 
                            src='/pics/Ellipse BG.png'/>
                        <span className='myFontColor'>
                            {t('updateTime')}
                        </span>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col>
                    <span className='myFontColor'>
                        {t('analysisConclusion')}
                    </span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Description;