import { FC } from "react";
import RBTable from "react-bootstrap/Table";

interface ICustomTable {
  title: string;
  columns: any[];
  items: any[];
}

export const CustomTable: FC<ICustomTable> = ({ title, columns, items }) => {
  if (!columns.length) {
    return null;
  }

  return (
    <div>
      <p>
        {title}: {items.length}
      </p>

      <RBTable striped bordered hover variant="light">
        {columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((data, index) => (
                <th key={index}>{data?.toString()}</th>
              ))}
            </tr>
          </thead>
        )}

        {items.length > 0 && (
          <tbody>
            {items.map((patient, index) => (
              <tr key={index}>
                {Object.values(patient).map((data, index) => (
                  <td key={index}>{data?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </RBTable>
    </div>
  );
};
