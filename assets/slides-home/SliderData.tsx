import {ImageSourcePropType} from 'react-native';

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  link: string;
};

export const ImageSlider = [
  {
    title: 'Mentor Tiago',
    image: require('../finq-linkedin-tiago.png'),
    link: 'https://www.linkedin.com/in/tiagofrahmsaito/'
  },
  {
    title: 'Mentor Marcos',
    image: require('../finq-linkedin-marcos.png'),
    link: 'https://www.linkedin.com/in/marcos-toti/'
    
  },
]