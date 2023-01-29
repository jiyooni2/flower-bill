// import { useState, useEffect } from 'react';
// import Input from 'renderer/components/Input/Input';
// import styles from './SearchLayout.module.scss';

// const SearchLayout = () => {
//   const storeList = [
//     {title: 'a'},
//     {title: 'b'},
//     {title: 'c'},
//   ]

//   useEffect(() => {
//     console.log("ref:", inputRef);
//   });



//   return (
//     <div className={styles.container}>
//       <Input isSearchInput inputName='search' placeholderText="판매처를 입력하세요" />
//       <div className={styles.content}>
//         {storeList.map(({title}, key) => (
//           <button className={styles.listItem} key={key}>{title}</button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchLayout;

import { ChangeEvent, useState } from 'react'

const SearchLayout = () => {
  const USERS = [
    {storeName: 'abc', storeInfo: [ {name: '홍길동1', storeNumber: '123', owner: '홍길동1', address: 'abc'}  ]},
    {storeName: 'def', storeInfo: [ {name: '홍길동2', storeNumber: '123', owner: '홍길동2', address: 'abc'}  ]},
    {storeName: 'ghi', storeInfo: [ {name: '홍길동3', storeNumber: '123', owner: '홍길동2', address: 'abc'}  ]}
  ];
  const [name, setName] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState(USERS);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = USERS.filter((user) => {
        return user.storeName.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(USERS);
    }

    setName(keyword);
  };

  return (
    <>
      <div className="searchInputs">
        <input
          type="search"
          value={name}
          onChange={filter}
          placeholder="Filter"
        />
        <div className="user-list">
        {foundUsers && foundUsers.length > 0 ? (
          foundUsers.map(({storeName}, key) => (
            <li key={key}>
              {storeName}
            </li>
          ))
        ) : (
          <h1>검색 결과가 없습니다</h1>
        )}
        </div>
      </div>
    </>
  )
}

export default SearchLayout
