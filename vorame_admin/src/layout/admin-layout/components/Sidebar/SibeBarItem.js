import React, { useState } from "react";
import { ListItemIcon, ListItemText, Collapse, List, Box } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { StyledListItemButton } from "./style";

const SidebarItem = ({
  icon,
  iconActive,
  iconHover,
  text,
  nestedItems,
  open,
  onClick,
  nestedOpen,
  onNestedClick,
  isActive,
}) => {


  return (
    <>

      <StyledListItemButton
        onClick={onClick}
        icon={isActive ? iconActive : isActive ? iconHover : icon}
      >
        <ListItemIcon>
          <img
            src={isActive ? iconActive : isActive ? iconHover : icon}
            alt={text}
          />
        </ListItemIcon>
        <ListItemText primary={text} />
        {nestedItems ? (
          nestedOpen ? (
            <ExpandLess />
          ) : (
            <Box component='img' width='20px' height='20px' src={`/icons/create-down.svg`} alt="More" />
          )
        ) : null}
      </StyledListItemButton>
      {nestedItems && (
        <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
          <List component="div">
            {nestedItems.map((item, index) => (
              <StyledListItemButton
                key={index}
                onClick={() => item.onClick(item.path)}
                isActive={item.path === window.location.pathname}
              >
                <ListItemText primary={item.text} />
              </StyledListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
};

export default SidebarItem;
