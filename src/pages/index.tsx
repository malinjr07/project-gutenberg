import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Cards from '@/components/Cards';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '@/components/Spinner';

const Home: NextPage = () => {
  const [bookList, setBookList] = useState<Array<any>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [bookListUrl, setBookListUrl] = useState<string>(
    'https://gutendex.com/books'
  );
  const [selectedBooks, setSelectedBooks] = useState<Array<any>>();

  const updateBookList = async () => {
    console.log(
      '🚀 ~ file: index.tsx:16 ~ updateBookList ~ updateBookList',
      bookListUrl
    );
    const response = await axios.get(bookListUrl);
    const data = response.data.results;
    setBookList((prevData: any) => [...prevData, ...data]);
    setBookListUrl(response.data.next);
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get(bookListUrl);
      const data = response.data.results;
      setBookList(data);
      setBookListUrl(response.data.next);
    })();
    return () => {
      setBookList([]);
      setSelectedBooks([]);
      setBookListUrl('https://gutendex.com/books');
    };
    //eslint-disable-next-line
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <section className='w-screen min-h-screen flex flex-col justify-start pt-10 items-center gap-6 '>
      <form
        className='w-2/3 flex flex-row input-group justify-start items-center'
        method='post'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          placeholder='Search for…'
          className='input input-bordered w-4/5 '
        />
        <button type='submit' className='btn btn-square w-auto px-4 '>
          search
        </button>
      </form>
      <div className='flex flex-row gap-6'>
        <div
          className='w-[500px] relative overflow-y-auto !h-[850px] pt-2 phone-4 bg-gray-200 rounded-xl block px-4 '
          id='scrollableDiv'
        >
          <InfiniteScroll
            dataLength={bookList.length}
            next={updateBookList}
            scrollableTarget='scrollableDiv'
            hasMore={hasMore}
            loader={<Spinner />}
            className='overflow-hidden'
            endMessage={<h4>Nothing more to show</h4>}
          >
            {bookList?.map((book: any, id: number) => (
              <Cards
                btnAction={() => {
                  setSelectedBooks((prev: any) => [book, ...prev]);
                }}
                key={id}
                isPicked={selectedBooks?.find((el: any) => el.id === book.id)}
                {...book}
              />
            ))}
          </InfiniteScroll>
        </div>
        <div className='w-[500px] overflow-y-auto !h-[800px] pt-2 phone-4 bg-gray-200 rounded-xl block px-4 '>
          {selectedBooks?.map((book: any, id: number) => (
            <Cards
              btnAction={() => {
                const temArr = [...selectedBooks];
                temArr.splice(book.id, 1);
                setSelectedBooks(temArr);
                console.log('the remove button clicked');
              }}
              btnTxt='remove'
              key={id}
              {...book}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Home;
