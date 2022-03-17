import {Row, Col, Image, Divider} from 'antd';
import { useTranslation } from 'react-i18next';

const Description = () => {
    const {t} = useTranslation();
    return (
        <>
            <Row style={{marginTop:50,minHeight:'100px'}} align='middle' justify='center' gutter={10}>
                <Col>
                    <span className='myFontColor myTitle'>
                        An insight to the world of 
                    </span>
                </Col>
                <Col>
                    <span className='specialColor myTitle'>
                        open source
                    </span>
                </Col>
            </Row>
            <Row style={{minHeight:'100px'}} align='middle' justify='center'>
                <Col span={12}>
                    <span className='myFontColor'>
                    欢迎来到 open leaderboard，我们对 GitHub 上的企业、项目以及开发者账号进行了活跃度和影响力的排名。
                    （GitHub 是全球最大的社交编程及代码托管网站。）
                    </span>
                </Col>
            </Row>
            <Row style={{minHeight:'100px'}} align='middle' justify='center' gutter={10}>
                <Col span={12}>
                    <Row gutter={10}>
                        <Col>
                            <img src='/pics/Ellipse BG.png'/>
                        </Col>
                        <Col>
                            <span className='myFontColor'>
                                2022 年 2 月更新
                            </span>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Description;