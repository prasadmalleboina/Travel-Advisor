import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    minHeight: '64px',
  },

  title: {
    fontWeight: 600,

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  search: {
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.15)',

    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.22)',
    },

    width: '260px',
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },

  inputRoot: {
    color: 'inherit',
    width: '100%',
  },

  inputInput: {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: '100%',
  },

  brand: {
    display: 'flex',
    flexDirection: 'column',
  },

  developer: {
    fontSize: '11px',
    opacity: 0.85,
    marginTop: '-2px',
  },
}));
