import Image from 'next/image';
import React, { FC } from 'react';

type bookProp = {
  btnAction: () => void;
  btnTxt?: string;
  [key: string]: any;
};

const Cards: FC<bookProp> = (props) => {
  const {
    btnAction,
    title,
    authors,
    formats,
    isPicked,
    id,
    btnTxt = 'pick',
  } = props;
  return (
    <div className='card card-side bg-base-100 shadow-xl pr-5 w-full my-5 '>
      <figure className='w-40 h-60 relative '>
        <Image
          fill
          className='object-cover'
          src={
            (formats && formats['image/jpeg']) ||
            'https://www.gutenberg.org/cache/epub/2641/pg2641.cover.medium.jpg'
          }
          alt='Book Cover Image'
        />
      </figure>
      <div className='card-body pl-2 w-2/3 py-2 '>
        <h2 className='card-title'>{title}</h2>
        <h3 className='text-lg font-medium italic'>Authors</h3>

        <p className='ml-2 line-clamp-2'>
          {authors?.map((value: any, id: any) => value.name + ',')}
        </p>
        <div className='card-actions justify-end'>
          <button
            disabled={isPicked?.id === id}
            onClick={btnAction}
            type='button'
            className='btn btn-primary'
          >
            {isPicked?.id === id ? 'picked' : btnTxt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
