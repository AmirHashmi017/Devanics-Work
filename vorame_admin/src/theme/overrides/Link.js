export default function Link(theme) {
  return {
    // For styling link override (globally for all components)
    MuiLink: {
      styleOverrides: {
        root: {
          color: theme.palette.common.dark,
          textDecoration: "underline",
          textDecorationColor: theme.palette.common.dark,
          cursor: "pointer",
        },
      },
    },
  };
}
