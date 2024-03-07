import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { User } from 'types/User';
import useClickOutside from 'hooks/useClickOutside';
import { cx } from 'libs/classnames';
import { Index } from 'assets/icons';

import './styled.css';

interface IInfinitySelect {
    data: User[];
    loading: boolean;
    title?: string;
    fetchData: () => void;
}

const InfinitySelect = ({ data = [], fetchData, loading = false, title = '' }: IInfinitySelect) => {
  const [selectedOption, setSelectedOption] = useState<User | null>(null);
  const [isShowModal, steIsShowModal] = useState(false);
  const [isFirstRender, steIsFirstRender] = useState(true);

  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(contentRef, () => steIsShowModal(false));

  const handleScroll = useCallback(() => {
    if (
      optionsContainerRef.current
            && optionsContainerRef.current.scrollTop + optionsContainerRef.current.clientHeight
            >= optionsContainerRef.current.scrollHeight - 1
            && !loading
    ) {
      fetchData();
    }
  }, [fetchData, loading]);

  const handleToggleModal = () => {
    steIsShowModal((prevState) => !prevState);
  };

  const handleSelectOption = (option: User) => {
    setSelectedOption(option);
    steIsShowModal(false);
  };

  useEffect(() => {
    const container = optionsContainerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isShowModal && isFirstRender) {
      fetchData();
      steIsFirstRender(false);
    }
  }, [fetchData, isFirstRender, isShowModal]);

  return (
    <div>
      {title && <div className="title">{title}</div>}

      <div
        ref={contentRef}
        className="container"
      >
        <div className="select-container">
          <div
            onClick={handleToggleModal}
            className={cx('selected-option', {
              placeholder: !selectedOption,
              'selected-option-active': isShowModal,
            })}
          >
            <div className="selected-option-text">
              {selectedOption ? `${selectedOption.last_name} ${selectedOption.first_name}, ${selectedOption.job ?? 'Unknown'}`
                : 'Please select option'}
            </div>

            <div
              className={cx('chevron', {
                'chevron-rotate': isShowModal,
              })}
            >
              <Index.ChevronDown />
            </div>
          </div>

          <div
            className={cx('options-container', {
              'options-container-hidden': !isShowModal,
            })}
            ref={optionsContainerRef}
          >
            {data.map((user) => (
              <div
                className={cx('option', {
                  'active-option': user.id === selectedOption?.id,
                })}
                key={user.id}
                onClick={() => handleSelectOption(user)}
              >
                <div className="logo">
                  <span className="logo-text">
                    {user.last_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <span>
                  {`${user.last_name} ${user.first_name}, ${user.job ?? 'Unknown'}`}
                </span>
              </div>
            ))}
            {loading && <div className="loading">Loading...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfinitySelect;
