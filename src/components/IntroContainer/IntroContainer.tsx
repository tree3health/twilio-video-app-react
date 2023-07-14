import React from 'react';
import styled from '@emotion/styled';

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
  background: rgb(40, 42, 43);
  height: 100%;
`;

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const InnerContainer = styled.div`
  display: flex;
  box-shadow: 0px 2px 4px 0px rgba(40, 42, 43, 0.3);
  overflow: hidden;
  position: relative;
  padding: 0 5rem;
  margin: auto;

  @media (max-width: 600px) {
    display: block;
    height: auto;
    width: calc(100% - 40px);
    margin: auto;
    max-width: 400px;
  }
`;

const Content = styled.div`
  background: white;
  width: 100%;
  padding: 4em;
  flex: 1;

  @media (max-width: 600px) {
    padding: 2em;
  }
`;

export default IntroContainer;
