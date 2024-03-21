export interface AssessmentRating {
    [dimensionName: string]: {
        [sentence: string]: number;
    };
};
