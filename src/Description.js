import {Row, Col, Image, Divider} from 'antd';

const Description = () => {
    return (
        <Row style={{ marginTop: '200px' }}>
            <Col span={5} offset={4} >
                <span className='myFontColor'>
                欢迎来到 OpenInsight-Index，我们对 Github 上国内的企业、项目以及机器人账号进行了活跃度和影响力的排名。（Github 是全球最大的社交编程及代码托管网站。）
                </span>
            </Col>
            <Col span={9} offset={2}>
                <Row>
                    <Col>
                        <Image
                            style={{paddingRight:'20px'}}
                            preview={false} 
                            src='/pics/Ellipse BG.png'/>
                        <span className='myFontColor'>2021 年 11 月 10 日更新</span>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col>
                    <p className='myFontColor'>欢迎来到 OpenInsight，我们对 GitHub 上国内的企业、项目及机器人账号进行了活跃度和影响力的排名</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Description;