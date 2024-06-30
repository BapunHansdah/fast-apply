// import React from "react";
// import ReactDOM from "react-dom";

// export function ShadowDom({
//   parentElement,
//   position = "beforebegin",
//   children,
// }: {
//   parentElement: Element;
//   position?: InsertPosition;
//   children: React.ReactNode;
// }) {
//   const [shadowHost] = React.useState(() =>
//     document.createElement("my-shadow-host")
//   );

//   const [shadowRoot] = React.useState(() =>
//     shadowHost.attachShadow({ mode: "open" })
   
//   );

//   React.useLayoutEffect(() => {
//     if (parentElement) {
//       parentElement.insertAdjacentElement(position, shadowHost);
//     }

//     return () => {
//       shadowHost.remove();
//     };
//   }, [parentElement, shadowHost, position]);

//   return ReactDOM.createPortal(children, shadowRoot);
// }

import React from "react";
import ReactDOM from "react-dom";
import { twind, cssom, observe } from "@twind/core";
// support shadowroot.adoptedStyleSheets in all browsers
import "construct-style-sheets-polyfill";
// mention right path for twind.config.js
import config from "../../twind.config";

// Create separate CSSStyleSheet
const sheet = cssom(new CSSStyleSheet());

// Use sheet and config to create an twind instance. `tw` will
// append the right CSS to our custom stylesheet.
const tw = twind(config, sheet);

export function ShadowDom({
  parentElement,
  position = "beforebegin",
  children,
  zIndex = 99999, // Default zIndex value
}: {
  parentElement: Element;
  position?: InsertPosition;
  children: React.ReactNode;
  zIndex?: number;
}) {
  const [shadowHost] = React.useState(() => {

    const host: HTMLElement = document.createElement('div');
    host.setAttribute('id', 'fast-apply-extension-root');
    document.body.append(host);
    var linkNode = document.createElement("link"); 
    linkNode.type = "text/css"; 
    linkNode.rel = "stylesheet"; 
    linkNode.href = "//fonts.googleapis.com/css?family=Roboto";
    document.head.appendChild(linkNode);
    host.style.position = 'fixed'; // or 'fixed' if you want it to be relative to the viewport
    host.style.zIndex = `${zIndex}`; // Set the zIndex here
    host.style.fontFamily = 'Roboto';
    return host;
  });

  const [shadowRoot] = React.useState(() =>
    shadowHost.attachShadow({ mode: "open" })
  );

  shadowRoot.adoptedStyleSheets = [sheet.target];
  
  observe(tw, shadowRoot);

  React.useLayoutEffect(() => {
    if (parentElement) {
      parentElement.insertAdjacentElement(position, shadowHost);
    }

    return () => {
      shadowHost.remove();
    };
  }, [parentElement, shadowHost, position]);

  return ReactDOM.createPortal(children, shadowRoot);
}
