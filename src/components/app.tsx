import React from "react";
import { ShadowDom } from "./ShadowDom";
import Container from "./container";


export function App(): React.ReactElement | null {

  const [parentElement] = React.useState(() =>
    document.querySelector("body")
  );
  
  return parentElement ? (
    <ShadowDom parentElement={parentElement}>
       <Container></Container>
    </ShadowDom>
  ) : null;
}
