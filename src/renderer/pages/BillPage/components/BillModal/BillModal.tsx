import { Button, Typography } from '@mui/material';
// import { OrderProduct } from 'main/orderProduct/entities/orderProduct.entity';
import styles from './BillModal.module.scss';
// import Button from '@mui/material/Button';
import { useRecoilValue } from 'recoil';
import { memoState, orderProductsState, storeState } from 'renderer/recoil/states';
import Modal from './Modal';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillModal = ({ isOpen, setIsOpen }: IProps) => {
  // const [memo, setMemo] = useRecoilState(memoState);
  const orderProducts = useRecoilValue(orderProductsState);
  const memo = useRecoilValue(memoState);
  const store = useRecoilValue(storeState);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMemo(event.target.value);
  // };

  const handleClick = () => {
    setIsOpen(false);
    const orderProductInputs = orderProducts.map((orderProduct) => ({
      count: orderProduct.count,
      productId: orderProduct.product.id,
      orderPrice: orderProduct.orderPrice,
    }));

    const bill = {
      storeId: store.id,
      memo,
      orderProductInputs,
    };

    window.electron.ipcRenderer.sendMessage('create-bill', bill);
  };

  let sum = 0;
  orderProducts.map((items) => {
    sum += items.orderPrice * items.count;
  });

  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div style={{ height: '490px'}}>
        <table
          style={{ width: '100%', border: '0' }}
          cellPadding="0"
          cellSpacing="0"
          className="title"
        >
          <tr>
            <td align="center">
              <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
                영&ensp;수&ensp;증
              </span>
            </td>
          </tr>

          <br />
        </table>
        <table
          style={{ width: '100%', border: '0' }}
          cellPadding="0"
          cellSpacing="0"
          className={styles.ownerData}
        >
          <tr>
            <td style={{ width: '45%' }}>
              <span style={{ fontSize: '10px', fontWeight: '400' }}>
                {' '}
                (공급받는자용)
              </span>
            </td>
            <td className={styles.name}>일지매 님</td>
            <td className={styles.for}>귀하</td>
          </tr>
        </table>
        <table
          style={{ width: '100%' }}
          cellPadding="0"
          cellSpacing="0"
          className={`${styles.tbl} ${styles.stamp}`}
        >
          <tr>
            <td
              style={{ width: '7%' }}
              rowSpan={5}
              align="center"
              className={styles.owner}
            >
              공 급 자
            </td>
            <th style={{ width: '18%' }}>
              사업자
              <br />
              등록번호
            </th>
            <td colSpan={3} className={styles.businessNumber}>
              {/* 사업자 번호 */}
            </td>
          </tr>
          <tr>
            <th>상호</th>
            <td style={{ width: '25%' }} align="center">
              {/* 상호 */}
            </td>
            <th style={{ width: '14%' }}>성명</th>
            <td style={{ width: '20%' }} align="center">
              {/* owner name */}
            </td>
          </tr>
          <tr>
            <th>
              사업자
              <br />
              소재지
            </th>
            <td colSpan={3} style={{ fontSize: '15px', textAlign: 'center' }}>
              {/* 가게 주소 */}
            </td>
          </tr>
          <tr>
            <th>업태</th>
            <td align="center">{/* 업태 */}</td>
            <th>종목</th>
            <td align="center">{/* 업종 */}</td>
          </tr>
        </table>
        <table
          width="100%"
          cellSpacing="0"
          cellPadding="0"
          className={styles.tbl}
        >
          <tr>
            <th>작성년월일</th>
            <th>공급대가총액</th>
            <th>비고</th>
          </tr>
          <tr>
            <td className={styles.date}>{`${year} . ${month} . ${day}`}</td>
            <td className={styles.total}>
              <span style={{ fontWeight: 'bold' }}>₩</span>{' '}
              {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </td>
            <td> </td>
          </tr>
        </table>
        <table
          width="100%"
          cellSpacing="0"
          cellPadding="0"
          className={styles.tbl}
        >
          <tr>
            <th>월일</th>
            <th>품목</th>
            <th>수량</th>
            <th>단가</th>
            <th>금액</th>
          </tr>
            {orderProducts.map((orderProduct) => {
              return (
                <tr key={orderProduct.id}>
                  <td className={styles.item}>{`${month} / ${day}`}</td>
                  <td className={styles.item}>{orderProduct.product.name}</td>
                  <td className={styles.article}>{orderProduct.count}</td>
                  <td className={styles.price}>{orderProduct.product.price}</td>
                  <td className={styles.sum}>{orderProduct.orderPrice}</td>
                </tr>
              );
            })}
        </table>
        <div className={styles.sumDiv}>
          <td className={styles.lastSum}>합&ensp;&ensp;계</td>
          <td style={{ float: 'right', marginRight: '10px', color: 'black' }}>
            ₩ {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={handleClick}
          style={{
            height: '30px',
            width: '90px',
            float: 'right',
            display: 'flex',
            bottom: '-10px',
            right: 0,
          }}
        >
          발행하기
        </Button>
      </div>
    </Modal>
  );
};

export default BillModal;
