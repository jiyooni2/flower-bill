import Button from '@mui/material/Button';
import SearchLayout from 'renderer/components/SearchLayout/SearchLayout';
import Input from 'renderer/components/Input/Input';
import styles from './SellerPage.module.scss';


const SellerPage = () => {
  const titleData = [
    {title: '이름', titleEn: 'name'},
    {title: '사업자 번호', titleEn: 'storeNumber'},
    {title: '소유자 이름', titleEn: 'storeName'},
    {title: '주소', titleEn: 'adress'},
  ]
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <SearchLayout />
        </div>
        <div>
          <div className={styles.infoContent}>
            <h2>판매처 정보</h2>
            <div className={styles.list}>
              {
                titleData.map(({title, titleEn}, key) => (
                  <div className={styles.item} key={key}>
                    <p>{title}</p>
                    <Input inputName={titleEn}></Input>
                  </div>
                ))
              }
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
