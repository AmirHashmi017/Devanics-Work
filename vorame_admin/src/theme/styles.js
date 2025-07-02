import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
import { shadows } from "./constants";

export const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: "none !importatnt",
    borderRadius: '16px',

    backgroundColor: "transparent",
    // padding: 10,
    border: `1px solid #EAECEE`

}));
