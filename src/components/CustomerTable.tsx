import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import styled, { createGlobalStyle } from 'styled-components';
import customerData from '../data/data.json';
import portfolioData from '../data/portfolio.json';
import RiskProfileData from '../data/riskProfiles.json';
import { Customer } from '../interfaces/Customer';
import { Portfolio } from '../interfaces/Portfolio';
import { RiskProfile } from '../interfaces/RiskProfile';

// Global Styles for Modal Blur Effect
const GlobalStyles = createGlobalStyle<{ blur: boolean }>`
  body {
    overflow: ${({ blur }) => (blur ? 'hidden' : 'auto')};
  }

  .modalBlur {
    backdrop-filter: blur(8px);
  }
`;

// Styled Components

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top: 20px;`

const TableContainer = styled.div`
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.borderColor};
  margin-top: 1rem;

  th,
  td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    border-right: 1px solid ${({ theme }) => theme.borderColor};
    font-size: 0.9rem;
    background-color: ${({ theme }) => theme.tableBackground};
    color: ${({ theme }) => theme.tableColor};
  }

  th {
    background-color: ${({ theme }) => theme.tableHeaderBackground};
    cursor: pointer;
    position: relative;

    &:hover {
      background-color: ${({ theme }) => theme.tableHeaderHover};
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  td:last-child {
    border-right: none;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem;

  button {
    margin: 0 0.2rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid ${({ theme }) => theme.paginationButtonBorder};
    border-radius: 4px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.paginationButtonBackground};
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.paginationButtonHover};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  select {
    padding: 0.3rem 0.5rem;
    border: 1px solid ${({ theme }) => theme.paginationSelectBorder};
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: ${({ theme }) => theme.paginationSelectFocusBorder};
      outline: none;
    }
  }
`;

const AdaptiveButton = styled.button`
  margin: 0 0.2rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.buttonBorderColor};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonTextColor};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ModalContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.modalBackground};
  max-width: 600px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.modalHeaderColor};
`;

const ModalList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ModalItem = styled.li`
  margin-bottom: 0.5rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.buttonBorderColor};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonTextColor};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  width: 10%;
  &:focus{
    outline: 2px solid ${({ theme }) => theme.buttonBorderColor};
  }
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.buttonBorderColor};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonTextColor};
  &:focus{
    outline: 2px solid ${({ theme }) => theme.buttonBorderColor};
  }
`;

const RowLength = styled.span`
  margin-left: 10px;
  margin-right: 10px;
`;

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'fullName', desc: false },
  ]);
  const { t } = useTranslation();

  
  const data = useMemo(() => customers, [customers]);

  // prepare the table columns
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        header: t('Full Name'),
        id: 'fullName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: (info) => `${info.row.original.firstName} ${info.row.original.lastName}`,
        footer: props => props.column.id,
      },
      {
        header: t('Risk Profile'),
        accessorFn: (row) => `${row.riskProfileDetails?.name}`,
        footer: props => props.column.id,
      },
      {
        header: t('Annual Income'),
        accessorKey: 'annualIncome',
        cell: (info) => `${new Intl.NumberFormat('de-CH', { style: 'currency', currency: `${info.row.original.currency}` }).format(info.row.original.annualIncome)}`,
        footer: props => props.column.id,
      },
      {
        header: t('Residence'),
        accessorKey: 'residence',
        footer: props => props.column.id,
      },
      {
        header: t('Client Type'),
        accessorFn: (row) => `${row.clientType}`,
        cell: (info) => {
          return (
            <span>
              {info.row.original.clientType.toLowerCase() === 'private' ? '🔒' : '🛒'} {info.row.original.clientType.toLowerCase()}
            </span>
          );
        },
        footer: props => props.column.id,
      },
      {
        header: t('Portfolios'),
        id: 'portfolios',
        cell: ({ row }) => (
          <AdaptiveButton onClick={() => handleViewPortfolios(row.original)}>
            View Portfolios
          </AdaptiveButton>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      sorting: [{ id: 'fullName', desc: true }],
    },
  });

  // open portfolio modal
  const handleViewPortfolios = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // filter the rows
  const filteredRows = table.getRowModel().rows.filter(row =>
    Object.values(row.original).some(value =>
      value.name?.toLowerCase().includes(filterText.toLowerCase()) || ( typeof value === 'string' && value.toLowerCase().includes(filterText.toLowerCase()) )
    )
  );

  useEffect(() => {
    // removes unwanted "," before object ending
    const cleanJSON = (jsonString: string) => {
      return jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    };

    try {
      // clean and prepare the data
      const cleanedCustomerData = cleanJSON(customerData.toString());
      const parsedCustomerData: Customer[] = JSON.parse(cleanedCustomerData);

      const cleanedPortfolio = cleanJSON(portfolioData.toString());
      const parsedPortfolio: Portfolio[] = JSON.parse(cleanedPortfolio);

      const cleanedRiskProfilesData = cleanJSON(RiskProfileData.toString());
      const parsedRiskProfilesData: RiskProfile[] = JSON.parse(cleanedRiskProfilesData);

      // Combine customer data with portfolios and riskProfiles
      const customers = parsedCustomerData.map(customer => {
        const portfolio = parsedPortfolio.find(portfolio => portfolio.portfolioId === customer.clientId);
        const riskProfileDetails = parsedRiskProfilesData.find(riskProfile => riskProfile.id === customer.riskProfile);
        return {
          ...customer,
          portfolios: portfolio ? portfolio.investments : [],
          riskProfileDetails: riskProfileDetails || undefined
        };
      });

      setCustomers(customers); // Set state after processing data
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
      <>
      <GlobalStyles blur={isModalOpen} />
      <Container>
      <FilterInput
            type="text"
            placeholder={t('Filter table...')}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
      </Container>
      <TableContainer>
        <Table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()}>
                    <div className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
        </Table>
        <PaginationControls>
        <div>
            <Select
            title="pagination select"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {t('Show')} {pageSize}
                </option>
              ))}
            </Select>
            <RowLength>
              {table.getRowModel().rows.length} {t('of')} {table.getRowCount()} {t('Rows')}
            </RowLength>
          </div>
          <div>
            <AdaptiveButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {'<<'}
            </AdaptiveButton>
            <AdaptiveButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {'<'}
            </AdaptiveButton>
            <span className="flex items-center gap-1">
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
            </span>
            <AdaptiveButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {'>'}
            </AdaptiveButton>
            <AdaptiveButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              {'>>'}
            </AdaptiveButton>
          </div>
        </PaginationControls>
      </TableContainer>
      {isModalOpen && selectedCustomer && (
        <ModalContainer className="modalBlur">
          <ModalContent>
            <ModalHeader>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}'s ${t('Portfolios')}`}</ModalHeader>
            <ModalList>
              {selectedCustomer.portfolios?.map((investment, index) => (
                <ModalItem key={index}>
                  {t("Investment Type")}: {investment.investmentType} | {t("Amount")}: {new Intl.NumberFormat('de-CH', { style: 'currency', currency: `${investment.currency}` }).format(investment.amount)}
                </ModalItem>
              ))}
            </ModalList>
            <AdaptiveButton onClick={() => setIsModalOpen(false)}>Close</AdaptiveButton>
          </ModalContent>
        </ModalContainer>
      )}
      </>
  );
};

export default CustomerTable;
