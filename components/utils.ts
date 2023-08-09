
export interface Rectangle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface Bin {
  width: number;
  height: number;
}

export interface ChildDivProps {
  id: number;
  width: number;
  height: number;
}

export interface DropDownItem {
  label: string;
  value: string;
}

export const parseToFloat = (value: number) => parseFloat(value.toFixed(2));

export const cmToPixels = (cm: number) => {
  const dpi = 300;
  const inches = cm / 2.54;
  const pixels = parseToFloat(inches * dpi);
  return pixels;
};