import {
    TrophyOutlined
}from '@ant-design/icons';

const Trophy = (text, row, index)=>{
    if(text==1){
        return <TrophyOutlined style={{color:'gold'}}/>
    }
    return text;
}

export default Trophy;