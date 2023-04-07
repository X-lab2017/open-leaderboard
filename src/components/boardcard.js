import React from "react";
import {Card} from 'antd';
import { t } from 'i18next';

const BoardCard=({boardtitle,boardUrl})=>{
    let imageUrl=`/pics/Dashboard_pics/${boardtitle}.png`;
    return(
        <Card className="board-card"
              bordered={true}
              style={{
                  width: 850,
                  height:640
              }}
        >
            <img alt="example" src={imageUrl} style={{ maxWidth: '100%', maxHeight: '100%' }}/>
            <br></br>
            <br></br>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: '1 1 auto', marginRight: '10px' }}>
                    <h2>{t(`boardtitle.${boardtitle}`)}</h2>
                </div>
                <div style={{ flex: '0 0 auto' }}>
                    <a
                        href={boardUrl}
                        target={'_blank'}
                        style={{ fontSize: '16px' }}>
                        查看详情
                    </a>
                </div>
            </div>
            <p>{t(`boardcontent.${boardtitle}`)}</p>
        </Card>
    )
}

export default BoardCard;