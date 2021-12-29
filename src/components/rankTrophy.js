import {
    TrophyOutlined
}from '@ant-design/icons';

const Trophy = (text, row, index)=>{
    if(text==1){
        return <TrophyOutlined style={{color:'gold',fontSize:'23px'}}/>
    }
    if(text==2){
        return <TrophyOutlined style={{color:'silver',fontSize:'18px'}}/>
    }
    if(text==3){
        return <TrophyOutlined style={{color:'brown',fontSize:'15px'}}/>
    }
    
    return text;
}

export default Trophy;