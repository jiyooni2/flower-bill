import { ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import Input from 'renderer/components/Input/Input';
import styles from './SellerPage.module.scss';

const SellerPage = () => {
  const USERS = [
    {storeName: 'abc', name: '홍길동1', storeNumber: '123', owner: '홍길동1', address: '마장동'},
    {storeName: 'def', name: '홍길동2', storeNumber: '456', owner: '홍길동2', address: '강동구'},
    {storeName: 'ghi', name: '홍길동3', storeNumber: '789', owner: '홍길동3', address: '군포시'},
  ];

  const [name, setName] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState(USERS);
  const [storeInfo, setStoreInfo] = useState([
    {name: '', storeNumber: '', owner: '', address: ''},
  ]);

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


  const changeDataHandler = (e:React.MouseEvent<HTMLElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }
    const dataName = e.target.dataset['name'];

    USERS.forEach((item) => {
      if(item.storeName === dataName) {
        setStoreInfo(
          [{ name: item.name, storeNumber: item.storeNumber , owner: item.owner, address: item.address}],
        );
      }
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
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
              <button onClick={changeDataHandler} data-name={storeName}>
                {storeName}
              </button>
            </li>
          ))
        ) : (
          <h1>검색 결과가 없습니다</h1>
        )}
        </div>
        </div>
        <div>
          <div className={styles.infoContent}>
            <h2>판매처 정보</h2>
            <div className={styles.list}>
              <div className={styles.item}>
                {storeInfo.map(({name,storeNumber, owner, address }, key) => (
                  <div key={key}>
                    <div className={styles.item}>
                      <p>이름</p>
                      <Input inputName="name" setValue={name} />
                    </div>
                    <div className={styles.item}>
                      <p>사업자 번호</p>
                      <Input inputName="name" setValue={storeNumber} />
                    </div>
                    <div className={styles.item}>
                      <p>소유자 이름</p>
                      <Input inputName="name" setValue={owner} />
                    </div>
                    <div className={styles.item}>
                      <p>주소</p>
                      <Input inputName="name" setValue={address} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.buttonList}>
              <Button variant="contained">삭제</Button>
              <Button variant="contained">수정</Button>
              <Button variant="contained">생성</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default SellerPage;
