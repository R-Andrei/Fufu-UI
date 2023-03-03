export type DataArray = any[];

export interface Column {
    name: string,
    title: string,
    textAlign?: string
}

export type Columns = Column[];


export interface TableProps {
    data: DataArray,
    columns: Columns,
    title?: string,
    index?: boolean,
    className?: string,
    celled?: boolean
}

export interface RenderCellProps {
    record: any,
    column: Column
}
