/* eslint-disable react/prop-types */
import { Button, Flex, Input } from 'antd';
import { IoSearchOutline } from 'react-icons/io5';
import locales from '../../../../locales';
import styles from './Search.module.scss';
import useFetch from '../../../../hooks/useFetch';
import apiConfig from '../../../../constants/apiConfig';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import useDebounce from '../../../../hooks/useDebounce';
import ItemSearch from './ItemSearch';
import { CloseOutlined } from '@ant-design/icons';

const Search = ({ setOpenSearch }) => {
    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(true);
    const [searchResult, setSearchResult] = useState([]);
    const { execute, loading } = useFetch(apiConfig.product.getList);

    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }
        execute({
            params: {
                name: debouncedValue,
            },
            onCompleted: (response) => {
                setSearchResult(response?.data?.content);
            },
        });
    }, [debouncedValue]);
    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (searchValue.startsWith(' ')) {
            return;
        }
        setSearchValue(searchValue);
    };
    return (
        <Flex justify='center' align='flex-start' className={styles.wrapper}>
            <HeadlessTippy
                interactive
                visible={showResult}
                offset={[0, 10]}
                render={(attrs) => (
                    <Flex vertical className={styles.wrapperResult}>
                        {searchResult?.map((item) => (
                            <ItemSearch data={item} key={item.id} />
                        ))}
                    </Flex>
                )}
            >
                <Flex className={styles.searchWrapper}>
                    <Flex align='center' className={styles.search} placeholder={locales.searchProductPlaceHolder}>
                        <Flex align='center' className={styles.searchIcon}>
                            <IoSearchOutline size={24} />
                        </Flex>
                        <Input
                            type='text'
                            className={styles.inputSearch}
                            placeholder={locales.searchProductPlaceHolder}
                            onChange={handleChange}
                            onFocus={() => setShowResult(true)}
                        />
                    </Flex>
                    <Button shape='circle' className={styles.buttonClose} onClick={() => setOpenSearch(false)}>
                        <CloseOutlined />
                    </Button>
                </Flex>
            </HeadlessTippy>
        </Flex>
    );
};

export default Search;
