import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import cc from 'classcat';

import type { IEnumNodeData } from '@/shared/lib/types';

import styles from './Node.module.scss';

const MAX_VALUES = 12;

interface IEnumNodeProps {
  data: IEnumNodeData;
}

export default function EnumNode({ data }: IEnumNodeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <table
        className="font-sans bg-white border-2 border-separate border-black rounded-lg"
        style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
      >
        <thead title={data.documentation} className={cc([styles.head, 'drag-handle__custom'])}>
          <tr>
            <th className="p-2 font-extrabold border-b-2 border-black bg-emerald-200 rounded-t-md" colSpan={1}>
              {data.name}
              {!!data.dbName && <span className="font-mono font-normal">&nbsp;({data.dbName})</span>}
            </th>
          </tr>
        </thead>
        <tbody
          className={cc([
            'nodrag',
            'cursor-auto',
            'flex',
            'flex-col',
            'overflow-hidden',
            { 'max-h-[500px]': !expanded && data.values.length > MAX_VALUES },
          ])}
        >
          {data.values.map((val) => (
            <tr key={val} className={styles.row}>
              <td className="flex p-2 font-mono border-t-2 border-gray-300">{val}</td>
            </tr>
          ))}
        </tbody>
        {data.values.length > MAX_VALUES && (
          <tbody className="nodrag cursor-auto">
            <tr>
              <td className="flex">
                <button
                  type="button"
                  className="w-full px-4 py-2 font-semibold bg-blue-200 rounded cursor-pointer"
                  onClick={() => {
                    setExpanded(!expanded);
                  }}
                >
                  {expanded ? 'Fold' : 'Expand'}
                </button>
              </td>
            </tr>
          </tbody>
        )}
      </table>

      <Handle
        className={cc([styles.handle, styles.bottom])}
        type="source"
        position={Position.Bottom}
        id={data.name}
        isConnectable={false}
      />
    </div>
  );
}
