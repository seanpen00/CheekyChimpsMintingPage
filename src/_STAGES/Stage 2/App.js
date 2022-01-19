import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/kr3.png";
import newbanner from "./assets/images/logo.png"
import "./style.css"

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  font-weight: bold;
  font-size: 40px;
  color: #000000;
  cursor: pointer;
  // box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  // -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  // -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    transition-duration: .4s;
    color: white;
    background-color: black;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 285.6px;
  height: (241.5)px;
  @media (min-width: 767px) {
    width: 428.5px;
    height: 362.33px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const claimNFTs = (_amount) => {
    _amount = document.getElementById("inputBox").value;
    if (_amount <= 0) {
      return;
    }
    setFeedback("Minting your KRebels NFT...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      // ********
      // You can change the line above to
      // .whiteListMint(blockchain.account, _amount) if you want only whitelisted
      // users to be able to mint through your website!
      // And after you're done with whitelisted users buying from your website,
      // You can switch it back to .mint(blockchain.account, _amount).
      // ********
      .send({
        gasLimit: 285000 * _amount,
        to: "0x5f96FdF27fB8D38d317BA94f642f6BE39080c71E", // the address of your contract
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((0.05 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong. Check your transaction on Etherscan to find out what happened!");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Your KRebels NFT(s) has been successfully minted!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)", fontSize: 40 }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24, backgroundColor: "#F7F9FF" }}>
        <s.TextTitle
          style={{
            display: "flex", flexDirection: "row", textAlign: "left", fontSize: 12, fontWeight: "bold", paddingRight: 10, margin: 0,
            borderStyle: "solid", borderColor: "black", borderWidth: 0,
            borderRadius: 50, textAlign: "center", justifySelf: "center", justifyContent: "center"
          }}
        >
          <a href="https://krebels.io/"><StyledImg className="logoShadow" alt={"KRebels Logo"}
            src={newbanner}
            style={{ width: 70, height: 70, textAlign: "center" }}></StyledImg></a>
        </s.TextTitle>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24, paddingTop: 0 }}>
          <s.Container flex={1} jc={"center"} ai={"center"} style={{ paddingTop: 0, flexDirection: "column" }}>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                borderStyle: "solid",
                borderColor: "black",
              }}>
              0.05 ETH + Gas <br/>
              Stage 1 Minting Now!
            </s.TextTitle>
            <StyledImg className="object" alt={"KRebel"} src={i1} style={{
              paddingTop: 0, borderStyle: "solid", borderColor: "black", borderWidth: 0,
              borderRadius: 0,
            }} />
            <s.TextTitle
              style={{
                textAlign: "center", fontSize: 80, fontWeight: "bold", borderStyle: "solid", borderColor: "black",
                borderWidth: 0,
                paddingLeft: 100,
                paddingRight: 100,
                borderRadius: 0,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {blockchain.account == null ? "????" : (data.totalSupply)}/9,999
            </s.TextTitle>
            {/* <s.SpacerMedium/> */}
            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                background: "linear-gradient(to bottom left,#C14092, #084FC3)",
                padding: 24,
                paddingTop: 0,
                borderStyle: "solid",
                borderColor: "black",
                borderWidth: 0,
                borderRadius: 30,
                fontSize: 40,
                maxWidth: 1000
              }}
            >
              {Number(data.totalSupply) == 9999 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    The sale has ended.
                  </s.TextTitle>
                  <s.SpacerSmall />
                  <s.TextDescription style={{ textAlign: "center" }}>
                    Dont worry, you're not missing out! You can still get KRebels on{" "}
                    <a
                      // target={"_blank"}
                      href={"https://testnets.opensea.io/"}
                    >
                      Opensea.io
                    </a>
                  </s.TextDescription>
                </>
              ) : (
                <>
                  {/* <s.TextTitle style={{ textAlign: "center", fontSize: 30 }}>
                  1 KR costs .01 ETH.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center", fontSize: 30 }}>
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall /> */}
                  <s.TextDescription style={{ textAlign: "center", fontSize: 40 }}>
                    {feedback}
                  </s.TextDescription>
                  {/* <s.SpacerMedium /> */}
                  {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription className="connectMint" style={{fontSize: 60, textAlign: "center", marginBottom: 0}}>
                        Connect to Mint
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledButton
                        style={{ fontFamily: "coder" }}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                          // UNCOMMENT THESE WHEN YOU ARE READY TO LAUNCH.
                        }}
                      >
                        CONNECT
                      </StyledButton>
                      <s.SpacerLarge />
                      {/* <s.TextDescription style={{textAlign: "center", fontSize: 30, marginBottom: 0, paddingBottom: 0}}>
                      <a href="https://google.com">KRebels NFT Smart Contract</a>
                    </s.TextDescription> */}
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription style={{ textAlign: "center", fontSize: 50 }}>
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <s.Container ai={"center"} jc={"center"} fd={"row"} style={{ marginTop: 0, paddingTop: 0 }}>
                      <form>
                        I want <input
                          id="inputBox"
                          placeholder="#"
                          type="number"
                          min="1"
                          max="5"
                          style={{
                            fontSize: 40,
                            textAlign: "center",
                            backgroundColor: "white",
                            borderWidth: 4,
                            borderColor: "black",
                            borderStyle: "solid",
                            borderRadius: 40,
                            paddingRight: 10,
                            // marginBottom: 20,
                            // paddingLeft: 0,
                            // marginLeft: 0,
                            width: 100,
                            height: 60,
                            fontFamily: "coder",
                          }}
                        /> KRebels
                      </form>
                      <s.SpacerSmall />
                      <StyledButton
                        style={{ fontFamily: "coder" }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(1);
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </StyledButton>
                    </s.Container>
                  )}
                </>
              )}
            </s.Container>
          </s.Container>
          {/* <s.SpacerMedium /> */}
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 40 }}>
            <a
              href="https://etherscan.io/address/0x5f96FdF27fB8D38d317BA94f642f6BE39080c71E"
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: 20,
              }}
            >KRebels Smart Contract</a>
          </s.TextDescription>
          <s.SpacerSmall />
          {/* <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          </s.TextDescription> */}
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
