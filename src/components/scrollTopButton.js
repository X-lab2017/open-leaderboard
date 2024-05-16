import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
function scrollToTop(timestamp) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}
const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          style={{
            position: 'fixed',
            zIndex: 2147483640,
            right: '22px',
            bottom: '60px',
            backgroundColor: '#FFCC19',
            borderColor: '#FFCC19',
          }}
          type="primary"
          icon={<VerticalAlignTopOutlined />}
          onClick={scrollToTop}
        />
      )}
    </>
  );
};

export default ScrollTopButton;