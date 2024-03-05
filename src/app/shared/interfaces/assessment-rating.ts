export interface AssessmentRating {
    [aspectName: string]: {
        [criterionName: string]: number;
    };
};
