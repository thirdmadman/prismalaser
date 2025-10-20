import { MenuPanel } from './MenuPanel';
import { MenuPanelButton } from './MenuPanelButton';
import {
  clearStoredData,
  formatSchemaAsync,
  insertPositionComments,
  selectText,
} from '@/app/features/editor/editorSlice';
import { selectNodes } from '@/app/features/flowView/flowViewSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { copyUrlToClipboard } from '@/shared/lib/copyUrlToClipboard';
import { downloadTextAsFile } from '@/shared/lib/downloadTextAsFile';

export default function FilePanel() {
  const text = useAppSelector(selectText);
  const nodes = useAppSelector(selectNodes);
  const dispatch = useAppDispatch();

  return (
    <MenuPanel>
      <MenuPanelButton onClick={() => dispatch(formatSchemaAsync(text))}>Format</MenuPanelButton>
      <MenuPanelButton
        onClick={() => {
          downloadTextAsFile(text);
        }}
      >
        Download Schema
      </MenuPanelButton>
      <MenuPanelButton
        onClick={async () => {
          await copyUrlToClipboard(text);
        }}
      >
        Copy link
      </MenuPanelButton>
      <MenuPanelButton
        onClick={() => {
          dispatch(clearStoredData());
        }}
      >
        Delete stored data
      </MenuPanelButton>
      <MenuPanelButton
        onClick={() => {
          dispatch(insertPositionComments(nodes));
        }}
      >
        Add position comments
      </MenuPanelButton>
    </MenuPanel>
  );
}
