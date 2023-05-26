import { Card, CardContent, Typography } from "@mui/material";
import { Bill } from "main/bill/entities/bill.entity";

type IProps = {
  bill: Bill;
  updated: boolean;
}

const DetailCard = ({ bill, updated }: IProps) => {
  const date = new Date(bill.updatedAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const convertNumber = (number : number) => {
    const num = number.toString();
    return `${num.slice(0, 3)} - ${num.slice(3, 5)} - ${num.slice(5, 10)}`;
  }

  return (
    <div
      style={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <Card
        sx={{
          backgroundColor: 'floralwhite',
          width: '100%',
          height: '100%',
          marginBottom: '15px',
        }}
      >
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: '3px', fontSize: '15px' }}
          >
            사&nbsp;업&nbsp;자&nbsp;명&nbsp;:
            <span style={{ color: 'black' }}>
              {bill.store ? ` ${bill.store.owner}` : ' 익명'}
            </span>
            <br />
            구&nbsp;매&nbsp;처&nbsp;명&nbsp;:{' '}
            <span style={{ color: 'black' }}>
              {bill.store ? bill.store?.name : '익명'}
            </span>
            <br />
            <span>
              사업자번호 :{' '}
              <span style={{ color: 'black' }}>
                {bill.store
                  ? convertNumber(bill.store.businessNumber)
                  : '익명'}
              </span>
            </span>
          </Typography>
          <br />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: '3px' }}
          >
            판&nbsp;&nbsp; 매&nbsp;&nbsp;일&nbsp;&nbsp;시 :{' '}
            <span style={{ color: 'black' }}>
              {`${year}년 ${month}월 ${day}일 `}
            </span>
            <span style={{ fontSize: '10px' }}>
              {updated ? '(수정됨)' : ''}
            </span>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: '3px', height: '52px' }}
          >
            <span>
              메모:{' '}
              <span style={{ color: 'black' }}>{bill.memo}</span>
            </span>
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
};

export default DetailCard;
