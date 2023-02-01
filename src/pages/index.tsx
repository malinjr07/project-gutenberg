import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { NextPage } from 'next';
import Cards from '@/components/Cards';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '@/components/Spinner';

const Home: NextPage = () => {
  const [bookList, setBookList] = useState<Array<any>>([]); // State for list of All book
  const [hasMore, setHasMore] = useState<boolean>(true); // A boolean state to check the current length of book list
  const [loader, setLoader] = useState<boolean>(true); // State to improve UX
  const [bookListUrl, setBookListUrl] = useState<string>(
    'https://gutendex.com/books'
  ); // API Endpoint
  const [inputTxt, setInputTxt] = useState<string>(''); // State for Input Field
  const [selectedBooks, setSelectedBooks] = useState<Array<any>>([]); // List of Selected Item

  /**
   * Function to Handle Data Update on Scroll
   */
  const updateBookList = async () => {
    const response = await axios.get(bookListUrl);
    const data = response.data.results;
    setBookList((prevData: any) => [...prevData, ...data]);
    setBookListUrl(response.data.next);

    /**
     * Checking if this is the "End of the Line"
     */
    if (data.length < 32) {
      setHasMore(false);
    }
  };

  /**
   * Initial Invocation and data fetching
   */

  useEffect(() => {
    (async () => {
      const response = await axios.get(bookListUrl);
      const data = response.data.results;
      setBookList(data);
      setBookListUrl(response.data.next);
      setLoader(false);
    })();
    return () => {
      setBookList([]);
      setSelectedBooks([]);
      setBookListUrl('https://gutendex.com/books');
    };
    //eslint-disable-next-line
  }, []);

  /**
   * @param e : SyntheticEvent
   *
   * Handle Search Function
   * Normally I use FormData for payload of complex/multiple data
   *
   */

  const handleSubmit = async (e: SyntheticEvent) => {
    setLoader(true);
    e.preventDefault();
    const url = `https://gutendex.com/books/?search=${inputTxt}`;
    const response = await axios.get(url);
    const data = response.data.results;
    setBookList(data);
    setBookListUrl(response.data.next);
    setLoader(false);
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
          value={inputTxt}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputTxt(e.target.value)
          }
        />
        <button type='submit' className='btn btn-square w-auto px-4 '>
          search
        </button>
      </form>
      <div className='flex flex-row w-2/3 justify-start gap-10 items-start  '>
        <div
          className='w-[500px] relative overflow-y-auto !h-[850px] pt-2 phone-4 bg-gray-200 rounded-xl block px-4 '
          id='scrollableDiv'
        >
          {loader ? (
            <Spinner />
          ) : (
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
          )}
        </div>
        <div className='w-[500px] overflow-y-auto !h-[850px] pt-2 phone-4 bg-gray-200 rounded-xl block px-4 '>
          {selectedBooks?.map((book: any, id: number) => (
            <Cards
              btnAction={() => {
                const itemIndex = selectedBooks.findIndex(
                  (value) => value.id === book.id
                );
                const tempArr = [...selectedBooks];
                tempArr.splice(itemIndex, 1);
                setSelectedBooks(tempArr);
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
