import cn from 'classnames';
import { Image } from 'react-native';

const legoImages: [string, string][] = [
  [
    '/front/lego/kirk.jpg',
    'Evan Bacon being interviewed about the construction of his life-size Lego Captain Kirk statue in Austin, 2013',
  ],
  [
    '/front/lego/evan-superman.jpg',
    'Evan Bacon with his life-size Lego Superman statue in Houston, May 2013',
  ],
  [
    '/front/lego/batman.jpg',
    'Evan Bacon with his Lego Batman statue in Austin, August 2011',
  ],

  ['/front/lego/stanlee.jpg', 'Stan Lee and Evan Bacon in Austin, 2013'],
  ['/front/lego/chrisevans.jpg', 'Chris Evans and Evan Bacon in Utah'],
];
const images: [string, string][] = [
  [
    '/front/evan-lydia-vercel.jpg',
    'Sebastian Markbåge, Addy Osmani, Lee Robinson, Evan Bacon, Lydia Hallie, JJ Kasper, Theo Browne, Sophie Alpert in San Francisco, 2023',
  ],
  [
    '/front/evan-ReactiveConf.jpg',
    'Evan Bacon discussing Progressive Web Apps at ReactiveConf in Prague, 2021',
  ],
  [
    '/front/evan-appjs.jpg',
    'Evan Bacon being interviewed about Expo Router v2 at App.js Conf in Kraków, 2023',
  ],
  //   [
  //     '/front/evan_stan-lee.jpg',
  //     'Evan Bacon explaining the internal structure of his life-size Lego Thor statue with Stan Lee, the creator of Thor, in Austin, 2013',
  //   ],

  [
    '/front/evan_charlie.jpg',
    'Evan Bacon and Charlie Cheever in Poland for App.js Conf 2023',
  ],

  [
    '/front/evan-react.jpg',
    'Ken Wheeler, Andrew Clark, Xuan Huang (黄玄), Evan Bacon, and Lydia Hallie in San Francisco 2022',
  ],
];

function MasonryPhotoGrid({ images }: { images: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {images.map(([src, alt], index) => (
        <div
          key={index}
          className={cn(
            'relative h-40 rounded-lg overflow-hidden object-cover',
            index === 1 ? 'h-full row-span-2' : 'h-40'
          )}
        >
          <Image
            alt={alt}
            source={{ uri: src }}
            resizeMode="cover"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}
export function MasonryPhotoGridOverview() {
  return <MasonryPhotoGrid images={images} />;
}

export function MasonryLegoGrid() {
  return <MasonryPhotoGrid images={legoImages} />;
}
