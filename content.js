function createIframe() {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  const iframe = document.createElement('iframe');
  iframe.id = 'iframe-in-root';
  iframe.allow = 'microphone;camera';
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
  iframe.setAttribute('allowFullScreen', '');
  iframe.scrolling = 'no';
  iframe.style.cssText = `
  border: 0;
  margin: 0;
  height: 200px;
  z-index: 2147483647;
  background-color: #EAEAEA;
  border: 1px solid #EAEAEA;
  filter: none;
  display: block;
  `;

  iframe.src = chrome.runtime.getURL('index.html');

  root.style.cssText = `
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: 0;
  z-index: 2147483647;
  `;
  root.prepend(iframe);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.key === 'test') {
    createIframe()
    setTimeout( () => {
      document.querySelector('#iframe-in-root').remove()
    }, 10000)
  } 
  sendResponse('Hi, I am content.js and I have received your message')
})