// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

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
      widthFrame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0}];
      widthFrame.x = node.x;
      node.parent.appendChild(widthFrame);
      // calculate width & display
      const widthText = figma.createText();
      widthText.characters = node.width.toString().concat("px");
      widthText.x = node.width/2 - widthText.width/2;
      widthText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
      const textContainer = figma.createRectangle();
      textContainer.resizeWithoutConstraints(widthText.width, widthText.height);
      textContainer.x = widthText.x;
      textContainer.fills = [{type: 'SOLID', color: {r: 1, g: 0.33, b: 0}}];
      const widthLine = figma.createLine();
      widthLine.x = 0;
      if (msg.type === 'create-width-bottom') {
        widthFrame.y = node.y;
        widthText.y = node.height + 2;
        textContainer.y = widthText.y;
        widthLine.y = node.height + 10;
      } else if (msg.type === 'create-width-top') {
        widthFrame.y = node.y - 17;
        widthText.y = 0;
        textContainer.y = widthText.y;
        widthLine.y = 7;
      } else {
        widthFrame.y = node.y;
        widthFrame.resizeWithoutConstraints(node.width, node.height);
        widthText.y = node.height / 2 - 7;
        textContainer.y = widthText.y;
        widthLine.y = node.height / 2;
      }
      widthLine.strokes = [{type: 'SOLID', color: {r: 1, g: 0.33, b: 0}}];
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
      heightFrame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0}];
      heightFrame.y = node.y;
      node.parent.appendChild(heightFrame);
      // calculate height & displays
      const heightText = figma.createText();
      heightText.characters = node.height.toString().concat("px");
      heightText.y = (node.height - heightText.height) / 2;
      heightText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
      const textContainer = figma.createRectangle();
      textContainer.resizeWithoutConstraints(heightText.width, heightText.height);
      textContainer.y = heightText.y;
      textContainer.fills = [{type: 'SOLID', color: {r: 1, g: 0.33, b: 0}}];
      heightFrame.resizeWithoutConstraints(node.width + 11 + heightText.height, node.height);
      const heightLine = figma.createLine();
      if (msg.type === 'create-height-right') {
        heightFrame.x = node.x;
        heightText.x = node.width - 8;
        textContainer.x = heightText.x;
        heightLine.x = node.width + 10;
      } else if (msg.type === 'create-height-left') {
        heightFrame.x = node.x - 20;
        heightFrame.resizeWithoutConstraints(node.width + 20, node.height);
        heightText.x = 0;
        textContainer.x = heightText.x;
        heightLine.x = 13;
      } else {
        heightFrame.x = node.x;
        heightFrame.resizeWithoutConstraints(node.width, node.height);
        heightText.x = (node.width - heightText.width)/2;
        textContainer.x = heightText.x;
        heightLine.x = node.width/2;
      }
      heightLine.y = 0;
      heightLine.strokes = [{type: 'SOLID', color: {r: 1, g: 0.33, b: 0}}];
      heightLine.strokeCap = "ARROW_EQUILATERAL";
      heightLine.resize(node.height, 0);
      heightLine.rotation = 90;
      heightLine.y = heightLine.width;
      heightFrame.appendChild(heightLine);
      heightFrame.appendChild(textContainer);
      heightFrame.appendChild(heightText);
    }
  }
  // create spacing spec (direction-margins) between components and the outer canvas
  if (msg.type === 'create-margin-top' || 
      msg.type === 'create-margin-left' ||
      msg.type === 'create-margin-right' ||
      msg.type === 'create-margin-bottom') {
    for (const node of figma.currentPage.selection) {
      if ("parent" in node) {
        if (node.parent.type != "PAGE" && node.parent.type != "DOCUMENT") {
          let marginValue = 0
          if (msg.type === 'create-margin-top') {
            marginValue = Math.round(Math.abs(node.y - node.parent.y));
          } else if (msg.type === 'create-margin-left') {
            marginValue = Math.round(Math.abs(node.x - node.parent.x));
          } else if (msg.type === 'create-margin-right') {
            marginValue = Math.round(Math.abs(node.parent.width - Math.abs(node.x - node.parent.x) - node.width));
          } else {
            marginValue = Math.round(Math.abs(node.parent.height - Math.abs(node.y - node.parent.y) - node.height));
          }
          if (marginValue != 0) {
            const marginText = figma.createText();
            marginText.characters = marginValue.toString().concat("px");
            marginText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
            
            const textContainer = figma.createRectangle();
            textContainer.resizeWithoutConstraints(marginText.width, marginText.height);
            textContainer.x = marginText.x;
            textContainer.y = marginText.y;
            textContainer.fills = [{type: 'SOLID', color: {r: 0.53, g: 0.31, b: 0.89}}];
  
            const marginFrame = figma.createFrame();
            marginFrame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0}];
            marginFrame.resizeWithoutConstraints(marginText.width, marginText.height);
            if (msg.type === 'create-margin-top') {
              marginFrame.x = node.x + node.width / 2 - marginText.width / 2;
              marginFrame.y = marginValue < 14 ? node.parent.y : node.parent.y + marginValue / 2 - marginText.height / 2;
            } else if (msg.type === 'create-margin-left') {
              marginFrame.x = marginValue < marginText.width ? node.parent.x : node.parent.x + marginValue / 2 - marginText.width / 2;
              marginFrame.y = node.y + node.height / 2 - marginText.height / 2;
            } else if (msg.type === 'create-margin-right') {
              marginFrame.x = marginValue < marginText.width ? node.parent.x + node.parent.width - marginFrame.width : node.x + node.width + marginValue / 2 - marginText.width / 2;
              marginFrame.y = node.y + node.height / 2 - marginText.height / 2;
            } else {
              marginFrame.x = node.x + node.width / 2 - marginText.width / 2;
              marginFrame.y = marginValue < 14 ? node.parent.y + node.parent.height - marginFrame.height : node.y + node.height + marginValue / 2 - marginText.height / 2;
            }
            // append child at last to avoid group size change
            marginFrame.clipsContent = false;
            node.parent.appendChild(marginFrame);

            const marginLine = figma.createLine();
            marginLine.strokes = [{type: 'SOLID', color: {r: 0.53, g: 0.31, b: 0.89}}];
            marginLine.resize(marginValue, 0);
            if (msg.type === 'create-margin-top' || msg.type === 'create-margin-bottom') {
              marginLine.rotation = 90;
              marginLine.y = marginValue/2 + marginFrame.height/2;
              marginLine.x = marginFrame.width/2;
            } else if (msg.type === 'create-margin-left' || msg.type === 'create-margin-right') {
              marginLine.y = marginFrame.height / 2;
              marginLine.x = -(marginValue - marginFrame.width)/2;
            }
  
            marginFrame.appendChild(marginLine);
            marginFrame.appendChild(textContainer);
            marginFrame.appendChild(marginText);
          } else {
            const marginLine = figma.createLine();
            marginLine.strokes = [{type: 'SOLID', color: {r: 0.53, g: 0.31, b: 0.89}}];
            if (msg.type === 'create-margin-top' || msg.type === 'create-margin-bottom') {
              marginLine.resize(node.parent.width, 0);
              marginLine.x = node.parent.x;
              marginLine.y = msg.type === 'create-margin-top' ? node.parent.y : node.parent.y + node.parent.height;
            } else {
              marginLine.resize(node.parent.height, 0);
              marginLine.rotation = 90;
              marginLine.x = msg.type === 'create-margin-left' ? node.parent.x : node.parent.x + node.parent.width;
              marginLine.y = node.parent.y + node.parent.height;
            }
            node.parent.appendChild(marginLine);
          }
        } else {
          alert("We cannot measure margin of frames on root canvas");
        }
      }
    }
  }

  // create spacing spec between two components
  if (msg.type === 'create-spacing-horizon' || msg.type === 'create-spacing-portrait') {
    const numOfSel = figma.currentPage.selection.length;
    if (numOfSel === 2) {
      let lhsSelection = figma.currentPage.selection[0];
      let rhsSelection = figma.currentPage.selection[1];
      let spacingValue = 0;
      let displaySpacing = false;
      // calculate spcaing ensure no oevrlap
      if (msg.type === 'create-spacing-horizon') {
        if (lhsSelection.x + lhsSelection.width < rhsSelection.x || lhsSelection.x + lhsSelection.width === rhsSelection.x) {
          spacingValue = Math.round(Math.abs(rhsSelection.x - lhsSelection.x - lhsSelection.width));
          displaySpacing = true;
        } else if (lhsSelection.x > rhsSelection.x + rhsSelection.width || lhsSelection.x === rhsSelection.x + rhsSelection.width) {
          spacingValue = Math.round(Math.abs(lhsSelection.x - rhsSelection.x - rhsSelection.width));
          displaySpacing = true;
        } else {
          // has overlap, do nothing
        }
      } else {
        if (lhsSelection.y + lhsSelection.height < rhsSelection.y || lhsSelection.y + lhsSelection.height === rhsSelection.y) {
          spacingValue = Math.round(Math.abs(rhsSelection.y - lhsSelection.y - lhsSelection.height));
          displaySpacing = true;
        } else if (lhsSelection.y > rhsSelection.y + rhsSelection.height || lhsSelection.y === rhsSelection.y + rhsSelection.height) {
          spacingValue = Math.round(Math.abs(lhsSelection.y - rhsSelection.y - rhsSelection.height));
          displaySpacing = true;
        } else {
          // has overlap, do nothing
        }
      }
      // display spcaing when no oevrlap
      if (displaySpacing) {
        const spacingText = figma.createText();
        spacingText.characters = spacingValue.toString().concat("px");
        spacingText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
        
        const textContainer = figma.createRectangle();
        textContainer.resizeWithoutConstraints(spacingText.width, spacingText.height);
        textContainer.x = spacingText.x;
        textContainer.y = spacingText.y;
        textContainer.fills = [{type: 'SOLID', color: {r: 0.53, g: 0.31, b: 0.89}}];
  
        const spacingFrame = figma.createFrame();
        spacingFrame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0}];
        spacingFrame.resizeWithoutConstraints(spacingText.width, spacingText.height);
        spacingFrame.clipsContent = false;

        const spacingLine = figma.createLine();
        spacingLine.strokes = [{type: 'SOLID', color: {r: 0.53, g: 0.31, b: 0.89}}];
        spacingLine.resize(spacingValue, 0);

        if (msg.type === 'create-spacing-horizon') {
          spacingFrame.x = lhsSelection.x < rhsSelection.x ? 
          lhsSelection.x + lhsSelection.width + spacingValue / 2 - spacingText.width / 2 : 
          rhsSelection.x + rhsSelection.width + spacingValue / 2 - spacingText.width / 2;
          spacingFrame.y = lhsSelection.height < rhsSelection.height ? 
          lhsSelection.y + lhsSelection.height / 2 - spacingText.height / 2 :
          rhsSelection.y + rhsSelection.height / 2 - spacingText.height / 2;
  
          spacingLine.y = spacingText.height / 2;
          spacingLine.x = -(spacingValue - spacingText.width)/2;
        } else {
          spacingFrame.x = lhsSelection.width < rhsSelection.width ? 
          lhsSelection.x + lhsSelection.width / 2 - spacingText.width / 2 :
          rhsSelection.x + rhsSelection.width / 2 - spacingText.width / 2;
          spacingFrame.y = lhsSelection.y < rhsSelection.y ? 
          lhsSelection.y + lhsSelection.height + spacingValue / 2 - spacingText.height / 2 : 
          rhsSelection.y + rhsSelection.height + spacingValue / 2 - spacingText.height / 2;

          spacingLine.x = spacingText.width / 2;
          spacingLine.y -= (spacingValue - spacingText.height) / 2;
          spacingLine.rotation = -90;
        }
        
        spacingFrame.appendChild(spacingLine);
        spacingFrame.appendChild(textContainer);
        spacingFrame.appendChild(spacingText);

        lhsSelection.parent.appendChild(spacingFrame);
      } else {
        //do nothing for now
      }
    } else {
      alert("You must select two frames to mark");
    }
  }

  // create spacing spec between two components
  if (msg.type === 'create-font-spec-on-right' ||
      msg.type === 'create-font-spec-on-left' ||
      msg.type === 'create-font-spec-on-top' ||
      msg.type === 'create-font-spec-on-bottom') {
    let hasTextNode = false;
    for (const node of figma.currentPage.selection) {
      if (node.type === "TEXT") {
        hasTextNode = true;
        const fontSpecText = figma.createText();
        fontSpecText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
        fontSpecText.x = 4;
        fontSpecText.y = 4;
        fontSpecText.characters = "layer-name: " + node.name + "\n" + 
                                   "color: " + rgbToHex(Math.round(node.fills[0].color.r*255), Math.round(node.fills[0].color.g*255), Math.round(node.fills[0].color.b*255)) + "  " + Math.round(node.fills[0].opacity * 100) + "%\n" + 
                                   "opacity: " + Math.round(node.opacity * 100) + "%\n" + 
                                   "font-size: " + node.fontSize.toString() + "px\n" +
                                   "font-face: " + node.fontName.family + " " + node.fontName.style + "\n" +
                                   "letter-spacing: " + node.letterSpacing.value + "px\n" +
                                   "line-height: " + node.lineHeight.value + "px";
        
        const fontSpecTextContainer = figma.createRectangle();
        fontSpecTextContainer.resizeWithoutConstraints(fontSpecText.width + 8, fontSpecText.height + 8);
        fontSpecTextContainer.x = 0;
        fontSpecTextContainer.y = 0;
        fontSpecTextContainer.fills = [{type: 'SOLID', color: {r: 1, g: 0.706, b: 0}}];
        fontSpecTextContainer.cornerRadius = 2;

        const arrowRect = figma.createRectangle();
        arrowRect.resizeWithoutConstraints(6, 6);
        arrowRect.fills = [{type: 'SOLID', color: {r: 1, g: 0.706, b: 0}}];
        arrowRect.rotation = -45;

        const fontSpecFrame = figma.createFrame();
        fontSpecFrame.backgrounds = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0}];
        fontSpecFrame.resizeWithoutConstraints(fontSpecTextContainer.width, fontSpecTextContainer.height);
        fontSpecFrame.clipsContent = false;

        fontSpecFrame.x = node.x + node.width + 6;

        if (msg.type === 'create-font-spec-on-right' || msg.type === 'create-font-spec-on-left') {
          arrowRect.x = msg.type === 'create-font-spec-on-right' ? 0 : fontSpecTextContainer.width;
          arrowRect.y = fontSpecTextContainer.height / 2 - arrowRect.height / 2;
          fontSpecFrame.x = msg.type === 'create-font-spec-on-right' ? node.x + node.width + 6 : node.x - fontSpecFrame.width - 6;
          fontSpecFrame.y = node.y + node.height/2 - fontSpecFrame.height / 2;
        } else {
          arrowRect.x = fontSpecTextContainer.width / 2 - arrowRect.width / 2;
          arrowRect.y = msg.type === 'create-font-spec-on-bottom' ? -4 : fontSpecTextContainer.height - 4;
          fontSpecFrame.x = node.x + node.width/2 - fontSpecFrame.width / 2;
          fontSpecFrame.y = msg.type === 'create-font-spec-on-bottom' ? node.y + node.height + 4 : node.y - fontSpecFrame.height - 4;
        }
        
        fontSpecFrame.appendChild(fontSpecTextContainer);
        fontSpecFrame.appendChild(arrowRect);
        fontSpecFrame.appendChild(fontSpecText);

        node.parent.appendChild(fontSpecFrame);
      } else {
        //do nothing for non-text node
      }
    }
    if (!hasTextNode) {
      alert("Please select at least one text node to display font spec");
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  
};
