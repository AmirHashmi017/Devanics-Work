import * as React from 'react';
import { styled } from '@mui/material/styles';
import usePagination from '@mui/material/usePagination';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Responsive List of Page Numbers
const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '8px',
});

const PageButton = styled(Button)(({ theme, selected }: { theme?: any; selected?: boolean }) => ({
  minWidth: 36,
  height: 36,
  fontWeight: selected ? 'bold' : 400,
  backgroundColor: selected ? theme.palette.action.hover : 'transparent',
  color: theme.palette.text.primary,
  borderRadius: 8,
  textTransform: 'none',
  padding: '6px 12px',
  boxShadow: selected ? `inset 0 0 0 1px ${theme.palette.divider}` : 'none',
}));

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  marginTop: '32px',
  padding: '0 16px',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
}));

export default function CustomPagination() {
  const { items } = usePagination({
    count: 10,
  });

  const prevItem = items.find(item => item.type === 'previous');
  const nextItem = items.find(item => item.type === 'next');
  const pageItems = items.filter(item => item.type === 'page' || item.type.includes('ellipsis'));

  return (
    <Wrapper>
      {prevItem && (
        <PageButton variant="outlined" startIcon={<ArrowBackIcon />} {...prevItem}>
          Previous
        </PageButton>
      )}

      <List>
        {pageItems.map((item, index) => {
          if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
            return <li key={index}>…</li>;
          }

          return (
            <li key={index}>
              <PageButton selected={item.selected} {...item}>
                {item.page}
              </PageButton>
            </li>
          );
        })}
      </List>

      {nextItem && (
        <PageButton variant="outlined" endIcon={<ArrowForwardIcon />} {...nextItem}>
          Next
        </PageButton>
      )}
    </Wrapper>
  );
}
