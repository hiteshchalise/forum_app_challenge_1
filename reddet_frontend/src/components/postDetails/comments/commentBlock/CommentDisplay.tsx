import RichTextEditor from '@mantine/rte';

export default function CommentDisplay({ commentBody }: { commentBody: string }) {
  return (
    <RichTextEditor
      sx={(theme) => ({
        backgroundColor: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2], 0.8),
        border: 0,
      })}
      readOnly
      value={commentBody}
      onChange={() => { }}
    />
  );
}
