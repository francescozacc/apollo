import React, { useState } from 'react';
import { Transfer } from 'antd';
import _ from 'lodash';
import { AppTable } from './Table';
import { Link } from 'react-router-dom';
import { AppButton } from '../common/Button';
import { transferTableColumns } from '../utils/tableColumns';
import './TableTransfer.css';

export const TableTransfer = ({
  data,
  searchColumns,
  rightColTitles,
  leftColTitles,
  selectGroup,
  predefinedGroups,
  linkTo,
  addSearch,
  match,
  ...props
}) => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [showSearch] = useState(!!searchColumns);
  const formattedData = data.map(({ id, ...rest }) => ({ ...rest, key: id.toString() }));

  const handleSearch = (inputValue, item) =>
    searchColumns.map(searchCol => item[searchCol] && item[searchCol].indexOf(inputValue) !== -1).includes(true);

  const handleGroupSelection = predefinedGroupId => {
    const keys = selectGroup(predefinedGroupId);
    const addedKeys = _.difference(keys, targetKeys);
    if (addedKeys.length) {
      setTargetKeys([...targetKeys, ...addedKeys]);
    } else {
      setTargetKeys(_.difference(targetKeys, keys));
    }
  };
  const currentTable = match.url.split('/').pop();
  return (
    <>
      <div className="submit-transfer-table">
        <Link
          to={{
            pathname: linkTo,
            search: `${addSearch}=${targetKeys}`,
          }}
        >
          <AppButton
            label={`Select your ${currentTable}`}
            disabled={!targetKeys.length}
            className={'table-submit-button'}
            type="primary"
          />
        </Link>
      </div>
      <Transfer
        className="table-transfer"
        dataSource={formattedData}
        filterOption={handleSearch}
        showSelectAll={false}
        targetKeys={targetKeys}
        showSearch={showSearch}
        onChange={targetKeys => setTargetKeys(targetKeys)}
        titles={[`Please select at least one ${currentTable}`, `Selected items`]}
        {...props}
      >
        {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys }) => {
          const columns =
            direction === 'left' ? transferTableColumns(leftColTitles) : transferTableColumns(rightColTitles);
          const scroll = direction === 'left' ? { x: 900, y: 580 } : { x: 400, y: 580 };
          return (
            <div>
              {direction === 'left' && (
                <div className="header-left-transfer-table">
                  {predefinedGroups.map(({ id, name }) => (
                    <AppButton
                      key={id}
                      label={name}
                      className={'table-button'}
                      onClick={() => handleGroupSelection(id)}
                      icon={'block'}
                    />
                  ))}
                </div>
              )}
              {direction === 'right' && (
                <div>
                  <AppButton label={'Reset'} className={'table-button'} onClick={() => setTargetKeys([])} />
                </div>
              )}
              <AppTable
                columns={columns}
                data={filteredItems}
                onItemSelectAll={onItemSelectAll}
                onItemSelect={onItemSelect}
                selectedKeys={selectedKeys}
                scroll={scroll}
                linkTo={linkTo}
                addSearch={`${addSearch}=`}
                setTargetKeys={setTargetKeys}
                targetKeys={targetKeys}
                showSelection={true}
              />
            </div>
          );
        }}
      </Transfer>
    </>
  );
};
