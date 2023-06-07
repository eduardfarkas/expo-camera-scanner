export type Ratio = {
    width: number;
    height: number;
    ratio: number;
    name?: string;
};

export const RATIOS: { [key: string]: Ratio } = {
    ratio_a4: { width: 210, height: 297, ratio: 210 / 297, name: "A4" },
    ratio_1to1: { width: 1, height: 1, ratio: 1 },
    ratio_2to3: { width: 2, height: 3, ratio: 2 / 3 },
    ratio_3to2: { width: 3, height: 2, ratio: 3 / 2 },
    ratio_1to2: { width: 1, height: 2, ratio: 1 / 2 },
    ratio_1to3: { width: 1, height: 3, ratio: 1 / 3 },
};

export const OVERLAY = {
    PADDING_HORIZONTAL: 40,
    PADDING_VERTICAL: 300,
};
