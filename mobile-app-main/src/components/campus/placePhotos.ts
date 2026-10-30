import type { ImageSourcePropType } from 'react-native';

type PlacePhoto = {
  image: ImageSourcePropType;
  author: string;
  sourceUrl: string;
  description: string;
};

export const photoLicenseUrl = 'https://creativecommons.org/licenses/by-sa/4.0/';

// Only attach photos to places whose identity can be matched to the source image.
export const placePhotos: Record<string, PlacePhoto> = {
  'way/710693843': {
    image: require('@/assets/images/campus/school-of-computing.jpg'),
    author: 'MediaMOF',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:School_of_Computing,_Federal_University_of_Technology,_Akure,_Ondo_State67.jpg',
    description: 'School of Computing exterior',
  },
  'way/502937318': {
    image: require('@/assets/images/campus/centre-for-continuing-education.jpg'),
    author: 'Favouridowu',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Centre_for_Continuing_Education,_Federal_University_of_Technology,_Akure,_Ondo_State..jpg',
    description: 'Centre for Continuing Education exterior',
  },
};
