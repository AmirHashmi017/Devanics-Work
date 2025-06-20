import type React from "react"

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return <table className={`table ${className}`}>{children}</table>
}

export const TableHeader: React.FC<TableProps> = ({ children, className = "" }) => {
  return <thead className={`table__header ${className}`}>{children}</thead>
}

export const TableBody: React.FC<TableProps> = ({ children, className = "" }) => {
  return <tbody className={`table__body ${className}`}>{children}</tbody>
}

export const TableRow: React.FC<TableProps> = ({ children, className = "" }) => {
  return <tr className={`table__row ${className}`}>{children}</tr>
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = "", ...props }) => {
  return (
    <th className={`table__head ${className}`} {...props}>
      {children}
    </th>
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = "", ...props }) => {
  return (
    <td className={`table__cell ${className}`} {...props}>
      {children}
    </td>
  )
}
