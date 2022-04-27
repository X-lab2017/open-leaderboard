import {Row, Col, Image, Divider, Space} from 'antd';
import { useTranslation } from 'react-i18next';

const Description = (props) => {
    const {t} = useTranslation();
    return (
        <>
            <Row align='middle' justify='center' style={{margin:'50px auto',lineHeight:'1.2'}}>
                <Col>
                    <span className='myFontColor myTitle' style={{margin:'0 auto',textAlign:'center'}}>
                        An insight to the world of 
                    </span>
                    <span className='specialColor myTitle' style={{margin:'0 auto',textAlign:'center'}}>
                        {' '}open source
                    </span>
                </Col>
            </Row>
            <Row style={{maxWidth:'1000px',margin:'0 auto'}}>
                <Col>
                    <span className='myFontColor' style={{margin:'0 auto'}}>
                        欢迎来到 OpenLeaderboard，我们对 GitHub 上的企业、项目以及开发者账号进行了活跃度和影响力的排名。
                        （GitHub 是全球最大的社交编程及代码托管网站。）
                    </span>
                </Col>
            </Row>
            <Row style={{maxWidth:'1000px',margin:'20px auto'}} gutter={4}>
                <Col>
                    <img src='/pics/Ellipse BG.png'/>
                </Col>
                <Col>
                    <span className='myFontColor'>
                        {
                            (props.year==null||props.month==null)?
                            "加载中":
                            props.year+" 年 "+(props.month+1)+" 月更新"
                        
                        }
                    </span>
                </Col>
                
            </Row>
        </>
    )
}

export default Description;