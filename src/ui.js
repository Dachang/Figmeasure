import './ui.css';
document.getElementById('width-bottom').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-width-bottom' } }, '*');
};
document.getElementById('width-top').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-width-top' } }, '*');
};
document.getElementById('width-center').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-width-center' } }, '*');
};
document.getElementById('height-right').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-height-right' } }, '*');
};
document.getElementById('height-left').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-height-left' } }, '*');
};
document.getElementById('height-center').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-height-center' } }, '*');
};
document.getElementById('margin-top').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-margin-top' } }, '*');
};
document.getElementById('margin-left').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-margin-left' } }, '*');
};
document.getElementById('margin-right').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-margin-right' } }, '*');
};
document.getElementById('margin-bottom').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-margin-bottom' } }, '*');
};
document.getElementById('spacing-horizon').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-spacing-horizon' } }, '*');
};
document.getElementById('spacing-portrait').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-spacing-portrait' } }, '*');
};
document.getElementById('font-spec-on-right').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-font-spec-on-right' } }, '*');
};
document.getElementById('font-spec-on-left').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-font-spec-on-left' } }, '*');
};
document.getElementById('font-spec-on-top').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-font-spec-on-top' } }, '*');
};
document.getElementById('font-spec-on-bottom').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'create-font-spec-on-bottom' } }, '*');
};
document.getElementById('cancel').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
};
