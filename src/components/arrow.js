import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

const ArrowRender = (text) => {
  if (text == 'UNKNOWN') {
    return '';
  }
  if (text == -10000000) {
    return <span className="specialColor">new</span>;
  } else if (text == 0) {
    return <span style={{ textAlign: 'center' }}> - </span>;
  } else if (text < 0) {
    return (
      <>
        <ArrowDownOutlined style={{ color: 'green' }} />
        {-1 * text}
      </>
    );
  } else {
    return (
      <>
        <ArrowUpOutlined style={{ color: 'red' }} />
        {text}
      </>
    );
  }
};
export default ArrowRender;
