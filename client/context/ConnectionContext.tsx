import { ethers } from "ethers";
import React, {
  ReactNode,
  createContext,
  useState,
  useCallback,
} from "react";
import WaveContract from "./Wave.json";

interface IConnectionContext {
  ethersProvider: ethers.providers.Web3Provider | undefined;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  accounts: string[] | undefined;
  contract: ethers.Contract | undefined;
  error: string | undefined;
  network: ethers.providers.Network | undefined;
}

export const ConnectionContext = createContext({} as IConnectionContext);

export const ConnectionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ethersProvider, setEthersProvider] =
    useState<ethers.providers.Web3Provider>();
  const [network, setNetwork] = useState<ethers.providers.Network>();
  const [accounts, setAccounts] = useState<string[]>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [error, setError] = useState<string>();
  //On goerli
  const contractAddress = "0x47234AAACbB17b0ec81823EAa0E67A2623A5Eed1";
  
  const connectWallet = useCallback(async () => {
    console.log("connecting")
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if(!provider) {
      setError("Please install Metamask!");
      return;
    }
    
    const signer = provider.getSigner();
    const network = await provider.getNetwork();

    const contract = new ethers.Contract(contractAddress, WaveContract.abi, signer);
    await provider.send("eth_requestAccounts", []);
    const accounts = await provider.listAccounts();

    setAccounts(accounts)
    setEthersProvider(provider);
    setContract(contract);
    setNetwork(network);
  }, []);

  // set states to initial setting when user disconnect from wallet / auth0
  const disconnectWallet = async () => {
    setEthersProvider(undefined);
  };

  return (
    <ConnectionContext.Provider
      value={{
        accounts,
        ethersProvider,
        connectWallet,
        disconnectWallet,
        contract,
        error,
        network
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};