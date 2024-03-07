import React, { useState } from 'react';

import { User, UserResponse } from 'types/User';
import { fetchUserData } from 'configs/service';
import { API } from 'configs/api';
import InfinitySelect from 'common/InfinitySelect';
import { USERS_LIMIT } from 'utils/constants';
import { cx } from 'libs/classnames';
import './styled.css';

const UsersSelect: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastRequestedPage, setLastRequestedPage] = useState(0);
  const [lastStep, setLastStep] = useState(false);
  const [usersLimit, setUsersLimit] = useState(50);

  const loadUsers = async () => {
    if ((page !== lastRequestedPage) && !lastStep) {
      setLoading(true);
      try {
        const { data: responseData, meta }: UserResponse = await fetchUserData(API.users, {
          params: {
            page: page.toString(),
            limit: usersLimit.toString(),
          },
        });
        const { from, total } = meta;

        if (from >= total) {
          setLastStep(true);
        }

        if (responseData.length > 0) {
          setUsers((prevUsers) => [...prevUsers, ...responseData]);
          setPage((prevPage) => prevPage + 1);
          setLastRequestedPage((prevRequestedPage) => prevRequestedPage + 1);
        } else {
          console.error('No users data received');
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="users-select-container">
      <h2>Erik Hayrapetyan</h2>
      <a
        target="_blank"
        href="https://drive.google.com/file/d/1b5ZzR4Hhm7nBlVcYt6ss3yM2FKXk3f-w/view?usp=drivesdk"
        rel="noreferrer"
      >
        Ссылка на мой CV
      </a>
      <a
        target="_blank"
        href="https://www.linkedin.com/in/erik-hayrapetyan-141b60213?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
        rel="noreferrer"
      >
        Ссылка на мой Linkedin
      </a>

      <h2>Tusk</h2>

      <div className="limit-container">
        <div className="limit-title">LIMIT:</div>
        <div className="limits">
          {USERS_LIMIT.map((item) => {
            return (
              <div
                className={cx('limit', {
                  'active-limit': usersLimit === item.key,
                })}
                onClick={() => setUsersLimit(item.count)}
                key={item.key}
              >
                {item.count}
              </div>
            );
          })}
        </div>
      </div>
      <InfinitySelect title="Users" data={users} fetchData={loadUsers} loading={loading} />
    </div>
  );
};

export default UsersSelect;
