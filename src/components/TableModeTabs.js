import {
  useState, useEffect, useRef, Fragment
} from 'react';
import PropTypes from 'prop-types';
import TableMain from 'src/components/TableMain';
import InfoDialog from 'src/components/base/InfoDialog';
import LoadingButton from '@material-ui/lab/LoadingButton';
import moment from 'moment';
import { FormControlLabel, Switch } from '@material-ui/core';
import { boolToNum, addSnackbar } from 'src/helpers';
import DeleteConfirmDialog from 'src/components/base/DeleteConfirmDialog';
import PopoverComment from 'src/components/PopoverComment';
import PopoverFilter from 'src/components/PopoverFilter';

const TableModeTabs = ({ mappingData }) => {
  const mounted = useRef();
  const [isEdit, setEdit] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [dataTable, setDataTable] = useState(mappingData.dataTable);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingTableTab, setLoadingTableTab] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isOpenDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [optionEnum, setOptionEnum] = useState(mappingData.optionEnum);
  const [currentDetail, setCurrentDetail] = useState(mappingData.currentDetail);
  const [subTables, setSubTables] = useState([]);
  const [anchorReasonEl, setAnchorReasonEl] = useState(null);
  const [anchorCommentEl, setAnchorCommentEl] = useState(null);
  const [isModeApprove, setModeApprove] = useState(false);
  const [chartOptions, setChartOptions] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtersForm, setFiltersForm] = useState({
    dateRange: [null, null],
    approveStatus: 'InProgress'
  });

  const detailViewMode = () => {
    if (!isModeApprove) {
      if (currentDetail.lc_status !== 'New' || !currentDetail.lc_status) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  };

  const setDataChart = (isApprove) => {
    mappingData.fetchDataChart(boolToNum(isApprove), (data) => {
      const {
        opens, inprocess, approved, reject
      } = data.dataChart;
      const total = opens + approved + inprocess + reject;
      const chart = {
        options: {
          dataLabels: {
            enabled: false
          },
          tooltip: {
            enabled: !!total
          },
          colors: ['rgb(0, 143, 251)', 'rgb(254, 176, 25)', 'rgb(0, 227, 150)', 'rgb(255, 69, 96)'],
          labels: ['Mới', 'Đang xử lý', 'Đã duyệt', 'Từ chối'],
          legend: {
            labels: {
              colors: 'primary.main'
            }
          }
        },
        series: total ? [opens, inprocess, approved, reject] : [1, 1, 1, 1],
        total
      };
      setChartOptions(chart);
    });
  };

  useEffect(() => {
    if (!mounted.current) {
      // mounted
      mounted.current = true;
      setLoadingMain(true);
      mappingData.init((data) => {
        setLoadingMain(false);
        setOptionEnum(data.optionEnum);
        setDataTable(data.dataTable);
      });
      setDataChart(isModeApprove);
    } else {
      // TODO
    }
  });

  const doSearch = (keyword, columns) => {
    const data = mappingData.dataTable.filter((item) => {
      const contains = [];
      columns.forEach((column) => {
        if (`${item[column]}`.toUpperCase().includes(keyword.toUpperCase())) {
          contains.push(column);
        }
      });
      return !!contains.length;
    });
    setDataTable(data);
  };

  const doSubmitDelete = async () => {
    const [rowData] = selected;
    const url = `${mappingData.mainTable}/${rowData.id}`;
    mappingData.deleteDataTable(url, (data) => {
      setSelected([]);
      setDataTable(data.dataTable);
      setOpenDeleteConfirm(false);
    });
  };

  const doClickRow = (rowData) => {
    mappingData.setCurrentDetail(rowData);
    setCurrentDetail(mappingData.currentDetail);
    setLoadingTableTab(true);
    mappingData.fetchDataTabs(rowData.id, (data) => {
      setSubTables([...data.subTables]);
      setLoadingTableTab(false);
    });
    setEdit(true);
    setOpenModal(true);
  };

  const filterDataTable = (value = {}) => {
    const [fromDate, toDate] = filtersForm.dateRange;
    const { pageNo } = value;
    if (!pageNo) {
      setPage(1);
      Object.assign(value, { pageNo: 1 });
    }
    const opts = {
      params: {
        fromDate: moment(fromDate).toISOString(),
        toDate: moment(toDate).toISOString(),
        isApprove: boolToNum(isModeApprove),
        ApprovalStatusCombo: filtersForm.approveStatus,
        pageNo: page,
        numberRows: rowsPerPage,
        ...value
      }
    };
    if (!opts.params.isApprove) {
      delete opts.params.ApprovalStatusCombo;
    }
    // setLoadingMain(true);
    mappingData.fetchDataTable(opts, (data) => {
      // setLoadingMain(false);
      setDataTable(data.dataTable);
    });
  };

  const updateFilterForm = (obj = {}) => {
    const filters = { ...filtersForm, ...obj };
    setFiltersForm(filters);
  };

  const doSendReview = () => {
    setLoadingSave(true);
    mappingData.sentApprove((data) => {
      addSnackbar('success', 'Gửi duyệt thành công !!!');
      setLoadingSave(false);
      setOpenModal(false);
      setDataTable(data.dataTable);
      setDataChart(isModeApprove);
    });
  };

  const doAcceptReview = () => {
    setLoadingSave(true);
    mappingData.doApprove((data) => {
      addSnackbar('success', 'Phê duyệt thành công !!!');
      setLoadingSave(false);
      setOpenModal(false);
      setDataTable(data.dataTable);
      setDataChart(isModeApprove);
    });
  };

  const doCancelAcceptReview = () => {
    console.log('doCancelAcceptReview', currentDetail);
    setOpenModal(false);
  };

  const onRejectReview = (event) => {
    setAnchorReasonEl(event.currentTarget);
  };

  const onComment = (event) => {
    setAnchorCommentEl(event.currentTarget);
  };

  const doComment = (comment) => {
    setLoadingSave(true);
    mappingData.doComment(comment, (data) => {
      addSnackbar('success', 'Bình luận thành công !!!');
      setLoadingSave(false);
    });
  };

  const doRejectReview = (reason) => {
    setLoadingSave(true);
    mappingData.doReject(reason, (data) => {
      addSnackbar('success', 'Từ chối duyệt thành công !!!');
      setLoadingSave(false);
      setOpenModal(false);
      setDataTable(data.dataTable);
      setDataChart(isModeApprove);
    });
  };

  const doChangePage = (event, newPage) => {
    setPage(newPage);
    filterDataTable({ pageNo: newPage });
  };

  const doChangeRowsPerPage = (event) => {
    const rows = parseInt(event.target.value, 10);
    setRowsPerPage(rows);
    filterDataTable({ numberRows: rows });
  };

  const doChangeApproveMode = (event) => {
    const isApprove = event.target.checked;
    mappingData.setModeApprove(isApprove);
    setModeApprove(isApprove);
    updateFilterForm({ approveStatus: 'InProgress' });
    filterDataTable({ isApprove: boolToNum(isApprove), ApprovalStatusCombo: 'InProgress' });
    setDataChart(isApprove);
  };

  const doSubmitFilters = () => {
    filterDataTable();
  };

  const doClearFilters = () => {
    updateFilterForm(
      {
        dateRange: [null, null],
        approveStatus: isModeApprove ? 'InProgress' : ''
      }
    );
  };

  const actionReview = () => {
    if (isModeApprove) {
      switch (currentDetail.lc_status) {
        case 'New':
          break;
        case 'InProgress':
          if (filtersForm.approveStatus === 'InProgress') {
            return (
              <Fragment key="dialogAction">
                <LoadingButton variant="contained" color="primary" loading={loadingSave} onClick={() => doAcceptReview(currentDetail)}>
                  Duyệt
                </LoadingButton>
                <LoadingButton variant="contained" color="error" loading={loadingSave} onClick={onRejectReview}>
                  Từ chối
                </LoadingButton>
                <LoadingButton variant="contained" color="warning" loading={loadingSave} onClick={onComment}>
                  Comment
                </LoadingButton>
              </Fragment>
            );
          }
          break;
        case 'Approving':
          if (filtersForm.approveStatus === 'InProgress') {
            return (
              <Fragment key="dialogAction">
                <LoadingButton variant="contained" color="primary" loading={loadingSave} onClick={() => doAcceptReview(currentDetail)}>
                  Duyệt
                </LoadingButton>
                <LoadingButton variant="contained" color="error" loading={loadingSave} onClick={onRejectReview}>
                  Từ chối
                </LoadingButton>
                <LoadingButton variant="contained" color="warning" loading={loadingSave} onClick={onComment}>
                  Comment
                </LoadingButton>
              </Fragment>
            );
          }
          break;
        case 'Approved':
          return (
            <Fragment key="dialogAction">
              <LoadingButton variant="contained" color="primary" loading={loadingSave} onClick={() => doCancelAcceptReview(currentDetail)}>
                Huỷ duyệt
              </LoadingButton>
              <LoadingButton variant="contained" color="warning" loading={loadingSave} onClick={onComment}>
                Comment
              </LoadingButton>
            </Fragment>
          );
        case 'Rejected':
          return (
            <Fragment key="dialogAction">
              <LoadingButton variant="contained" color="warning" loading={loadingSave} onClick={onComment}>
                Comment
              </LoadingButton>
            </Fragment>
          );
        default:
      }
    }
    switch (currentDetail.lc_status) {
      case 'New':
        return (
          <Fragment key="dialogAction">
            { isEdit && (
            <LoadingButton variant="contained" color="secondary" loading={loadingSave} onClick={() => doSendReview(currentDetail)}>
              Gửi duyệt
            </LoadingButton>
            ) }
          </Fragment>
        );
      default:
        return (
          <Fragment key="dialogAction">
            <LoadingButton variant="contained" color="warning" loading={loadingSave} onClick={onComment}>
              Comment
            </LoadingButton>
          </Fragment>
        );
    }
  };

  return (
    <>
      <TableMain
        optionEnum={optionEnum}
        loading={loadingMain}
        dataTable={dataTable}
        selected={selected}
        setSelected={setSelected}
        mappingData={mappingData}
        isModeApprove={isModeApprove}
        onClickRow={doClickRow}
        onOpenDeleteConfirm={setOpenDeleteConfirm}
        chartOptions={chartOptions}
        page={page}
        onChangePage={doChangePage}
        rowsPerPage={rowsPerPage}
        onChangeRowsPerPage={doChangeRowsPerPage}
        onSearch={doSearch}
      >
        <FormControlLabel
          key="toolForm"
          sx={{
            flex: '1 1', ml: 0, '& .MuiFormControlLabel-label': { whiteSpace: 'nowrap' }
          }}
          control={<Switch checked={isModeApprove} onChange={doChangeApproveMode} color="secondary" />}
          label="Phê Duyệt:"
          labelPlacement="start"
        />
        <PopoverFilter
          key="filters"
          isModeApprove={isModeApprove}
          filtersForm={filtersForm}
          updateFilterForm={updateFilterForm}
          onSubmit={doSubmitFilters}
          onClear={doClearFilters}
        />
      </TableMain>
      <InfoDialog
        isEdit={isEdit}
        maxWidth="lg"
        currentDetail={currentDetail}
        subTables={subTables}
        optionEnum={optionEnum}
        loading={loadingTableTab}
        isOpen={isOpenModal}
        mappingData={mappingData}
        onClose={() => { setOpenModal(false); }}
      >
        { actionReview() }
      </InfoDialog>
      <DeleteConfirmDialog
        isOpen={isOpenDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onSubmit={doSubmitDelete}
      />
      <PopoverComment
        id={`${mappingData.navTitle}-reason-popover`}
        title="Vui lòng nhập lý do từ chối (không bắt buộc)."
        placeholder="Lý do"
        anchorEl={anchorReasonEl}
        setAnchorEl={setAnchorReasonEl}
        onSubmit={doRejectReview}
      />
      <PopoverComment
        id={`${mappingData.navTitle}-comment-popover`}
        title="Vui lòng nhập bình luận."
        required
        placeholder="Bình luận"
        anchorEl={anchorCommentEl}
        setAnchorEl={setAnchorCommentEl}
        onSubmit={doComment}
      />
    </>
  );
};

TableModeTabs.propTypes = {
  mappingData: PropTypes.object
};

export default TableModeTabs;
