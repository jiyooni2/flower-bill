import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

const CreateStoreForm = () => {
  const [owner, setOwner] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [ownerID, setOwnerID] = useState<string>('');

  const changeOwnerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value);
  };

  const changeNicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const changePWHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const changeIDHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerID(e.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newOwner = {
      owner,
      nickname,
      password,
      ownerID,
    };

    if ( owner === '' || nickname === '' || password === '' || ownerID === '' ) {
      window.alert(`새 사업자를 생성할 수 없습니다.${'\n'}모든 빈칸을 채워주세요.`);
    } else {
      if (window.confirm('정말 생성하시겠습니까?')) {
        window.electron.ipcRenderer.sendMessage('create-owner', newOwner);
        console.log(newOwner);
      }
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '17px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            fontWeight: '500',
            fontSize: '24px',
          }}
        >
          사업자 등록하기
        </Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업 대표자 성명"
              name="owner"
              variant="filled"
              onChange={changeOwnerHandler}
              value={owner}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="사업 대표자 별명"
              name="nickname"
              variant="filled"
              onChange={changeNicknameHandler}
              value={nickname}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              label="아이디"
              name="id"
              variant="filled"
              onChange={changeIDHandler}
              value={ownerID}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              sx={{ width: '90%' }}
              type="password"
              label="비밀번호"
              name="password"
              variant="filled"
              onChange={changePWHandler}
              value={password}
            />
          </div>
          <Button
            type="submit"
            variant="text"
            sx={{ marginTop: '26px', float: 'right', marginRight: '7px' }}
          >
            제출하기
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateStoreForm;
