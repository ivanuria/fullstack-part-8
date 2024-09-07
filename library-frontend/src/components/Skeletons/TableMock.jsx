import {
  Skeleton,
  TableCell,
  TableRow
} from '@mui/material'

const TableMock = ({ columns=3, rows=3 }) => {
  const tableRowsMock = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < columns; c++) {
      row.push(<TableCell key={`${r}-${c}`}><Skeleton variant='text' sx={{ fontSize:'inherit' }}/></TableCell>)
    }
    tableRowsMock.push(<TableRow key={r}>{row}</TableRow>)
  }
  return (<>{tableRowsMock}</>)
}

export default TableMock