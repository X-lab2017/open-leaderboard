import {Row, Col, Image, Divider} from 'antd';
import { useTranslation } from 'react-i18next';

const Description = () => {
    const {t} = useTranslation();
    return (
        <Row style={{ marginTop: '200px' }}>
            <Col span={5} >
                <span className='myFontColor'>
                {t('introduction')}
                </span>
            </Col>
            <Col span={9} offset={2}>
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