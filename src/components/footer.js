import { Col, Row } from 'antd';
import 'antd/dist/antd.css';
import { Layout, Image } from 'antd';
import { t } from 'i18next';
const { Footer } = Layout;

function MyFooter(props){
    return (
        <Footer style={{backgroundColor:'rgba(0,0,0,0)'}}>
            <div>
                <Row align='middle' justify='center'>
                    <Col>
                        <h1 className='myFontColor subTitle'>{t('footer.data_power_by')}</h1>
                    </Col>
                </Row>
                <Row align='middle' justify='center' gutter={20} style={{minHeight:'100px'}}>
                    <Col>
                        <a href='https://github.com/X-lab2017/open-digger' target={'_blank'}>
                            <img src='/pics/OD.png' style={{height:'80px',width:'80px'}}/>
                            <span style={{marginLeft:'5px',fontSize:'18px'}}>OpenDigger</span>
                        </a>
                    </Col>
                </Row>
                <Row align='middle' justify='center'>
                    <Col>
                        <h1 className='myFontColor subTitle'>{t('footer.supported_by')}</h1>
                    </Col>
                </Row>
                <Row align='middle' justify='center'  style={{minHeight:'100px'}}>
                    <Col>
                        {/* 等 GitHub 官方确认后添加 Logo */}
                        {/* <span style={{width:'60px',height:'60px'}}></span> */}
                        <img src='/pics/GitHub.png' style={{width:'60px',height:'60px'}} />
                    </Col>
                </Row>
                <Row align='middle' justify='center'>
                    <Col>
                        <h1 className='myFontColor subTitle'>{t('footer.sponsor')}</h1>
                    </Col>
                </Row>
                <Row align='middle' justify='center' style={{minHeight:'50px'}}>
                    <Col>
                        <span style={{fontSize:'18px',width:'100%'}}>{t('footer.sponsor_info')}</span>
                    </Col>
                </Row>
                <Row align='middle' justify='center' style={{marginTop:'50px'}}>
                    <Col>
                        <span>Copyright ©2022 X-lab </span>
                    </Col>
                </Row>
                {/* 有官方 Logo 的话，这个先不放吧 */}
                {/* <Row align='middle' justify='center'>
                    <Col>
                        <a href='https://github.com/X-lab2017/open-leaderboard' target={'_blank'}><img src='/pics/GitHub.png' style={{width:'30px',height:'30px'}} /></a>
                    </Col>
                </Row> */}
            </div>
        </Footer>
    );
}

export default MyFooter;