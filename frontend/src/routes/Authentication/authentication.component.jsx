import React, { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import SignIn from "../../components/forms/login.component";
import SignUp from "../../components/forms/signUp.component";
import { Box, Container, Button } from "@chakra-ui/react";

const Authentication = () => {
  const [signIn, setSignIn] = useState(true);
  const setSignUp = () => {
    setSignIn(false);
  };
  return (
    <>
      <Outlet />
      <Container maxW="xl" centerContent marginTop="8%">
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          {signIn ? <SignIn /> : <SignUp />}
          {signIn ? (
            <Button
              variant="solid"
              colorScheme="red"
              width="100%"
              onClick={setSignUp}
              marginTop="1%"
            >
              Create New Account
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Authentication;
