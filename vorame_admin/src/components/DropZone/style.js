import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";

export const DragDropArea = styled("div")(({ theme }) => ({
  border: "2px dashed",
  borderColor: theme.palette.grey[400],
  borderRadius: "10px",
  padding: theme.spacing(2),
  textAlign: "center",
  paddingTop: 40,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  height: "200px",
  [theme.breakpoints.down("sm")]: {
    height: "130px",
    paddingTop: 5,
  },
}));

export const ImageError = styled("div")(({ theme }) => ({
  color: theme.palette.error.main,
  margin: "3px 14px 20px",
  fontSize: "0.75rem",
}));

export const ImagePreviewWrapper = styled("div")(({ theme }) => ({
  marginTop: "0px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    marginTop: "20px",
  },
}));

export const IconButtonWrapper = styled(IconButton)(({ theme }) => ({
  height: "120px",
  width: "150px",
  objectFit: "cover",
  borderRadius: "8px",
  [theme.breakpoints.down("sm")]: {
    height: "80px",
    width: "90px",
  },
}));

export const CancelButtonWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(14),
  right: theme.spacing(20),
  zIndex: 10,
  [theme.breakpoints.down("sm")]: {
    bottom: theme.spacing(9),
    right: theme.spacing(10),
  },
  // Applies styles when the screen width is less than 400px
  [theme.breakpoints.down(400)]: {
    bottom: theme.spacing(9),
    right: theme.spacing(7),
  },
}));

export const ImagePreview = styled("img")(({ theme }) => ({
  height: "120px",
  width: "150px",
  objectFit: "cover",
  borderRadius: "8px",
  [theme.breakpoints.down("sm")]: {
    height: "80px",
    width: "90px",
  },
}));

export const PdfIconWrapper = styled(PictureAsPdf)(({ theme }) => ({
  fontSize: 100,
  [theme.palette.down("sm")]: {
    fontSize: 80,
  },
}));

export const StyledVideo = styled("video")(({ theme }) => ({
  width: "140px",
  height: "110px",
  [theme.breakpoints.down("sm")]: {
    height: "80px",
    width: "120px",
  },
}));

export const CancelVideoWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(11),
  right: theme.spacing(20.5),
  zIndex: 10,
  [theme.breakpoints.down("sm")]: {
    bottom: theme.spacing(9),
    right: theme.spacing(8),
  },
  // Applies styles when the screen width is less than 400px
  [theme.breakpoints.down(400)]: {
    bottom: theme.spacing(9),
    right: theme.spacing(4),
  },
}));

export const SmallCancelButton = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(14),
  right: theme.spacing(3),
  zIndex: 10,
  [theme.breakpoints.down("sm")]: {
    bottom: theme.spacing(9),
    right: theme.spacing(10),
  },
  // Applies styles when the screen width is less than 400px
  [theme.breakpoints.down(400)]: {
    bottom: theme.spacing(9),
    right: theme.spacing(7),
  },
}));
