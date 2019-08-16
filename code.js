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
    // create width spec and display at the bottom
    if (msg.type === 'create-width-bottom') {
        for (const node of figma.currentPage.selection) {
            // set up base frame
            const widthFrame = figma.createFrame();
            widthFrame.resizeWithoutConstraints(node.width, node.height + 34);
            widthFrame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
            widthFrame.x = node.x;
            widthFrame.y = node.y;
            node.parent.appendChild(widthFrame);
            // calculate width & display
            const widthText = figma.createText();
            widthText.characters = node.width.toString().concat("px");
            widthText.x = node.width / 2 - widthText.width / 2;
            widthText.y = node.height + 14;
            widthFrame.appendChild(widthText);
            const widthLine = figma.createLine();
            widthLine.x = 0;
            widthLine.y = node.height + 10;
            widthLine.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            widthLine.strokeCap = "ARROW_EQUILATERAL";
            widthLine.resize(node.width, 0);
            widthFrame.appendChild(widthLine);
        }
    }
    // create height spec and display at the right
    if (msg.type === 'create-height-right') {
        for (const node of figma.currentPage.selection) {
            // set up base frame
            const heightFrame = figma.createFrame();
            heightFrame.resizeWithoutConstraints(node.width + 20, node.height + 34);
            heightFrame.backgrounds = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
            heightFrame.x = node.x;
            heightFrame.y = node.y;
            node.parent.appendChild(heightFrame);
            // calculate height & displays
            const heightText = figma.createText();
            heightText.characters = node.height.toString().concat("px");
            heightText.x = node.width + 14;
            heightText.rotation = 90;
            heightText.y = (node.height + heightText.width) / 2;
            heightFrame.resizeWithoutConstraints(node.width + 14 + heightText.height, node.height);
            heightFrame.appendChild(heightText);
            const heightLine = figma.createLine();
            heightLine.x = node.width + 10;
            heightLine.y = 0;
            heightLine.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            heightLine.strokeCap = "ARROW_EQUILATERAL";
            heightLine.resize(node.width, 0);
            heightLine.rotation = 90;
            heightLine.y = heightLine.width;
            heightFrame.appendChild(heightLine);
        }
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
