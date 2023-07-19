import React from 'react';
import styled from '@emotion/styled';
import { media } from '../../mq';

interface IntroContainerProps {
  children: React.ReactNode;
}

const IntroContainer = ({ children }: IntroContainerProps) => {
  return (
    <Background>
      <Container>
        <InnerContainer>
          <Content>{children}</Content>
        </InnerContainer>
      </Container>
    </Background>
  );
};

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(40, 42, 43, 0.7);
  height: 100%;
`;

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const InnerContainer = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 0 3rem;
  margin: auto;

  ${media.mobile`
    display: block;
    height: auto;
    width: 100%;
    padding: 0;
  `}
`;

const Content = styled.div`
  width: 100%;
  flex: 1;
  box-shadow: 0px 10px 10px 0px rgba(40, 42, 43, 1);
`;

export default IntroContainer;
