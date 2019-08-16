// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // create width spec and display at the bottom / center / top of the component
    if (msg.type === 'create-width-bottom' ||
        msg.type === 'create-width-top' ||
        msg.type === 'create-width-center') {
        for (const node of figma.currentPage.selection) {
            // set up base frame
            const widthFrame = figma.createFrame();
            widthFrame.resizeWithoutConstraints(node.width, node.height + 16);
            widthFrame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
            widthFrame.x = node.x;
            node.parent.appendChild(widthFrame);
            // calculate width & display
            const widthText = figma.createText();
            widthText.characters = node.width.toString().concat("px");
            widthText.x = node.width / 2 - widthText.width / 2;
            widthText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            const textContainer = figma.createRectangle();
            textContainer.resizeWithoutConstraints(widthText.width, widthText.height);
            textContainer.x = widthText.x;
            textContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 0.33, b: 0 } }];
            const widthLine = figma.createLine();
            widthLine.x = 0;
            if (msg.type === 'create-width-bottom') {
                widthFrame.y = node.y;
                widthText.y = node.height + 2;
                textContainer.y = widthText.y;
                widthLine.y = node.height + 10;
            }
            else if (msg.type === 'create-width-top') {
                widthFrame.y = node.y - 17;
                widthText.y = 0;
                textContainer.y = widthText.y;
                widthLine.y = 7;
            }
            else {
                widthFrame.y = node.y;
                widthFrame.resizeWithoutConstraints(node.width, node.height);
                widthText.y = node.height / 2 - 7;
                textContainer.y = widthText.y;
                widthLine.y = node.height / 2;
            }
            widthLine.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.33, b: 0 } }];
            widthLine.strokeCap = "ARROW_EQUILATERAL";
            widthLine.resize(node.width, 0);
            widthFrame.appendChild(widthLine);
            widthFrame.appendChild(textContainer);
            widthFrame.appendChild(widthText);
        }
    }
    // create height spec and display at the right / center / left of the component
    if (msg.type === 'create-height-right' ||
        msg.type === 'create-height-left' ||
        msg.type === 'create-height-center') {
        for (const node of figma.currentPage.selection) {
            // set up base frame
            const heightFrame = figma.createFrame();
            heightFrame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
            heightFrame.y = node.y;
            node.parent.appendChild(heightFrame);
            // calculate height & displays
            const heightText = figma.createText();
            heightText.characters = node.height.toString().concat("px");
            heightText.y = (node.height - heightText.height) / 2;
            heightText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            const textContainer = figma.createRectangle();
            textContainer.resizeWithoutConstraints(heightText.width, heightText.height);
            textContainer.y = heightText.y;
            textContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 0.33, b: 0 } }];
            heightFrame.resizeWithoutConstraints(node.width + 11 + heightText.height, node.height);
            const heightLine = figma.createLine();
            if (msg.type === 'create-height-right') {
                heightFrame.x = node.x;
                heightText.x = node.width - 8;
                textContainer.x = heightText.x;
                heightLine.x = node.width + 10;
            }
            else if (msg.type === 'create-height-left') {
                heightFrame.x = node.x - 20;
                heightFrame.resizeWithoutConstraints(node.width + 20, node.height);
                heightText.x = 0;
                textContainer.x = heightText.x;
                heightLine.x = 13;
            }
            else {
                heightFrame.x = node.x;
                heightFrame.resizeWithoutConstraints(node.width, node.height);
                heightText.x = (node.width - heightText.width) / 2;
                textContainer.x = heightText.x;
                heightLine.x = node.width / 2;
            }
            heightLine.y = 0;
            heightLine.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.33, b: 0 } }];
            heightLine.strokeCap = "ARROW_EQUILATERAL";
            heightLine.resize(node.width, 0);
            heightLine.rotation = 90;
            heightLine.y = heightLine.width;
            heightFrame.appendChild(heightLine);
            heightFrame.appendChild(textContainer);
            heightFrame.appendChild(heightText);
        }
    }
    // create spacing spec between an component & the outer canvas
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
