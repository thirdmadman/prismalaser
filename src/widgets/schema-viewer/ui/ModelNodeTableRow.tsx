import type { ReactNode } from 'react';
import { Handle, Position, useReactFlow, useStoreApi } from '@xyflow/react';
import cc from 'classcat';

import {
  generateEnumEdgeTargetHandleId,
  generateRelationEdgeSourceHandleId,
  generateRelationEdgeTargetHandleId,
} from '@/shared/lib/prismaToFlow';
import type { IModelNodeData, IModelNodeDataColumn } from '@/shared/lib/types';

import styles from './Node.module.scss';

const isRelationed = ({ relationData }: IModelNodeDataColumn) => !!relationData?.side;

interface IModelNodeTableRowProps {
  data: IModelNodeData;
  sourceTableColumn: IModelNodeDataColumn;
}

export function ModelNodeTableRow({ data, sourceTableColumn }: IModelNodeTableRowProps) {
  const store = useStoreApi();
  const { setCenter, getZoom } = useReactFlow();

  const focusNode = async (nodeId: string) => {
    const { nodeLookup } = store.getState();
    const nodes = Array.from(nodeLookup).map(([, node]) => node);

    if (nodes.length > 0) {
      const node = nodes.find((iterNode) => iterNode.id === nodeId);

      if (!node) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const x = node.position.x + node.width! / 2;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const y = node.position.y + node.height! / 2;
      const zoom = getZoom();

      await setCenter(x, y, { zoom, duration: 1000 });
    }
  };

  const isRelations = isRelationed(sourceTableColumn);
  let targetHandle: ReactNode | null = null;
  let sourceHandle: ReactNode | null = null;

  if (sourceTableColumn.kind === 'enum') {
    const handleId = generateEnumEdgeTargetHandleId(data.name, sourceTableColumn.name);
    targetHandle = (
      <Handle
        key={handleId}
        className={cc([styles.handle, styles.left])}
        type="target"
        id={handleId}
        position={Position.Left}
        isConnectable={false}
      />
    );
  } else if (sourceTableColumn.relationData) {
    const targetHandleId = generateRelationEdgeTargetHandleId(
      data.name,
      sourceTableColumn.relationData.name,
      sourceTableColumn.name
    );
    const sourceHandleId = generateRelationEdgeSourceHandleId(
      data.name,
      sourceTableColumn.relationData.name,
      sourceTableColumn.name
    );

    targetHandle =
      sourceTableColumn.relationData.side === 'target' ? (
        <Handle
          key={targetHandleId}
          className={cc([styles.handle, styles.left])}
          type="target"
          id={targetHandleId}
          position={Position.Left}
          isConnectable={false}
        />
      ) : null;
    sourceHandle =
      sourceTableColumn.relationData.side === 'source' ? (
        <Handle
          key={sourceHandleId}
          className={cc([styles.handle, styles.right])}
          type="source"
          id={sourceHandleId}
          position={Position.Right}
          isConnectable={false}
        />
      ) : null;
  }

  const isEnum = sourceTableColumn.kind === 'enum';
  const isString = sourceTableColumn.displayType.toLocaleLowerCase() === 'string';
  const isContainsKeywords = sourceTableColumn.defaultValue?.match(/\(.*\)/);

  return (
    <tr key={sourceTableColumn.name} className={cc([styles.fieldsTableRow])} title={sourceTableColumn.documentation}>
      <td className="font-mono font-semibold border-t-2 border-r-2 border-gray-300 text-[#0e107e] dark:text-[#76a2c0]">
        <button
          type="button"
          className={cc(['relative', 'p-2', { 'cursor-pointer': isRelations }])}
          onClick={async () => {
            if (!isRelations) {
              return;
            }
            await focusNode(sourceTableColumn.type);
          }}
        >
          {sourceTableColumn.name}
          {targetHandle}
        </button>
      </td>
      <td
        className={cc([
          'p-2 font-mono border-t-2 border-r-2 border-gray-300 ',
          { 'text-[#2e7f98] dark:text-[#46b59a]': !isRelations && !isEnum },
          { 'text-[#2702fc] dark:text-[#5385ae]': isRelations || isEnum },
        ])}
      >
        {sourceTableColumn.displayType}
      </td>
      <td className="font-mono border-t-2 border-gray-300">
        <div className="relative p-2">
          <p
            className={cc([
              { 'text-[#64a897] dark:text-[#bfc7c1]': !isEnum && !isContainsKeywords && !isString },
              { 'text-[#148659] dark:text-[#926b5b]': isString },
              { 'text-[#3b3b3b] dark:text-[#b7c3c2]': isEnum },
              { 'text-[#785e29] dark:text-[#c2c39c]': isContainsKeywords },
            ])}
          >
            {sourceTableColumn.defaultValue ?? ''}
          </p>
          {sourceHandle}
        </div>
      </td>
    </tr>
  );
}
