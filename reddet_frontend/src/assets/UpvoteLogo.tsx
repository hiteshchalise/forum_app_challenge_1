import { createStyles } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { ReactEventHandler } from 'react';

interface IUpvoteLogoProps {
  active: boolean,
  onClickListener: ReactEventHandler,
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    '&:hover': {
      backgroundColor: theme.fn.rgba(theme.colors.red[9], 0.2),
      borderRadius: theme.radius.sm,
    },
  },
}));

function UpvoteLogo({ active, onClickListener }: IUpvoteLogoProps) {
  const { hovered, ref } = useHover();
  const { classes } = useStyles();
  return (
    <div ref={ref} className={classes.wrapper}>
      <svg onClick={onClickListener} fill={active || hovered ? '#FF5800' : '#8F8F8F'} width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" /></svg>
    </div>
  );
}

export default UpvoteLogo;
