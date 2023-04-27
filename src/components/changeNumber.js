import { FallOutlined, RiseOutlined } from '@ant-design/icons';

const PointRender = (text) => {
  if (text == 'UNKNOWN') {
    return '';
  }
  if (text == 0) {
    return '';
  } else if (text < 0) {
    return (
      <>
        <FallOutlined style={{ color: 'green' }} />
        {' ' + -1 * text}
      </>
    );
  } else {
    return (
      <>
        <RiseOutlined style={{ color: 'red' }} />
        {' ' + text}
      </>
    );
  }
};
export default PointRender;
