import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './BillsPage.module.scss';
import { useRecoilValue } from 'recoil';
import { businessState } from 'renderer/recoil/states';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getMonth, getYear } from 'date-fns';
import { useState } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

interface IProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateBox = ({ date, setDate }: IProps) => {
  const business = useRecoilValue(businessState);

  const handleChange = (event: any) => {
    setDate(event);
  };

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'left',
      }}
    >
      <DatePicker
        dateFormat="yyyy년 MM월 dd일"
        selected={date}
        onChange={handleChange}
        minDate={new Date(business.createdAt)}
        maxDate={new Date()}
        customInput={
          <input
            className={styles.searchInput}
            value={
              date !== null
                ? `${date?.getFullYear()} / ${
                    date?.getMonth() - 1
                  } / ${date?.getDate()}`
                : ''
            }
            style={{ width: '237px' }}
          />
        }
        placeholderText="날짜를 선택하세요"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.customHeaderContainer}>
            <button
              type="button"
              onClick={decreaseMonth}
              className={`${styles.monthButton} ${styles.initialButton}`}
              disabled={prevMonthButtonDisabled}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft style={{ color: 'white' }} />
            </button>
            <div>
              <span className={styles.month}>{MONTHS[getMonth(date)]} </span>
              <span className={styles.year}>{getYear(date)}</span>
            </div>
            <button
              type="button"
              onClick={increaseMonth}
              className={`${styles.monthButton} ${styles.initialButton}`}
              disabled={nextMonthButtonDisabled}
              style={{
                cursor: 'pointer',
              }}
            >
              <ChevronRight style={{ color: 'white' }} />
            </button>
          </div>
        )}
      />
      <button
        className={styles.initialButton}
        style={{ marginTop: '15px', marginLeft: '7px', cursor: 'pointer' }}
        onClick={() => setDate(null)}
      >
        <RestartAltIcon style={{ fontSize: "23px"}} />
      </button>
    </div>
  );
};

export default DateBox;
