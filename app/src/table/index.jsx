import { useState } from 'react';
import _ from 'lodash';

import { isNumber } from '../utils';
import Button from '../button/index';
import Popup from '../popup/index';


function fufuRender(props) {
    const { record, column } = props;

    const recordData = record[`${column.name}`];

    if (recordData instanceof Date)
        // return recordData.toISOString();
        return (
            <Popup
                trigger={
                    (
                        <Button onClick={() => {}} className={`fufu-action-button fufu-default-action fufu-filter`}>
                            {recordData.toISOString()}
                        </Button>
                    )
                }
                openOn="hover"
                direction='s'
            >
                <div>--.--.--.--.--.--.--.--</div>
            </Popup>
        )
    else if (recordData instanceof Array)
        return `[${recordData.length}]`;
    else if (recordData instanceof Object)
        return `${[Object.keys(recordData).join(', ')]}`
    else if (isNumber(recordData) || typeof recordData === 'string' || recordData instanceof String || typeof recordData === 'boolean' || recordData instanceof Boolean)
        return recordData;

    else
        return 'Data Not Comptible'
}

function fufuSort(data, sortColumn, sortOrder) {
    return _.orderBy(data, [sortColumn], [sortOrder]);
}

function fufuDirection(current) {
    switch (current) {
        case null:
            return 'asc'
        case 'asc':
            return 'desc';
        case 'desc':
        default:
            return null;
    }
}


function FufuTable({
    columns: propsColumns, data: propsData,
    title = '',
    className = '',
    index: indexExists = false,
    celled = false,
    hover = false,
    defaultPadding = 'small',
    tableActions = [],
    defaultSortColumn = null,
    defaultSortOrder = 'asc',
    sortFunction: customSortFunction = null
}) {

    const [padding, setPadding] = useState(defaultPadding);

    const [columns, setColumns] = useState(propsColumns.map(
        (column) => {
            return { ...column, sort: (column.name === defaultSortColumn) ? defaultSortOrder : null }
        }
    ));

    const sortColumn = columns.reduce((prev, curr) => { return (!!curr?.sort) ? curr : prev }, { name: '', title: '', sort: null });
    const sortName = sortColumn?.name;
    const sortOrder = sortColumn.sort;
    const sortFunction = (customSortFunction) ? customSortFunction : fufuSort;

    const [data, setData] = useState(((sortName) ? sortFunction(propsData, sortName, sortOrder) : propsData).map(
        (record, index) => {
            return { ...record, fufuInitialIndex: index }
        }
    ));

    const tableClass = (className) ? ` ${className}` : '';
    const tableCelled = (celled) ? ' fufu-celled' : '';
    const tableHoverable = (hover) ? ' fufu-hover' : '';
    const tablePadding = ` fufu-${padding}`;


    const sortDirection = (_e, { name }) => {
        let order = sortOrder;
        setColumns(columns.map(
            (column) => {
                if (column.name === name) {
                    const newOrder = fufuDirection((column.sort) ? column.sort : null);
                    order = newOrder;
                    return { ...column, sort: newOrder }
                }
                return { ...column, sort: null }
            }
        ));

        if (order)
            setData(sortFunction(data, name, order));
        else
            setData(sortFunction(data, 'fufuInitialIndex', 'asc'));
    }

    return (
        <div className={`fufu-table-wrapper${tableClass}`}>
            <table className={`fufu-table${tablePadding}${tableHoverable}${tableCelled}${tableClass}`}>
                <thead className={`fufu-table-header${tableClass}`}>
                    <tr className={`fufu-table-row fufu-header-row fufu-header-actions${tableClass}`}>
                        <th colSpan={100} className={`fufu-table-row fufu-actions-cell${tableClass}`}>
                            <div className='fufu-actions-wrapper'>
                                <div className='fufu-table-actions custom-actions'>
                                    <Button key={`fufu-custom-action-load`} className={`fufu-action-button fufu-custom-action fufu-load`}>
                                        {(data.length > 0) ? 'Reload' : 'Load'} Data
                                    </Button>
                                    <Button key={`fufu-custom-action-export`} className={`fufu-action-button fufu-custom-action fufu-export`}>Export</Button>
                                    {
                                        tableActions.map(
                                            (action, index) => {
                                                const {
                                                    onClick: actionOnClick, name: actionName, title: actionTitle,
                                                    loading: actionLoading = false, disabled: actionDisabled = false
                                                } = action;
                                                return (
                                                    <Button
                                                        className={`fufu-action-button fufu-custom-action ${actionName}`}
                                                        key={`fufu-custom-action-${index}`}
                                                        onClick={actionOnClick}
                                                        name={actionName}
                                                        loading={actionLoading}
                                                        disabled={actionDisabled}
                                                    >
                                                        {actionTitle}
                                                    </Button>
                                                )
                                            }
                                        )
                                    }
                                </div>
                                <div className='fufu-title-wrapper'>
                                    {
                                        (title)
                                            ? (<label>{title}</label>)
                                            : undefined
                                    }
                                </div>
                                <div className='fufu-table-actions default-actions'>
                                    <Popup
                                        trigger={
                                            (
                                                <Button name="fufu-filter" onClick={() => { console.log('handle filters') }} ghost className={`fufu-action-button fufu-default-action fufu-filter`}>
                                                    <svg className="fufu-icon" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <g id="fufu-Product-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <g id="ic_fluent_filter_28_filled" fill="#212121" fillRule="nonzero">
                                                                <path d="M17,19 C17.5522847,19 18,19.4477153 18,20 C18,20.5522847 17.5522847,21 17,21 L11,21 C10.4477153,21 10,20.5522847 10,20 C10,19.4477153 10.4477153,19 11,19 L17,19 Z M21,13 C21.5522847,13 22,13.4477153 22,14 C22,14.5522847 21.5522847,15 21,15 L7,15 C6.44771525,15 6,14.5522847 6,14 C6,13.4477153 6.44771525,13 7,13 L21,13 Z M24,7 C24.5522847,7 25,7.44771525 25,8 C25,8.55228475 24.5522847,9 24,9 L4,9 C3.44771525,9 3,8.55228475 3,8 C3,7.44771525 3.44771525,7 4,7 L24,7 Z" id="fufu-Color0">
                                                                </path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </Button>
                                            )
                                        }
                                        openOn="click"
                                        direction='n'
                                    >
                                        <div>--.--.--.--.--.--.--.--</div>
                                    </Popup>
                                    <Button name="fufu-filter" onClick={() => { console.log('handle stats') }} ghost className={`fufu-action-button fufu-default-action fufu-stats`}>
                                        <svg className="fufu-icon" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g id="fufu-System-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g id="ic_fluent_data_pie_24_filled" fill="#212121" fillRule="nonzero">
                                                    <path d="M10.25,4.25 C10.6642136,4.25 11,4.58578644 11,5 L11,13 L19,13 C19.3796958,13 19.693491,13.2821535 19.7431534,13.648229 L19.75,13.75 C19.75,18.7205627 15.7205627,22.25 10.75,22.25 C5.77943725,22.25 1.75,18.2205627 1.75,13.25 C1.75,8.27943725 5.27943725,4.25 10.25,4.25 Z M13.25,1.75 C18.2205627,1.75 22.25,5.77943725 22.25,10.75 C22.25,11.1642136 21.9142136,11.5 21.5,11.5 L21.5,11.5 L13.25,11.5 C12.8357864,11.5 12.5,11.1642136 12.5,10.75 L12.5,10.75 L12.5,2.5 C12.5,2.08578644 12.8357864,1.75 13.25,1.75 Z" id="fufu-Color1">
                                                    </path>
                                                </g>
                                            </g>
                                        </svg>
                                    </Button>
                                    <Button name="fufu-filter" onClick={() => { console.log('handle filters') }} ghost className={`fufu-action-button fufu-default-action fufu-settings`}>
                                        <svg className="fufu-icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.9818 21.6364L21.7093 22.3948C22.0671 22.5518 22.4849 22.4657 22.7517 22.1799C23.9944 20.8492 24.9198 19.2536 25.4586 17.5131C25.5748 17.1376 25.441 16.7296 25.1251 16.4965L23.5988 15.3698C23.1628 15.0489 22.9 14.5403 22.9 13.9994C22.9 13.4586 23.1628 12.95 23.5978 12.6297L25.1228 11.5035C25.4386 11.2703 25.5723 10.8623 25.4561 10.487C24.9172 8.74611 23.9912 7.1504 22.7478 5.81991C22.4807 5.53405 22.0626 5.44818 21.7048 5.60568L19.9843 6.36294C19.769 6.45838 19.5385 6.507 19.3055 6.50663C18.4387 6.50572 17.7116 5.85221 17.617 4.98937L17.4079 3.11017C17.3643 2.71823 17.077 2.39734 16.6928 2.31149C15.8128 2.11485 14.9147 2.01047 14.0131 2.00006C13.0891 2.01071 12.19 2.11504 11.3089 2.31138C10.9245 2.39704 10.637 2.71803 10.5933 3.11017L10.3844 4.98794C10.3244 5.52527 10.0133 6.00264 9.54617 6.27415C9.07696 6.54881 8.50793 6.58168 8.01296 6.36404L6.29276 5.60691C5.93492 5.44941 5.51684 5.53528 5.24971 5.82114C4.00637 7.15163 3.08038 8.74734 2.54142 10.4882C2.42513 10.8638 2.55914 11.272 2.87529 11.5051L4.40162 12.6306C4.83721 12.9512 5.09414 13.4598 5.09414 14.0007C5.09414 14.5415 4.83721 15.0501 4.40219 15.3703L2.8749 16.4977C2.55922 16.7307 2.42533 17.1384 2.54122 17.5137C3.07924 19.2561 4.00474 20.8536 5.24806 22.1859C5.51493 22.4718 5.93281 22.558 6.29071 22.4009L8.01859 21.6424C8.51117 21.4269 9.07783 21.4586 9.54452 21.7281C10.0112 21.9976 10.3225 22.4731 10.3834 23.0093L10.5908 24.8855C10.6336 25.273 10.9148 25.5917 11.2933 25.682C13.0725 26.1061 14.9263 26.1061 16.7055 25.682C17.084 25.5917 17.3651 25.273 17.408 24.8855L17.6157 23.0066C17.675 22.4693 17.9729 21.9924 18.44 21.7219C18.9071 21.4515 19.4876 21.4197 19.9818 21.6364ZM14 18C11.7909 18 10 16.2091 10 14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14C18 16.2091 16.2091 18 14 18Z" fill="#212121" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr className={`fufu-table-row fufu-header-row fufu-columns${tableClass}`}>
                        {
                            (indexExists)
                                ? (
                                    <th key={`fufu-th-index`} className={`fufu-table-cell fufu-header-cell fufu-center fufu-index${tableClass}`}>
                                        <div className='fufu-column-wrapper'><label>#</label></div>
                                    </th>
                                )
                                : undefined
                        }
                        {
                            columns.map((column, index) => {
                                const textAlign = (column?.textAlign) ? column.textAlign : 'center';
                                const sortColumnActive = sortName === column.name;
                                const sortClass = (sortColumnActive) ? ` fufu-sort ${sortOrder}` : '';
                                return (
                                    <th key={`fufu-th-${index}`} className={`fufu-table-cell fufu-header-cell fufu-${textAlign}${sortClass} ${column.name}${tableClass}`}>
                                        <div className='fufu-column-wrapper'>
                                            <Button name={column.name} onClick={sortDirection} ghost className={`fufu-sort-button${sortClass}`}>
                                                <label>{column.title}</label>
                                                <svg className="fufu-icon" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.1018 8C5.02785 8 4.45387 9.2649 5.16108 10.0731L10.6829 16.3838C11.3801 17.1806 12.6197 17.1806 13.3169 16.3838L18.8388 10.0731C19.5459 9.2649 18.972 8 17.898 8H6.1018Z" fill="#212121" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </th>
                                );
                            })
                        }
                    </tr>

                </thead>
                <tbody className={`fufu-table-body${tableClass}`}>
                    {
                        (data.length > 0)
                            ? data.map(
                                (record, index) => {
                                    return (
                                        <tr key={`fufu-tr-${index}`} className={`fufu-table-row fufu-body-row${tableClass}`}>
                                            {
                                                (indexExists)
                                                    ? (
                                                        <td key={`fufu-td-index`} className={`fufu-table-cell fufu-body-cell fufu-center fufu-index${tableClass}`}>
                                                            {index + 1}
                                                        </td>
                                                    )
                                                    : undefined
                                            }
                                            {
                                                columns.map(
                                                    (column, index) => {
                                                        const textAlign = (column?.textAlign) ? column.textAlign : 'center';
                                                        return (
                                                            <td key={`fufu-td-${index}`} className={`fufu-table-cell fufu-body-cell fufu-${textAlign} ${column.name}${tableClass}`}>
                                                                {fufuRender({ record, column })}
                                                            </td>
                                                        )
                                                    }
                                                )
                                            }
                                        </tr>
                                    );
                                }
                            )
                            : (
                                <tr key={`fufu-tr-no-data`}>
                                    <td>Test!</td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </div>
    );
}

export default FufuTable;