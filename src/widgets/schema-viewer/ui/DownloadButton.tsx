import downloadIcon from '@iconify/icons-gg/software-download';
import { Icon } from '@iconify/react';
import { toPng } from 'html-to-image';
import { ControlButton, getRectOfNodes, getViewportForBounds, useReactFlow } from 'reactflow';

import styles from './FlowView.module.css';

const downloadImage = (dataUrl: string) => {
  const a = document.createElement('a');

  a.setAttribute('download', 'prismalaser-export.png');
  a.setAttribute('href', dataUrl);
  a.click();
};

// Mostly a copy from the React Flow example: https://reactflow.dev/examples/misc/download-image
export default function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const { height: imageHeight, width: imageWidth } = nodesBounds;
    const transform = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const viewport: HTMLDivElement = document.querySelector('.react-flow__viewport')!;

    toPng(viewport, {
      backgroundColor: '#e5e7eb',
      width: imageWidth,
      height: imageHeight,
      style: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        width: imageWidth as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        height: imageHeight as any,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    })
      .then(downloadImage)
      .catch(console.error);
  };

  return (
    <ControlButton className={styles.noShrinkIcon} title="Download as PNG" onClick={onClick}>
      <Icon icon={downloadIcon} />
    </ControlButton>
  );
}
