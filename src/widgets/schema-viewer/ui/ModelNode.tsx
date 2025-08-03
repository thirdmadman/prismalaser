import cc from 'classcat';

import { ModelNodeTableRow } from './ModelNodeTableRow';
import type { IModelNodeData } from '@/shared/lib/types';

import styles from './Node.module.scss';
import './ReactFlowNode.css';

interface IModelNodeProps {
  data: IModelNodeData;
}

export default function ModelNode({ data }: IModelNodeProps) {
  const tableRows = data.columns.map((col) => <ModelNodeTableRow data={data} sourceTableColumn={col} key={col.name} />);

  return (
    <table
      className="font-sans bg-white border-2 border-separate border-black rounded-lg"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <thead title={data.documentation} className={cc([styles.head, 'drag-handle__custom'])}>
        <tr>
          <th className="p-2 font-extrabold bg-gray-200 border-b-2 border-black rounded-t-md" colSpan={4}>
            {data.name}
            {!!data.dbName && <span className="font-mono font-normal">&nbsp;({data.dbName})</span>}
          </th>
        </tr>
      </thead>
      <tbody className="nodrag cursor-auto">{tableRows}</tbody>
    </table>
  );
}
