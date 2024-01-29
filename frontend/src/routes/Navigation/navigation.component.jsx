import React from "react";
import {
  useDisclosure,
  Text,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
import DrawerComp from "../../components/navbar/drawer.component";

import logo from "../../logo.svg";
import { Outlet } from "react-router-dom";

const Navigation = () => {
  const btnRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <img width="48" height="48" src={logo} alt="triller-app" />
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge effect={Effect.SCALE} />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" />
            </MenuButton>
            <MenuList>
              <MenuItem>My Profile</MenuItem> <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <DrawerComp isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      <Outlet />
    </>
  );
};

export default Navigation;
