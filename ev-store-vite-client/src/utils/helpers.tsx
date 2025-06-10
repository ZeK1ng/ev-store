export const getImageUrl = (imageId: number): string => {
    return `/api/v1/image?imageId=${imageId}`;
};
