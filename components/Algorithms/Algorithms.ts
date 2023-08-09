import { Bin, Rectangle } from "../utils";

function sortDescendingByArea(rectangles: Rectangle[]): Rectangle[] {
  return rectangles.sort((a, b) => b.width * b.height - a.width * a.height);
}

export function guillotineCut(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const packedRectangles: Rectangle[][] = [[]];

  rectangles.forEach((rectangle) => {
    let added = false;

    // Iterate through the bins (rectangles in the packedRectangles array)
    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];
      // Check if the rectangle can fit horizontally
      if (rectangle.width <= sheet.width - bin.reduce((sum, rect) => sum + rect.width, 0)) {
        // Check if the rectangle can fit vertically
        const maxHeight = bin.reduce((accMaxHeight, rect) => Math.max(accMaxHeight, rect.height), 0);
        if (maxHeight + rectangle.height <= sheet.height) {
          bin.push(rectangle);
          added = true;
          break;
        }
      }
      // Check if the rectangle can fit vertically
      if (rectangle.height <= sheet.height - bin.reduce((sum, rect) => sum + rect.height, 0)) {
        // Check if the rectangle can fit horizontally
        const maxWidth = bin.reduce((accMaxWidth, rect) => Math.max(accMaxWidth, rect.width), 0);
        if (maxWidth + rectangle.width <= sheet.width) {
          bin.push(rectangle);
          added = true;
          break;
        }
      }
    }

    if (!added) {
      // If the rectangle couldn't fit any existing bin, create a new bin with the rectangle
      packedRectangles.push([rectangle]);
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}

export function bestFitDecreasing(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const sortedRectangles = sortDescendingByArea(rectangles);
  const packedRectangles: Rectangle[][] = [];

  sortedRectangles.forEach((rectangle) => {
    let added = false;

    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];
      const totalWidth = bin.reduce((sum, rect) => sum + rect.width, 0);
      const totalHeight = bin.reduce((sum, rect) => Math.max(sum, rect.height), 0);

      if (totalWidth + rectangle.width <= sheet.width && rectangle.height <= sheet.height - totalHeight) {
        bin.push(rectangle);
        added = true;
        break;
      }
    }

    if (!added) {
      if (rectangle.width <= sheet.width && rectangle.height <= sheet.height) {
        packedRectangles.push([rectangle]);
      }
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}

export function firstFitDecreasing(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const sortedRectangles = sortDescendingByArea(rectangles);
  const packedRectangles: Rectangle[][] = [[]];

  sortedRectangles.forEach((rectangle) => {
    let added = false;

    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];
      if (bin.reduce((sum, rect) => sum + rect.width, 0) + rectangle.width <= sheet.width) {
        if (
          rectangle.height <=
          sheet.height - bin.reduce((accMaxHeight, rect) => Math.max(accMaxHeight, rect.height), 0)
        ) {
          bin.push(rectangle);
          added = true;
          break;
        }
      }
    }

    if (!added) {
      packedRectangles.push([rectangle]);
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}

export function nextFit(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const packedRectangles: Rectangle[][] = [[]];
  let currentBinIndex = 0;

  rectangles.forEach((rectangle) => {
    if (
      packedRectangles[currentBinIndex].reduce((sum, rect) => sum + rect.width, 0) + rectangle.width <= sheet.width &&
      rectangle.height <=
        sheet.height -
          packedRectangles[currentBinIndex].reduce((accMaxHeight, rect) => Math.max(accMaxHeight, rect.height), 0)
    ) {
      packedRectangles[currentBinIndex].push(rectangle);
    } else {
      currentBinIndex += 1;
      packedRectangles[currentBinIndex] = [rectangle];
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}

export function bottomLeftBinPacking(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const sortedRectangles = sortDescendingByArea(rectangles);
  const packedRectangles: Rectangle[][] = [[]];

  sortedRectangles.forEach((rectangle) => {
    let added = false;

    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];

      const maxHeight = bin.reduce((accMaxHeight, rect) => Math.max(accMaxHeight, rect.height), 0);
      if (
        rectangle.width <= sheet.width - bin.reduce((sum, rect) => sum + rect.width, 0) &&
        rectangle.height <= sheet.height - maxHeight
      ) {
        bin.push(rectangle);
        added = true;
        break;
      }
    }

    if (!added) {
      packedRectangles.push([rectangle]);
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}

export function rectangleMerge(rectangles: Rectangle[], sheet: Bin): Rectangle[][] {
  const packedRectangles: Rectangle[][] = [[]];

  function splitRectangle(rect: Rectangle, width: number, height: number): Rectangle[] {
    const topRect: Rectangle = { id: rect.id, width, height, left: rect.left, top: rect.top };
    const bottomRect: Rectangle = {
      id: rect.id,
      width: rect.width - width,
      height: rect.height,
      left: (rect.left || 0) + width,
      top: rect.top,
    };
    return [topRect, bottomRect];
  }

  rectangles.forEach((rectangle) => {
    let added = false;

    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];
      const totalWidth = bin.reduce((sum, rect) => sum + rect.width, 0);
      const totalHeight = bin.reduce((sum, rect) => Math.max(sum, rect.height), 0);

      if (totalWidth + rectangle.width <= sheet.width && rectangle.height <= sheet.height - totalHeight) {
        bin.push(rectangle);
        added = true;
        break;
      }
    }

    if (!added) {
      if (rectangle.width <= sheet.width && rectangle.height <= sheet.height) {
        // Try splitting the rectangle
        for (let i = 0; i < packedRectangles.length; i++) {
          const bin = packedRectangles[i];
          const totalWidth = bin.reduce((sum, rect) => sum + rect.width, 0);
          const totalHeight = bin.reduce((sum, rect) => Math.max(sum, rect.height), 0);

          if (totalWidth + rectangle.width <= sheet.width) {
            const remainingWidth = sheet.width - totalWidth;
            const splitRectangles = splitRectangle(rectangle, remainingWidth, rectangle.height);
            bin.push(...splitRectangles);
            added = true;
            break;
          } else if (totalHeight + rectangle.height <= sheet.height) {
            const remainingHeight = sheet.height - totalHeight;
            const splitRectangles = splitRectangle(rectangle, rectangle.width, remainingHeight);
            bin.push(...splitRectangles);
            added = true;
            break;
          }
        }

        if (!added) {
          packedRectangles.push([rectangle]);
        }
      }
    }
  });

  let currentLeft = 0;
  let currentTop = 0;

  packedRectangles.forEach((rectangleRow) => {
    rectangleRow.forEach((rectangle) => {
      rectangle.left = currentLeft;
      rectangle.top = currentTop;
      currentLeft += rectangle.width;
    });
    currentLeft = 0;
    currentTop += rectangleRow.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);
  });

  return packedRectangles;
}