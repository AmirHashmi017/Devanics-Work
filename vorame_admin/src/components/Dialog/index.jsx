import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as DeleteIcon } from "../../assets/deleteIcon.svg";

const ConfirmDialog = ({
  open,
  setOpen,
  onConfirm,
  isLoading = false,
  title ,
  dialogContext ,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
   <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm" 
  PaperProps={{
    style: {
      borderRadius: "12px",
      padding: "24px",
      position: "relative",
      width: "100%",
      maxWidth: "350px", 
    },
  }}
>
  {/* Close Button */}
  <IconButton
    onClick={handleClose}
    style={{
      position: "absolute",
      top: "12px",
      right: "12px",
    }}
  >
    <CloseIcon />
  </IconButton>

  {/* Icon */}
  <div
    style={{
      backgroundColor: "#FEE2E2",
      width: 48,
      height: 48,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    }}
  >
    <DeleteIcon style={{ width: 24, height: 24, color: "#DC2626" }} />
  </div>

  {/* Title */}
  <DialogTitle
    style={{
      padding: 0,
      fontWeight: 600,
      fontSize: "18px",
      marginBottom: 8,
      lineHeight: "1.4",
      wordWrap: "break-word",
    }}
  >
    {title}
  </DialogTitle>

  {/* Context */}
  <DialogContent
    style={{
      padding: 0,
      color: "#6B7280",
      fontSize: "14px",
      marginBottom: "24px",
      lineHeight: "1.6",
      wordWrap: "break-word",
    }}
  >
    {dialogContext}
  </DialogContent>

  {/* Buttons */}
  <DialogActions
    style={{
      justifyContent: "flex-start",
      padding: 0,
      gap: "12px",
    }}
  >
    <Button
      onClick={handleClose}
      variant="outlined"
      style={{
        borderColor: "#D1D5DB",
        color: "#1F2937",
        textTransform: "none",
        fontWeight: 500,
        borderRadius: "8px",
        padding: "6px 24px",
        width: "50%",
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={onConfirm}
      variant="contained"
      disabled={isLoading}
      style={{
        backgroundColor: "#DC2626",
        color: "white",
        textTransform: "none",
        fontWeight: 500,
        borderRadius: "8px",
        padding: "6px 24px",
        width: "50%",
      }}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  </DialogActions>
</Dialog>

  );
};

export default ConfirmDialog;








// import React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

// const ConfirmDialog = (props) => {
//   const {
//     title,
//     dialogContext,
//     open,
//     setOpen,
//     onConfirm,
//     isLoading = false,
//   } = props;

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//     >
//       <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description">
//           {dialogContext}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button variant="contained" color="inherit" onClick={handleClose}>
//           No
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={onConfirm}
//           disabled={isLoading}
//           autoFocus
//         >
//           {isLoading ? "Yes..." : "Yes"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ConfirmDialog;
