interface Rectangle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

interface Bin {
  width: number;
  height: number;
}

const EMPTY_BOTTOM_SPACE_ID = -9999;

const areRectanglesOverlapping = (rect1: Rectangle, rect2: Rectangle) =>
  rect1.left < rect2.left + rect2.width &&
  rect1.left + rect1.width > rect2.left &&
  rect1.top < rect2.top + rect2.height &&
  rect1.top + rect1.height > rect2.top;

const findOverlappingItems = (items: Rectangle[]) => {
  const overlappingItems = [];

  for (let i = 0; i < items.length; i++) {
    const currentRect = items[i];
    for (let j = i + 1; j < items.length; j++) {
      const otherRect = items[j];
      if (areRectanglesOverlapping(currentRect, otherRect)) {
        overlappingItems.push([currentRect, otherRect]);
      }
    }
  }

  return overlappingItems;
};

const mergeRectangles = (rectangles: Rectangle[]) => {
  const mergedRectangles: Rectangle[] = [];
  const processedHorizontalRectangles: number[] = [];

  rectangles.forEach((rectangle) => {
    if (rectangle.id === EMPTY_BOTTOM_SPACE_ID) {
      mergedRectangles.push(rectangle);
      return;
    }

    const currentRectangleLeftPosition = rectangle.left;
    const currentRectangleRightPosition = currentRectangleLeftPosition + rectangle.width;

    // rectangles with the same top position (same row)
    const rectanglesSameRow = rectangles
      .slice()
      .filter((rect) => rect.top === rectangle.top && !processedHorizontalRectangles.includes(rect.id))
      .sort((a, b) => a.left - b.left);

    const rectanglesListUpToBottom = rectangles.slice().sort((a, b) => a.top - b.top);

    // rectangles in the same column (same left/right position) excluding not consecutive rectangles
    const rectanglesSameColumn = rectanglesListUpToBottom
      .filter((rect, index) => {
        const previousRectangle = rectanglesListUpToBottom[index - 1];
        let previousBottom = 0;
        if (previousRectangle) {
          const previousRight = previousRectangle.left + previousRectangle.width;
          const currentRight = rect.left + rect.width;

          previousBottom =
            previousRectangle.left === rect.left || previousRight === currentRight
              ? previousRectangle.top + previousRectangle.height
              : rect.top;
        }

        return (
          (currentRectangleLeftPosition === rect.left || currentRectangleRightPosition === rect.left + rect.width) &&
          rect.top === previousBottom
        );
      })
      .sort((a, b) => a.top - b.top);

    if (rectanglesSameRow.length > 0) {
      const totalWidth = rectanglesSameRow.reduce((sum, rect) => sum + rect.width, 0);
      const minHeight = rectanglesSameRow.reduce((min, rect) => Math.min(min, rect.height), Number.MAX_SAFE_INTEGER);
      const minLeft = rectanglesSameRow.reduce((min, rect) => Math.min(min, rect.left), Number.MAX_SAFE_INTEGER);

      // creates a new empty rectangle as result of the merge
      mergedRectangles.push({
        id: rectangle.id,
        width: totalWidth,
        height: minHeight,
        left: minLeft,
        top: rectangle.top,
      });

      processedHorizontalRectangles.push(...rectanglesSameRow.map((rect) => rect.id));
    }

    if (rectanglesSameColumn.length > 0) {
      const minWidth = rectanglesSameColumn.reduce(
        (minFoundWidth, rect) => Math.min(minFoundWidth, rect.width),
        Number.MAX_SAFE_INTEGER
      );
      const minTop = rectanglesSameColumn.reduce(
        (minFoundTop, rect) => Math.min(minFoundTop, rect.top),
        Number.MAX_SAFE_INTEGER
      );
      const totalHeight = rectanglesSameColumn.reduce((sum, rect) => sum + rect.height, 0);
      // creates a new empty rectangle as result of the merge
      mergedRectangles.push({
        id: rectangle.id,
        width: minWidth,
        height: totalHeight,
        left: currentRectangleLeftPosition,
        top: minTop,
      });
    }
  });

  // remove duplicates and keeps only merged rectangles with the largest area
  const mergedRectanglesWithArea = mergedRectangles.map((rect) => ({ ...rect, area: rect.width * rect.height }));
  const uniqueMergedRectanglesIds = mergedRectanglesWithArea
    .map((rect) => rect.id)
    .filter((id, index, self) => self.indexOf(id) === index);

  const uniqueMergedRectangles = uniqueMergedRectanglesIds.map((id) => {
    const rectanglesWithSameId = mergedRectanglesWithArea.filter((rect) => rect.id === id);
    const largestRectangle = rectanglesWithSameId.reduce((acc, curr) => (curr.area > acc.area ? curr : acc));
    return {
      id: largestRectangle.id,
      width: largestRectangle.width,
      height: largestRectangle.height,
      left: largestRectangle.left,
      top: largestRectangle.top,
    };
  });

  return uniqueMergedRectangles;
};

const getEmptyRectangles = (packedRectangles: Rectangle[][], sheet: Bin): Rectangle[] => {
  const emptyRectangles: Rectangle[] = [];
  packedRectangles.forEach((bin) => {
    const binTotalWidth = bin.reduce((sum, rect) => sum + rect.width, 0);
    const minTop = bin.reduce((min, rect) => {
      if (typeof rect.top === 'number') {
        return Math.min(min, rect.top);
      }
      return min;
    }, Number.MAX_SAFE_INTEGER);

    if (binTotalWidth > 0 && binTotalWidth <= sheet.width) {
      // creates empty rectangles to fill the space left in the row at a height level
      const sortedByMinHeight = bin.slice().sort((a, b) => a.height - b.height);
      const maxHeightRectangle = sortedByMinHeight[sortedByMinHeight.length - 1].height;
      const emptyHeightSpace = sortedByMinHeight
        .filter((rect) => rect.height < maxHeightRectangle && -rect.id < 0) // this validation (-rect.id < 0) is to avoid creating empty rectangles when the rectangle is already empty
        .map((rect) => ({
          id: -rect.id,
          width: rect.width,
          height: maxHeightRectangle - rect.height,
          left: rect.left,
          top: rect.top + rect.height,
        }));

      // push empty rectangles to the list
      emptyRectangles.push(...emptyHeightSpace);

      // if the row has not been filled completely in its width, creates a new empty rectangle to fill that width space
      // -bin[bin.length - 1].id this validatios is to exlclude empty rectangles
      if (binTotalWidth < sheet.width && -bin[bin.length - 1].id < 0) {
        const emptyHeight = minTop + maxHeightRectangle > sheet.height ? sheet.height - minTop : maxHeightRectangle;
        const rectanglesToValidate = packedRectangles.flatMap((rectangles) => rectangles);
        rectanglesToValidate.push(...emptyRectangles);
        const newRectangle = {
          id: -bin[bin.length - 1].id,
          width: sheet.width - binTotalWidth,
          height: emptyHeight,
          left: binTotalWidth,
          top: minTop,
        };
        rectanglesToValidate.push(newRectangle);

        //  Removes existing empty rectangles that will be overlapped when the new empty rectangle is added
        findOverlappingItems(rectanglesToValidate)
          .flatMap((rectangle) => rectangle)
          .filter((rect) => rect.id < 0) // filtering only for empty rectangles
          .forEach((rect) => {
            const existingEmpty = emptyRectangles.find(
              (empty) =>
                rect.id === empty.id &&
                rect.width === empty.width &&
                rect.height === empty.height &&
                rect.left === empty.left &&
                rect.top === empty.top
            );
            if (existingEmpty) {
              emptyRectangles.splice(emptyRectangles.indexOf(existingEmpty), 1);
            }
          });

        // add new empty rectangle
        emptyRectangles.push({
          id: -bin[bin.length - 1].id,
          width: sheet.width - binTotalWidth,
          height: emptyHeight,
          left: binTotalWidth,
          top: minTop,
        });
      }
    }
  });

  // add empty rectangle at the bottom of the sheet if there is any space left
  const totalUsedHeightPackedRectangle = packedRectangles.reduce((sum, bin) => {
    const maxBin = bin.reduce((max, rect) => Math.max(max, rect.height), 0);
    return sum + maxBin;
  }, 0);

  if (totalUsedHeightPackedRectangle < sheet.height) {
    emptyRectangles.push({
      id: EMPTY_BOTTOM_SPACE_ID,
      width: sheet.width,
      height: sheet.height - totalUsedHeightPackedRectangle,
      left: 0,
      top: totalUsedHeightPackedRectangle,
    });
  }

  return mergeRectangles(emptyRectangles);
};

const processOverflownRectangles = (packedRectangles: Rectangle[][], sheet: Bin): Rectangle[][] => {
  // final list of rectangles to be rendered
  const processedRectangles = packedRectangles.map((bin) =>
    bin.filter((rect) => {
      const rectTop = rect.top;
      // if the rectangle is inside the sheet
      return rectTop <= sheet.height && rectTop + rect.height <= sheet.height;
    })
  );

  // list of rectangles that are outside the sheet
  const overflownRectangles = packedRectangles.flatMap((bin) =>
    bin.filter((rect) => {
      const rectTop = rect.top;
      // if the rectangle is outside the sheet
      return !(rectTop <= sheet.height && rectTop + rect.height <= sheet.height);
    })
  );

  console.log('overflownRectangles', overflownRectangles);
  overflownRectangles.forEach((rect) => {
    // reprocess empty rectangles for every overflown rectangle that is relocated
    const emptyRectangles = getEmptyRectangles(processedRectangles, sheet);
    // // render empty rectangles
    // processedRectangles.push([...emptyRectangles]);

    // get available empty rectangles that can fit the overflown rectangle
    console.log('emptyRectangles', emptyRectangles);
    console.log('rect', rect);
    const availableEmptyRectangles = emptyRectangles
      .filter(
        (rectangle) =>
          parseFloat(rectangle.width.toFixed(4)) >= parseFloat(rect.width.toFixed(4)) &&
          parseFloat(rectangle.height.toFixed(4)) >= parseFloat(rect.height.toFixed(4))
      )
      .sort((a, b) => a.top - b.top);

    const availableSpace = availableEmptyRectangles[0];

    // relocate the overflown rectangle to the available empty rectangle
    if (availableSpace) {
      processedRectangles.push([
        {
          ...rect,
          top: availableSpace.top,
          left: availableSpace.left,
        },
      ]);
    }
  });

  return processedRectangles;
};

export const skyline = (rectangles: Rectangle[], sheet: Bin): Rectangle[][] => {
  // Sort the rectangles by decreasing width and height
  const sortedRectangles = rectangles.slice().sort((a, b) => {
    const areaDiff = b.width * b.height - a.width * a.height;
    if (areaDiff !== 0) {
      return areaDiff;
    }
    return b.height - a.height;
  });

  const packedRectangles: Rectangle[][] = [[]];

  sortedRectangles.forEach((rectangle) => {
    let added = false;

    // Iterate through the bins (rectangles in the packedRectangles array)
    for (let i = 0; i < packedRectangles.length; i++) {
      const bin = packedRectangles[i];

      // Calculate the skyline heights before and after placing the rectangle at each position
      for (let j = 0; j <= bin.length; j++) {
        const newSkyline = bin
          .slice(0, j)
          .concat(rectangle)
          .concat(bin.slice(j))
          .map((rect) => rect.height);

        const newMaxHeight = Math.max(...newSkyline);
        const currentMaxHeight = bin.reduce((maxHeight, rect) => Math.max(maxHeight, rect.height), 0);

        // Check if the new skyline height is smaller or equal and rectangle fits within the sheet's dimensions
        if (
          newMaxHeight <= currentMaxHeight &&
          bin.reduce((sum, rect) => sum + rect.width, 0) + rectangle.width <= sheet.width
        ) {
          bin.splice(j, 0, rectangle);
          added = true;
          break;
        }
      }

      if (added) {
        break;
      }
    }

    if (!added && rectangle.height <= sheet.height && rectangle.width <= sheet.width) {
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

  // process rectangles that are outside the sheet
  return processOverflownRectangles(packedRectangles, sheet);
};
