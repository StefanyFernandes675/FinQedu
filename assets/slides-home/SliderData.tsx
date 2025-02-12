import {ImageSourcePropType} from 'react-native';

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  link: string;
};

export const ImageSlider = [
  {
    title: 'IB PREP',
    image: require('../ib_prep.png'),
    link: 'https://finqedu.com/investment-banking-prep/?utm_source=finqedu-app'
  },
  {
    title: 'IB Foundations',
    image: require('../ib-foundations.png'),
    link: 'https://finqedu.com/investment-banking-foundations/?utm_source=finqedu-app'
  },
  {
    title: 'IB Immersion',
    image: require('../ib-immersion.png'),
    link: 'https://finqedu.com/immersion/?utm_source=finqedu-app'
  },
  {
    title: 'FinQ News',
    image: require('../finq-news.png'),
    link: 'https://finqedu.com/finq-news/?utm_source=instagram&utm_medium=finqedu-app'
  },
  {
    title: 'Wall Street Trek',
    image: require('../wall-stret-trek.png'),
    link: 'https://finqedu.com/finq-wall-street-trek/?utm_source=finqedu-app'
  },
]