interface IDownloadFileButtonProps {
  sourceText: string;
}

export function DownloadFileButton({ sourceText }: IDownloadFileButtonProps) {
  const handleDownload = () => {
    const fileName = 'prisma.schema';

    const blob = new Blob([sourceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="button floating" title="Copy link" aria-label="Copy link" onClick={handleDownload}>
      Download Schema
    </button>
  );
}
